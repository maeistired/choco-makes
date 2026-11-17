#!/usr/bin/env python3
"""Rebuild data/shop.json from the inventory spreadsheets.

    python3 tools/build_shop.py           check + rebuild
    python3 tools/build_shop.py --check   check only, change nothing

Edit these (Numbers, Excel or Google Sheets → export as CSV):
    inventory/products.csv   one row per variant (or one row for a product with no variants)
    inventory/updates.csv    date (YYYY-MM-DD), text

Photos: drop originals in photos/ named after the product id
(e.g. photos/lilac-dot-notebook.jpg, .png or .heic). For a colour or other
variant, add the variant name: photos/grid-notepad-purple.heic. More shots
of one product: photos/<id>-2.heic, -3 ... Shots shared by a whole deal group:
photos/notepads-1.heic, -2 ... The photo at the top of the page: photos/header.heic.
All are resized into assets/img/products/ automatically. Settings stay in data/shop.json.
"""
import csv
import json
import re
import subprocess
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PRODUCTS_CSV = ROOT / "inventory" / "products.csv"
UPDATES_CSV = ROOT / "inventory" / "updates.csv"
SHOP_JSON = ROOT / "data" / "shop.json"
PHOTO_IN = ROOT / "photos"
PHOTO_OUT = ROOT / "assets" / "img" / "products"
CLOTHS = {"lilac", "pink", "blue", "stone"}
PHOTO_EXTS = (".jpg", ".jpeg", ".png", ".heic", ".webp")
YES = {"yes", "y", "true", "1", "x"}

errors, notes = [], []


def slug(text):
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def money(raw, where):
    raw = (raw or "").strip().replace("$", "").replace(",", "")
    if raw == "":
        return None
    try:
        value = float(raw)
    except ValueError:
        errors.append(f"{where}: '{raw}' isn't a price")
        return None
    if value < 0:
        errors.append(f"{where}: price can't be negative")
    return int(value) if value.is_integer() else round(value, 2)


def whole(raw, where, field):
    raw = (raw or "").strip()
    if raw == "":
        return None
    if not re.fullmatch(r"\d+", raw):
        errors.append(f"{where}: {field} '{raw}' must be a whole number (0 or more)")
        return None
    return int(raw)


def read_csv(path):
    if not path.exists():
        errors.append(f"Missing {path.relative_to(ROOT)}")
        return []
    with path.open(newline="", encoding="utf-8-sig") as f:
        rows = list(csv.DictReader(f))
    clean = []
    for i, row in enumerate(rows, start=2):  # row 1 is the header
        row = {(k or "").strip().lower(): (v or "").strip() for k, v in row.items()}
        if any(row.values()):
            row["_line"] = i
            clean.append(row)
    return clean


def build_products():
    products, order, categories, groups = {}, [], [], {}
    for row in read_csv(PRODUCTS_CSV):
        where = f"products.csv row {row['_line']}"
        name = row.get("name", "")
        if not name:
            errors.append(f"{where}: name is empty")
            continue
        pid = slug(row.get("id") or name)
        p = products.get(pid)
        if p is None:
            category = row.get("category", "")
            if not category:
                errors.append(f"{where}: '{name}' needs a category")
            elif category not in categories:
                categories.append(category)
            price = money(row.get("price"), where)
            if price is None:
                errors.append(f"{where}: '{name}' needs a price")
            cloth = (row.get("cloth") or "lilac").lower()
            if cloth not in CLOTHS:
                errors.append(f"{where}: cloth '{cloth}' must be one of {', '.join(sorted(CLOTHS))}")
            p = {"id": pid, "name": name, "category": category, "price": price}
            bq = whole(row.get("bundle_qty"), where, "bundle_qty")
            bp = money(row.get("bundle_price"), where)
            if (bq is None) != (bp is None):
                errors.append(f"{where}: fill both bundle_qty and bundle_price, or neither")
            elif bq is not None:
                if bq < 2:
                    errors.append(f"{where}: bundle_qty must be 2 or more")
                elif price is not None and bp >= bq * price:
                    notes.append(f"'{name}': bundle {bq} for ${bp} isn't cheaper than buying {bq} separately")
                p["bundle"] = {"qty": bq, "price": bp}
                group = row.get("deal_group", "").lower()
                if group:
                    p["bundle"]["group"] = group
                    first = groups.setdefault(group, (bq, bp, name))
                    if first[:2] != (bq, bp):
                        errors.append(f"{where}: '{name}' is in deal group '{group}' but its bundle "
                                      f"({bq} for ${bp}) differs from '{first[2]}' ({first[0]} for ${first[1]})")
            elif row.get("deal_group"):
                errors.append(f"{where}: '{name}' has a deal_group but no bundle_qty/bundle_price")
            if row.get("section"):
                p["section"] = row["section"]
            elif products and "section" in products[order[-1]]:
                p["section"] = products[order[-1]]["section"]  # carries on from the row above
            if row.get("description"):
                p["description"] = row["description"]
            p["photo"] = ""
            p["cloth"] = cloth
            if row.get("featured", "").lower() in YES:
                p["featured"] = True
            if row.get("variant"):
                p["variantLabel"] = row.get("variant_label") or "Option"
                if row.get("variant_note"):
                    p["variantNote"] = row["variant_note"]
                p["variants"] = []
            products[pid] = p
            order.append(pid)
        elif row.get("name") and row["name"] != p["name"]:
            errors.append(f"{where}: id '{pid}' is already used by '{p['name']}'")
            continue

        stock = whole(row.get("stock"), where, "stock")
        if stock is None:
            errors.append(f"{where}: '{name}' needs a stock count (0 if sold out)")
            stock = 0
        variant = row.get("variant", "")
        if "variants" in p:
            if not variant:
                errors.append(f"{where}: '{name}' has variants on other rows, so this row needs one too")
            elif any(v["name"].lower() == variant.lower() for v in p["variants"]):
                errors.append(f"{where}: '{name}' lists variant '{variant}' twice")
            else:
                p["variants"].append({"name": variant, "stock": stock})
        else:
            if variant:
                errors.append(f"{where}: '{name}' has a variant here but not on its first row")
            elif row.get("variant_note"):
                errors.append(f"{where}: '{name}' has a variant_note but no variants")
            elif "stock" in p:
                errors.append(f"{where}: '{name}' appears twice without variants")
            else:
                p["stock"] = stock
    for g, (_, _, first) in groups.items():
        if sum(1 for p in products.values() if p.get("bundle", {}).get("group") == g) < 2:
            notes.append(f"Deal group '{g}' only has '{first}' in it, so there's nothing to mix with")
    if sum(1 for p in products.values() if p.get("featured")) > 1:
        notes.append("More than one product is featured; the first one is used")
    return [products[i] for i in order], categories


def build_updates():
    updates = []
    for row in read_csv(UPDATES_CSV):
        where = f"updates.csv row {row['_line']}"
        d, text = row.get("date", ""), row.get("text", "")
        try:
            date.fromisoformat(d)
        except ValueError:
            errors.append(f"{where}: date '{d}' must look like 2026-12-01")
            continue
        if not text:
            errors.append(f"{where}: text is empty")
            continue
        updates.append({"date": d, "text": text})
    return updates


def photo_for(stem, label, write, used):
    """Resize photos/<stem>.* into assets/img/products/<stem>.jpg; return its web path or None."""
    src = next((PHOTO_IN / f"{stem}{ext}" for ext in PHOTO_EXTS
                if (PHOTO_IN / f"{stem}{ext}").exists()), None)
    out = PHOTO_OUT / f"{stem}.jpg"
    if src and write and (not out.exists() or src.stat().st_mtime > out.stat().st_mtime):
        PHOTO_OUT.mkdir(parents=True, exist_ok=True)
        subprocess.run(["sips", "-s", "format", "jpeg", "-s", "formatOptions", "82",
                        "-Z", "1600", str(src), "--out", str(out)],
                       check=True, capture_output=True)
        notes.append(f"Resized photo for '{label}'")
    if out.exists() or (src and not write):
        used.add(out.name)
        return f"assets/img/products/{stem}.jpg"
    return None


def numbered(prefix):
    """n for every photos/<prefix>-<n>.* (or an already-resized copy), sorted."""
    pat = re.compile(rf"^{re.escape(prefix)}-(\d+)$", re.I)
    found = set()
    for d, exts in ((PHOTO_IN, PHOTO_EXTS), (PHOTO_OUT, (".jpg",))):
        if d.exists():
            for f in d.iterdir():
                m = pat.match(f.stem)
                if m and f.suffix.lower() in exts:
                    found.add(int(m.group(1)))
    return sorted(found)


def attach_photos(shop, products, write):
    """Each product gets a carousel ("photos"), in this order:
         photos/<id>.*              main photo
         photos/<id>-2.*, -3.* ...  more photos of the product
         photos/<id>-<variant>.*    one per colour/variant (e.g. grid-notepad-purple.heic)
         photos/<deal_group>-1.* .. shots shared by every product in that deal group
                                    (e.g. notepads-1.heic shows on every notepad)
       photos/header.* replaces the photo at the top of the page."""
    used = set()
    for p in products:
        gallery = []
        own = photo_for(p["id"], p["name"], write, used)
        if own:
            gallery.append({"src": own, "alt": p["name"]})
        for n in numbered(p["id"]):
            src = photo_for(f"{p['id']}-{n}", f"{p['name']} ({n})", write, used)
            if src:
                gallery.append({"src": src, "alt": f"{p['name']}, photo {n}"})
        has_variant_photo = False
        for v in p.get("variants", []):
            stem = f"{p['id']}-{slug(v['name'])}"
            vp = photo_for(stem, f"{p['name']}, {v['name']}", write, used)
            if vp:
                v["photo"] = vp
                has_variant_photo = True
                gallery.append({"src": vp, "alt": f"{p['name']}, {v['name']}", "variant": v["name"]})
            elif not own:
                notes.append(f"No photo yet for '{p['name']}, {v['name']}' (add photos/{stem}.jpg)")
        group = p.get("bundle", {}).get("group")
        if group:
            for n in numbered(group):
                src = photo_for(f"{group}-{n}", f"{group} group shot {n}", write, used)
                if src:
                    gallery.append({"src": src, "alt": f"A group of {group}"})
        if gallery:
            p["photo"] = gallery[0]["src"]
            p["photoAlt"] = gallery[0]["alt"]
            p["photos"] = gallery
            if not own and has_variant_photo:
                p["photoIsVariant"] = True
        else:
            notes.append(f"No photo yet for '{p['name']}' (add photos/{p['id']}.jpg)")
    header = photo_for("header", "the header", write, used)
    if header:
        shop["settings"]["headerPhoto"] = header
    else:
        shop["settings"].pop("headerPhoto", None)
    if write and PHOTO_OUT.exists():
        for old in PHOTO_OUT.glob("*.jpg"):
            if old.name not in used:
                old.unlink()
                notes.append(f"Removed unused photo {old.relative_to(ROOT)}")


def main():
    write = "--check" not in sys.argv
    shop = json.loads(SHOP_JSON.read_text(encoding="utf-8"))
    products, categories = build_products()
    updates = build_updates()
    if not errors:
        attach_photos(shop, products, write)

    for n in notes:
        print(f"  note: {n}")
    if errors:
        print(f"\n✗ {len(errors)} problem(s) to fix. Nothing was changed:")
        for e in errors:
            print(f"  - {e}")
        sys.exit(1)

    shop["categories"] = categories
    shop["products"] = products
    shop["updates"] = updates
    in_stock = sum(1 for p in products if (sum(v["stock"] for v in p["variants"]) if "variants" in p else p["stock"]) > 0)
    summary = f"{len(products)} products ({in_stock} in stock), {len(updates)} updates"
    if write:
        SHOP_JSON.write_text(json.dumps(shop, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        print(f"\n✓ data/shop.json rebuilt: {summary}")
        print("  Preview: python3 -m http.server 8000  →  http://localhost:8000")
        print("  Publish: commit and push (or use GitHub Desktop)")
    else:
        print(f"\n✓ Looks good: {summary}")


if __name__ == "__main__":
    main()

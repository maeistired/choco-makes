# Choco Makes

The Choco Makes shop: one static page hosted on GitHub Pages. Customers browse what's in stock and send an order sheet straight to you. There's no checkout and no online payment.

## Updating the shop

Your stock lives in two spreadsheets in **`inventory/`**. Open them in Numbers, Excel or Google Sheets, edit, and save (or export) as CSV.

### 1. `inventory/products.csv`: one row per variant

| id | name | category | price | bundle_qty | bundle_price | deal_group | cloth | featured | variant_label | variant | variant_note | stock | description |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| handmade-notebook | Handmade notebook | Notebooks | 10.50 | 2 | 18 | | lilac | yes | Pages | Cream | | 7 | |
| handmade-notebook | Handmade notebook | | | | | | | | | White | | 10 | |
| clicker-creeper | Clicker creeper | Fidgets | 7.50 | 2 | 13 | fidgets | blue | | | | | 20 | |
| keycap-keychain | Keycap keychain | Fidgets | 7.50 | 2 | 13 | fidgets | stone | | Colour | Water | More colours coming soon | 10 | |

- **A product with variants** (like cream or white pages) takes one row per variant, all with the same `id` and `name`. Fill in price, category and so on once, on the first row only. Each row has its own `stock`.
- **A product with no variants** is one row with `variant` left empty.
- **variant_note** (optional, first row only): a short line under the choices, e.g. `More colours coming soon`.
- **id**: lowercase with dashes. Leave it blank and it's made from the name. Don't change it once people have ordered, because saved order sheets use it.
- **price / bundle_price**: in CAD, `7.50` or `$7.50`. `bundle_qty` + `bundle_price` = "buy 2 for $13", counted across a product's variants.
- **deal_group** (optional): products with the same deal group share one deal, so customers can mix and match. For example, with `fidgets` on both clickers, one creeper plus one key clicker is $13. Every product in a group needs the same bundle numbers. The site shows "any 2 fidgets for $13".
- **stock**: a whole number. Customers never see the exact count, only a label: **In stock** (6 or more), **Low stock** (3 to 5), **1–2 left**, or **All gone for now** (0). To change where "Low stock" starts, edit `settings.lowStockAt` in `data/shop.json` (it's set to 5). `0` means sold out: the item stays visible, marked "All gone for now", with a button customers can use to be told when it's back.
- **cloth**: the colour behind the item: `lilac`, `pink`, `blue` or `stone`.
- **featured**: `yes` puts the item in the big panel at the top (one item only).
- **Row order** is the order on the page.

### 2. `inventory/updates.csv`: short dated notes

| date | text |
|---|---|
| 2026-12-01 | New batch of clickers is in. |

The newest is shown first. Dates use the form `YYYY-MM-DD`.

### 3. Photos

Put the original photo in **`photos/`**, named after the product id: `photos/handmade-notebook.jpg` (`.png`, `.heic` and `.webp` work too). It's resized and copied into `assets/img/products/` for the site automatically. Your originals stay on your computer and aren't uploaded.

### 4. Rebuild, check, publish

```sh
python3 tools/build_shop.py
```

It checks for mistakes first (a missing price, a stock count that isn't a number, a typo in a cloth colour) and names the row to fix. If anything's wrong, nothing is changed. When it's all good, it rebuilds `data/shop.json`. Preview it (below), then commit and push. The live site updates within a minute or two.

Use `python3 tools/build_shop.py --check` to check without changing anything.

Settings (currency, the order key, the confirmation message) stay in `data/shop.json` under `settings`. The rebuild never touches them.

## Turning on orders (Web3Forms)

1. Go to web3forms.com, enter the email address orders should go to, and copy the **access key** it sends you.
2. Paste it into `settings.web3formsAccessKey` in `data/shop.json`.
3. Write your own message for `settings.orderConfirmation`. Customers see it after sending, e.g. what happens next with pickup and payment.

Until the key is set, the site tells customers sending isn't switched on yet. Order sheets and "tell me when it's back" requests both arrive as emails. Hit reply on an order email to answer the customer directly.

After sending, the customer sees their copy of the order on the page (items, total, notes, and your confirmation message), with a button to print or save it as a PDF. It stays on their device until they start a new sheet. The free Web3Forms plan can't email customers a confirmation.

## Preview on your computer

The page loads `data/shop.json`, so open it through a local server rather than by double-clicking:

```sh
python3 -m http.server 8000
```

Then visit http://localhost:8000.

## Publish on GitHub Pages

Repository **Settings → Pages → Deploy from a branch → `main` / root**. When you buy a domain, add it under **Custom domain** in the same screen.

## Credits

Fonts: Castoro (Tiro Typeworks) and Hanken Grotesk (Alfredo Marco Pradil), both under the SIL Open Font License, self-hosted in `assets/fonts/`.

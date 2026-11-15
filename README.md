# Choco Makes

The Choco Makes shop: one static page hosted on GitHub Pages. Customers browse what's in stock and send an order sheet straight to you. There's no checkout and no online payment.

## Updating the shop

Everything you change lives in **`data/shop.json`**. Edit it (in VS Code or on github.com), commit, and the site updates within a minute or two.

### A product

```json
{
  "id": "lilac-dot-notebook",
  "name": "Lilac dot-grid notebook",
  "category": "Notebooks",
  "price": 18,
  "bundle": { "qty": 2, "price": 32 },
  "description": "A5, 80 pages, hand-stitched.",
  "photo": "assets/img/products/lilac-dot-notebook.jpg",
  "photoAlt": "Lilac cloth notebook lying open",
  "cloth": "lilac",
  "variantLabel": "Cover",
  "variants": [
    { "name": "Lilac", "stock": 4 },
    { "name": "Blue", "stock": 0 }
  ]
}
```

- **id**: a unique, lowercase name with dashes. Don't change it once people have ordered, because saved order sheets use it.
- **price**: a plain number, in CAD.
- **bundle** (optional): "buy 2 for $32". It applies across all variants of the same product, so one Lilac and one Blue count as a pair.
- **cloth**: the background colour behind the item. Use `lilac`, `pink`, `blue` or `stone`.
- **variants** (optional): each variant has its own stock. With no variants, use `"stock": 7` on the product instead.
- **Sold out**: set stock to `0`. The item stays visible, marked "All gone for now", with a "Tell me when it's back" button.
- **featured: true** puts the item in the big panel at the top.
- **sample: true** shows the "Sample" tag. Delete the sample products once your real ones are in.
- **photo**: put image files in `assets/img/products/`. Square photos look best.

### An update

```json
{ "date": "2026-12-01", "text": "New batch of clickers is in. 15 of each colour." }
```

Updates are listed newest first.

### Categories

`"categories"` sets the order categories appear in. A product with a new category still appears; it's just placed after the listed ones.

## Turning on orders (Web3Forms)

1. Go to web3forms.com, enter the email address orders should go to, and copy the **access key** it sends you.
2. Paste it into `settings.web3formsAccessKey` in `data/shop.json`.
3. Write your own message for `settings.orderConfirmation`. Customers see it after sending, e.g. what happens next with pickup and payment.

Until the key is set, the site tells customers sending isn't switched on yet. Order sheets and "tell me when it's back" requests both arrive as emails.

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

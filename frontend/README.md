# Peak & Provision

Peak & Provision is a responsive e-commerce demo for outdoor apparel and equipment. It includes catalog search and filtering, product details, wishlist and cart persistence, mock checkout, customer order tracking, and a role-protected admin catalog/order dashboard.

## Run locally

```bash
cd frontend
npm install
npm run dev
```

Open `http://127.0.0.1:5173`.

## Demo access

- Customer: enter any email and name in the sign-in dialog.
- Admin: `admin@peakprovision.com` / `peak2025`

The demo persists products, cart, wishlist, account, and orders in browser `localStorage` under the `peak-*` keys. Checkout is deliberately mock-only and never sends payment data.

## Validate

```bash
npm run typecheck
npm run build
npm run test
```

The current repository also contains the original SecuScan backend; this storefront is self-contained and does not require that backend to run.

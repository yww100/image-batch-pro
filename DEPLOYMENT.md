# Deployment & Monetization Guide

This guide walks you through publishing BatchImage to Vercel for free and connecting real payments.

---

## Part 1: Push Code to GitHub

You already created the repo `image-batch-pro`.

Now upload these files. The easiest way (without installing Git):

1. Go to https://github.com/YOUR_USERNAME/image-batch-pro
2. Click **"Add file" → "Upload files"**
3. Drag and drop the entire project folder contents
4. Click **"Commit changes"**

Required files to upload:
```
app/
components/
lib/
.github/
.next/          (optional, will be rebuilt)
package.json
next.config.js
postcss.config.js
tailwind.config.js
tsconfig.json
next-env.d.ts
README.md
LICENSE
```

---

## Part 2: Deploy on Vercel (Free)

1. Go to https://vercel.com/signup
2. Sign up with your **GitHub** account
3. Click **"Add New Project"**
4. Import `image-batch-pro`
5. Keep default settings, click **"Deploy"**
6. Wait ~2 minutes, then Vercel gives you a free URL like:
   `https://image-batch-pro-xxx.vercel.app`

Your website is now live.

---

## Part 3: Connect a Custom Domain (Optional, Costs ~$10/year)

1. Buy a domain from Cloudflare (https://dash.cloudflare.com) or Namecheap
2. Recommended names:
   - `batchimage.pro`
   - `bulkimage.io`
   - `picbatch.com`
3. In Vercel project settings, go to **Domains** and add your domain
4. Follow Vercel's DNS instructions

---

## Part 4: Enable GitHub Sponsors (Donations)

1. Go to https://github.com/sponsors/accounts
2. Click **"Join the waitlist"** or **"Set up your account"**
3. Fill in your profile, PayPal/bank info, and tax form (W-8BEN for China)
4. Once approved, replace `YOUR_GITHUB_USERNAME` in:
   - `README.md`
   - `.github/FUNDING.yml`

---

## Part 5: Connect Real Payments (Pro Plan $5/month)

Currently the Pro activation uses a demo license key. To accept real money, use **LemonSqueezy** (easier for beginners than Stripe).

### 5.1 Create LemonSqueezy Account

1. Go to https://lemonsqueezy.com
2. Sign up, create a store
3. Complete identity verification
4. Add a product:
   - Name: `BatchImage Pro`
   - Price: `$5 / month`
   - Type: Subscription
5. After creating the product, find the **Checkout URL**

### 5.2 Add the Checkout Link to Your Site

Open `components/ProModal.tsx` and replace this section:

```tsx
const handleActivate = () => {
  // Demo mode: any non-empty code activates Pro.
  // In production, replace with LemonSqueezy/Stripe license key validation.
  if (code.trim().length > 3) {
    activatePro();
    ...
```

With:

```tsx
const handleActivate = () => {
  window.open('https://YOUR_STORE.lemonsqueezy.com/checkout/buy/YOUR_PRODUCT_ID', '_blank');
};
```

Then change the button text from "Activate Pro" to "Subscribe on LemonSqueezy".

After the user pays, LemonSqueezy can send them a license key. You validate that key via LemonSqueezy API, or simply mark the device as Pro after successful webhook confirmation.

### 5.3 Validate License Keys (Optional but Recommended)

LemonSqueezy provides an API endpoint to check license keys:

```
POST https://api.lemonsqueezy.com/v1/licenses/validate
```

Replace the simple `code.trim().length > 3` check with a real API call to this endpoint.

---

## Part 6: Get Traffic

1. **SEO**: The homepage already includes meta tags. Add more pages like `/compress-jpg`, `/compress-png`, `/webp-converter` for long-tail keywords.
2. **Reddit**: Post in r/webdev, r/sideproject, r/entrepreneur
3. **Product Hunt**: Launch on https://www.producthunt.com
4. **Twitter/X**: Share before/after compression stats
5. **YouTube Shorts/TikTok**: Record 30-second demo

---

## Part 7: Track Earnings

- GitHub Sponsors dashboard: https://github.com/sponsors/dashboard
- LemonSqueezy dashboard: https://app.lemonsqueezy.com
- Vercel analytics: In your Vercel project, go to **Analytics**

---

## Need Help?

Open an issue on GitHub or email `your-email@example.com`.

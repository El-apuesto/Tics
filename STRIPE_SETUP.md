# Stripe Setup Guide

## Step 1: Create Stripe Account
1. Go to [stripe.com](https://stripe.com)
2. Sign up for free account
3. Complete business profile (can be individual/solo)

## Step 2: Get API Keys
1. Go to Stripe Dashboard → Developers → API keys
2. Copy **Publishable key** (starts with `pk_`)
3. Copy **Secret key** (starts with `sk_`)
4. Keep these secure!

## Step 3: Set Up Webhook
1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://your-backend-url.onrender.com/api/stripe/webhook`
4. Select events: `payment_intent.succeeded`
5. Copy **Webhook signing secret** (starts with `whsec_`)

## Step 4: Configure Environment Variables

### Backend (.env):
```bash
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### Frontend (.env):
```bash
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

## Step 5: Test Payments

### Test Mode:
- Use Stripe test cards: [Stripe Test Cards](https://stripe.com/docs/testing)
- Card number: `4242 4242 4242 4242`
- Expiry: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits

### Live Mode:
- Switch to live mode in Stripe dashboard
- Get new API keys
- Update environment variables
- Test with real cards (small amounts)

## Step 6: How Automatic Sales Work

### Payment Flow:
1. Customer clicks "Pay with Card"
2. Stripe processes payment securely
3. Stripe sends webhook to your backend
4. Backend updates product sales automatically
5. Dashboard shows new sales in real-time

### Webhook Processing:
```javascript
// When payment succeeds:
- Update product sales counter
- Record sale in donations table  
- Send confirmation to customer
- Update admin dashboard totals
```

## Step 7: Security Notes

### Important:
- Never commit API keys to Git
- Use environment variables only
- Test in test mode before going live
- Monitor webhook deliveries in Stripe dashboard

### Production Checklist:
- [ ] Use live API keys
- [ ] Enable webhook retries
- [ ] Set up email notifications for failed payments
- [ ] Monitor Stripe dashboard for issues
- [ ] Set up payout schedule

## Step 8: Fees and Pricing

### Stripe Fees:
- **Online Payments**: 2.9% + $0.30 per transaction
- **No monthly fees** for standard account
- **No setup fees**
- **No hidden charges**

### Example Transaction:
- $25.00 shirt sale
- Stripe fee: $25.00 × 2.9% + $0.30 = $1.03
- You receive: $23.97

## Step 9: Advanced Features (Optional)

### Later you can add:
- **Subscription payments** for monthly donations
- **Saved cards** for repeat customers
- **Apple Pay / Google Pay** integration
- **Multi-currency support**
- **Dispute handling**

## Step 10: Testing Complete Setup

### Test Checklist:
- [ ] Can create payment intent
- [ ] Stripe checkout appears
- [ ] Payment processes successfully
- [ ] Webhook fires automatically
- [ ] Sales update in database
- [ ] Dashboard shows new sales
- [ ] Customer gets confirmation
- [ ] Error handling works

Once this is working, you have a complete e-commerce system with automatic sales tracking!

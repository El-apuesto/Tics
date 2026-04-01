# Development Setup - Test Mode Only

## Step 1: Create Your Stripe Test Account
1. Go to https://stripe.com
2. Click "Sign up" 
3. Use your email (any email works)
4. Select "Individual" or "Company"
5. Complete basic profile

## Step 2: Get Test Keys
1. In Stripe Dashboard, ensure "Test mode" is ON (toggle in top left)
2. Go to Developers → API keys
3. You'll see test keys (they start with "pk_test_" and "sk_test_")
4. Copy these for development

## Step 3: Create Test Environment

### Backend/.env:
```bash
NODE_ENV=development
PORT=3001
JWT_SECRET=test-jwt-secret-for-development
STRIPE_SECRET_KEY=sk_test_your_test_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_test_webhook_secret_here
```

### Frontend/.env:
```bash
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_test_publishable_key_here
VITE_API_URL=http://localhost:3001/api
```

## Step 4: Test Everything
- Use test card: 4242 4242 4242 4242
- No real money charged
- Full functionality testing

## Step 5: Handoff to Zachariah
When ready for production:
1. Zachariah creates his own Stripe account
2. He gives you live API keys
3. Update environment variables
4. Switch to live mode
5. Deploy to production

## Security Note:
- Test keys are safe to use for development
- Never share live keys
- Test mode cannot process real payments
- You can build everything without Zachariah's involvement

// Stripe payment integration for automatic sales tracking
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create payment intent
app.post('/api/create-payment-intent', async (req, res) => {
  const { items } = req.body;
  
  try {
    // Calculate total amount
    const amount = items.reduce((total, item) => {
      return total + (item.price * item.quantity * 100); // Convert to cents
    }, 0);
    
    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      metadata: {
        items: JSON.stringify(items)
      }
    });
    
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Stripe webhook handler - this updates sales automatically
app.post('/api/stripe/webhook', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Handle payment succeeded
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const items = JSON.parse(paymentIntent.metadata.items || '[]');
    
    // Update sales for each item
    items.forEach(async (item) => {
      await db.run(
        'UPDATE products SET sales = sales + ? WHERE id = ?',
        [item.quantity, item.id]
      );
    });
    
    // Record sale in donations table for tracking
    await db.run(
      'INSERT INTO donations (id, amount, donor, date, message) VALUES (?, ?, ?, ?, ?)',
      [
        Date.now().toString(),
        paymentIntent.amount / 100,
        paymentIntent.metadata.email || 'Online Customer',
        new Date().toLocaleDateString(),
        `Purchase: ${items.map(i => i.name).join(', ')}`
      ]
    );
  }
  
  res.json({received: true});
});

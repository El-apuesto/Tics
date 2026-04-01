// Printful webhook handler for automatic sales tracking
app.post('/api/printful/webhook', (req, res) => {
  const { type, data } = req.body;
  
  if (type === 'order_shipped' || type === 'order_paid') {
    // Extract product info from Printful order
    const orderItems = data.items || [];
    
    orderItems.forEach(item => {
      const productId = item.external_id; // Match with your product ID
      const quantity = item.quantity || 1;
      
      // Update sales in database
      db.run(
        'UPDATE products SET sales = sales + ? WHERE id = ?',
        [quantity, productId],
        (err) => {
          if (err) console.error('Failed to update sales:', err);
        }
      );
    });
  }
  
  res.status(200).send('OK');
});

// Add to your Render environment variables:
// PRINTFUL_WEBHOOK_SECRET=your-webhook-secret

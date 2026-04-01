// PayPal integration for automatic sales tracking
app.post('/api/paypal/capture', async (req, res) => {
  const { orderID, items } = req.body;
  
  try {
    // Capture PayPal payment
    const capture = await capturePaypalOrder(orderID);
    
    if (capture.status === 'COMPLETED') {
      // Update sales automatically
      items.forEach(async (item) => {
        await db.run(
          'UPDATE products SET sales = sales + ? WHERE id = ?',
          [item.quantity, item.id]
        );
      });
      
      // Record sale
      await db.run(
        'INSERT INTO donations (id, amount, donor, date, message) VALUES (?, ?, ?, ?, ?)',
        [
          orderID,
          capture.purchase_units[0].amount.value,
          capture.payer?.name?.given_name || 'PayPal Customer',
          new Date().toLocaleDateString(),
          `PayPal Purchase: ${items.map(i => i.name).join(', ')}`
        ]
      );
      
      res.json({ success: true });
    } else {
      res.json({ success: false, error: 'Payment not completed' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Frontend PayPal button
export const PayPalButton = ({ items }) => {
  useEffect(() => {
    // Load PayPal SDK
    const script = document.createElement('script');
    script.src = 'https://www.paypal.com/sdk/js?client-id=YOUR_PAYPAL_CLIENT_ID';
    script.onload = () => {
      window.paypal.Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: items.reduce((total, item) => 
                  total + (item.price * item.quantity), 0
                ).toFixed(2)
              }
            }]
          });
        },
        onApprove: async (data, actions) => {
          const order = await actions.order.capture();
          
          // Send to backend to update sales
          await fetch('/api/paypal/capture', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderID: data.orderID,
              items
            })
          });
          
          alert('Payment successful! Sales updated automatically.');
        }
      }).render('#paypal-button-container');
    };
    document.body.appendChild(script);
  }, [items]);
  
  return <div id="paypal-button-container" />;
};

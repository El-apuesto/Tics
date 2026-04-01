// Printful API integration for automatic order tracking
const axios = require('axios');

// Sync Printful orders and update sales
const syncPrintfulOrders = async () => {
  try {
    const response = await axios.get('https://api.printful.com/orders', {
      headers: {
        'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`
      }
    });
    
    const orders = response.data.result;
    
    for (const order of orders) {
      if (order.status === 'fulfilled' || order.status === 'shipped') {
        // Check if we've already counted this order
        const existing = await db.get(
          'SELECT id FROM donations WHERE id = ?',
          [order.id.toString()]
        );
        
        if (!existing) {
          // Update sales for each item
          for (const item of order.items) {
            // Match Printful product with your product ID
            const productId = item.external_id || item.product_id;
            
            await db.run(
              'UPDATE products SET sales = sales + ? WHERE id = ?',
              [item.quantity, productId]
            );
          }
          
          // Record the order
          await db.run(
            'INSERT INTO donations (id, amount, donor, date, message) VALUES (?, ?, ?, ?, ?)',
            [
              order.id.toString(),
              order.retail_price / 100, // Convert from cents
              order.recipient?.name || 'Printful Customer',
              new Date(order.created).toLocaleDateString(),
              `Printful Order: ${order.items.map(i => i.name).join(', ')}`
            ]
          );
        }
      }
    }
  } catch (error) {
    console.error('Printful sync error:', error);
  }
};

// Run sync every hour
setInterval(syncPrintfulOrders, 60 * 60 * 1000);

// Also sync on startup
syncPrintfulOrders();

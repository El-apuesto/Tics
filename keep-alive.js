// Keep-alive service to prevent Render spin-down
const keepAlive = async () => {
  try {
    const response = await fetch('https://your-backend-url.onrender.com/api/shows');
    console.log('Keep-alive ping successful:', response.status);
  } catch (error) {
    console.error('Keep-alive ping failed:', error);
  }
};

// Ping every 10 minutes (600,000 ms)
setInterval(keepAlive, 10 * 60 * 1000);

// Also ping immediately on script load
keepAlive();

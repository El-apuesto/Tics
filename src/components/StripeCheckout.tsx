// Frontend Stripe payment integration
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_...'); // Your Stripe publishable key

export const StripeCheckout = ({ items, onSuccess }) => {
  const handleCheckout = async () => {
    try {
      // Create payment intent
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items })
      });
      
      const { clientSecret } = await response.json();
      
      // Confirm payment
      const stripe = await stripePromise;
      const { error } = await stripe.confirmPayment({
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/success`,
        },
      });
      
      if (error) {
        console.error('Payment failed:', error);
      } else {
        onSuccess();
      }
    } catch (error) {
      console.error('Checkout error:', error);
    }
  };
  
  return (
    <button onClick={handleCheckout} className="btn-primary">
      Pay with Card
    </button>
  );
};

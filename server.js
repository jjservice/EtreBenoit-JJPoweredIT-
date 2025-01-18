const express = require('express');
const Stripe = require('stripe');
require('dotenv').config(); // Load environment variables from .env file

const stripe = Stripe(process.env.STRIPE_SECRET_KEY); // Access Stripe key from .env
const bodyParser = require('body-parser');
const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

app.post('/create-checkout-session', async (req, res) => {
  try {
    const { items, promoCode } = req.body; // Expecting promoCode from frontend if available

    // Log received items and promoCode for debugging
    console.log('Received items:', items);
    console.log('Promo Code:', promoCode);

    // Create a map to accumulate quantities for each item
    const itemMap = items.reduce((acc, item) => {
      if (acc[item.name]) {
        acc[item.name].quantity += item.quantity; // Add to the existing quantity
      } else {
        acc[item.name] = { ...item }; // Create a new entry if it doesn't exist
      }
      return acc;
    }, {});

    // Convert the item map back to an array of line items
    const line_items = Object.values(itemMap).map(item => {
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name, // Product name
            images: [item.image], // Add image URL(s) for the product
          },
          unit_amount: Math.round(item.price * 100), // Price in cents (Stripe requires prices in cents)
        },
        quantity: item.quantity, // Correct quantity for each item
      };
    });

    // Calculate the total amount of the items in cents
    const totalAmount = line_items.reduce((total, item) => total + (item.price_data.unit_amount * item.quantity), 0);

    // Apply discount if promoCode is provided
    let discount = 0;
    if (promoCode) {
      if (promoCode === 'DISCOUNT10') {
        // Example: 10% discount
        discount = Math.round(totalAmount * 0.10);
      } else if (promoCode === 'FLAT5') {
        // Example: $5 discount
        discount = 500; // $5 = 500 cents
      }
    }

    // Adjust the total price after the discount
    const finalAmount = totalAmount - discount;

    // Create a discount coupon if needed
    let discountCoupon = null;
    if (discount > 0) {
      // If there's a discount, create a coupon in Stripe
      discountCoupon = await stripe.coupons.create({
        amount_off: discount,
        currency: 'usd',
      });
    }

    // Create a checkout session with the discounted total
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: line_items,
      mode: 'payment',
      success_url: 'https://jjservice.github.io/L-Su-Ca/successEtre.html', // Redirect to your desired success URL
      cancel_url: 'https://jjservice.github.io/L-Su-Ca/cancelEtre.html',  // Redirect to your desired cancel URL
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'], // Specify which countries are allowed for shipping
      },
      billing_address_collection: 'required', // Collect billing address
      discounts: discountCoupon ? [{
        coupon: discountCoupon.id, // Apply the created discount coupon
      }] : [], // Only apply discount if there is one
    });

    // Send the session ID to the frontend
    res.json({ id: session.id });
  } catch (err) {
    console.error('Error creating session:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Serve static files (for success/cancel pages)
app.use(express.static('public'));

// Start the server
app.listen(8080, () => {
  console.log('Server running on http://localhost:8080');
});

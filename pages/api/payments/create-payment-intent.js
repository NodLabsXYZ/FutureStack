const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { priceMinimumInCents } = require('../../../lib/constants')

const calculateOrderAmount = (items) => {
    // Replace this constant with a calculation of the order's amount
    // Calculate the order total on the server to prevent
    // people from directly manipulating the amount on the client

    // In cents. So 500 = $5.00
    return 500;
};

const checkout = async (req, res) => {
    const { amount } = req.body;

    if (!amount || amount < priceMinimumInCents) {
        throw new Error("Invalid price");
    }

    const paymentIntent = await stripe.paymentIntents.create({
        // Amount should be in cents
        amount,
        currency: "usd",
        automatic_payment_methods: {
            enabled: true,
        },
    });

    res.send({
        clientSecret: paymentIntent.client_secret,
    });
}

export default checkout;
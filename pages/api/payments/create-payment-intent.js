const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const calculateOrderAmount = (items) => {
    // Replace this constant with a calculation of the order's amount
    // Calculate the order total on the server to prevent
    // people from directly manipulating the amount on the client

    // In cents. So 500 = $5.00
    return 500;
};

const checkout = async (req, res) => {
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
        amount: calculateOrderAmount('test'),
        currency: "usd",
        // automatic_payment_methods: {
        //     enabled: true,
        // },
        "payment_method_types": [
            "card",
        ],
    });

    res.send({
        clientSecret: paymentIntent.client_secret,
    });
}

export default checkout;
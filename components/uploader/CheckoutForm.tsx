import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
    PaymentElement,
    useStripe,
    useElements
} from "@stripe/react-stripe-js";
import { LargeSpinner, SmallSpinner } from "./spinners";

type CheckoutFormProps = {
    // Consider adding in the Stripe promise here to reduce load time
    setBeginUpload: Dispatch<SetStateAction<boolean>>
    setCheckoutComponentLoading: Dispatch<SetStateAction<boolean>>
}

export default function CheckoutForm(props: CheckoutFormProps) {
    const stripe = useStripe();
    const elements = useElements();

    const [message, setMessage] = useState(null);
    const [loadingComponent, setLoadingComponent] = useState(true);
    const [loadingPayment, setLoadingPayment] = useState(false);

    useEffect(() => {
        if (!stripe) {
            return;
        }

        const clientSecret = new URLSearchParams(window.location.search).get(
            "payment_intent_client_secret"
        );

        if (!clientSecret) {
            return;
        }

        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
            switch (paymentIntent.status) {
                case "succeeded":
                    setMessage("Payment succeeded!");
                    break;
                case "processing":
                    setMessage("Your payment is processing.");
                    break;
                case "requires_payment_method":
                    setMessage("Your payment was not successful, please try again.");
                    break;
                default:
                    setMessage("Something went wrong.");
                    break;
            }
        });
    }, [stripe]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log('in handle submit');
        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        console.log('in handle submit, stripe and elements are not null');

        setLoadingPayment(true);

        const paymentIntentResult = await stripe.confirmPayment({
            elements,
            redirect: 'if_required'
        });

        const error = paymentIntentResult.error
        if (error && (error.type === "card_error" || error.type === "validation_error")) {
            setMessage(error.message);
            setLoadingPayment(false);
            return;
        } else if (error) {
            setMessage("An unexpected error occured.");
            setLoadingPayment(false);
            return;
        }

        setLoadingPayment(false);

        // Bubbles back up to UploadModalContent.tsx
        props.setBeginUpload(true);
    };

    return (
        <form
            id="payment-form"
            onSubmit={handleSubmit}
        >
            {
                loadingComponent && (
                    <LargeSpinner />
                )
            }
            {/*
                PaymentElement needs to be rendered to start loading.
                Wait until PaymentElement is fully loaded to stop showing spinner
            */}
            {
                <PaymentElement
                    id="payment-element"
                    onReady={() => setLoadingComponent(false)}
                />
            }
            {
                !loadingComponent && (
                    <>
                        {
                            loadingPayment ? (
                                <SmallSpinner />
                            ) : (
                                <>
                                    <button
                                        disabled={!stripe || !elements}
                                        id="submit"
                                        className="inline-flex items-center px-4 py-2 mt-4 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >

                                        <span id="button-text">
                                            Pay Now
                                        </span>
                                    </button>
                                    <>
                                        {/* Show any error or success messages */}
                                        {message && <div id="payment-message">{message}</div>}
                                    </>
                                </>
                            )
                        }
                    </>
                )
            }
        </form>
    );
}
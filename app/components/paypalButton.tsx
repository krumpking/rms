import { useEffect, useState } from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Random from "../utils/random";
import { getCookie } from "react-use-cookie";
import { COOKIE_ID, COOKIE_PHONE, PRIMARY_COLOR } from "../constants/constants";
import { decrypt } from "../utils/crypto";
import { checkAffiliate } from "../api/affiliateApi";
import { addPayment } from "../api/paymentApi";
import { IPayments } from "../types/paymentTypes";
import { addDocument } from "../api/mainApi";
import { PAYMENTS_COLLECTION } from "../constants/paymentConstants";
import { LoadBundleTask } from "firebase/firestore";
import Loader from "./loader";
import { IReservation } from "../types/reservationTypes";



const PaypalCheckoutButton = (props: { payment: IPayments, isReservationPayment: boolean, reservation: IReservation, color: string }) => {
    const { payment, isReservationPayment, reservation, color } = props;
    const [error, setError] = useState<any>();
    const [amount, setAmount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let amnt = 10;
        if (!isReservationPayment) {
            if (payment.package == "Solo") {
                amnt = 9 * (payment.duration) / 30;
            } else if (payment.package == "Small Team") {
                amnt = 29 * (payment.duration) / 30;
            } else if (payment.package == "Enterprise") {
                amnt = 49 * (payment.duration) / 30;
            }
        }
        setAmount(amnt);
        setLoading(false);
    }, []);

    const handleApprove = async (order: any) => {
        // Call backend function to fulfill order

        if (order.status == 'COMPLETED') {
            // Display success message, modal or redirect user to success page
            alert("Thank you for your purchase!");
            toast.success('Payment received successfully');
            var id = "";
            if (getCookie(COOKIE_ID) !== "") {
                id = decrypt(getCookie(COOKIE_ID), COOKIE_ID);
            }

            if (isReservationPayment) {

            } else {
                const newPayment = {
                    ...payment,
                    id: Random.randomString(13, "abcdefghijkhlmnopqrstuvwxz123456789"),
                    userId: id,
                    date: new Date(),
                    dateString: new Date().toDateString,
                    amount: amount,
                    refCode: payment.refCode
                }
                addDocument(PAYMENTS_COLLECTION, newPayment).then((v) => {
                    toast.success('Payment successful!');
                }).catch((e) => {
                    toast.error('There was an error adding your payment, please try again');

                });
            }

        }
        // if response is success

        // Refresh user's account or subscription status

        // if response is error
        // setError("Your payment was processed successfully. However, we are unable to fulfill your purchase. Please contact us at support@designcode.io for assistance.");
    };



    if (error) {
        // Display error message, modal or redirect user to error page
        toast.error(error);
        toast.error('Your payment was processed successfully. However, we are unable to fulfill your purchase. Please contact us at billing@foodiesbooth.com for assistance.');
    }

    return (
        <div className="w-full">
            {loading ? <Loader color={isReservationPayment ? color : ""} /> :
                <div className="w-full">
                    <PayPalButtons

                        className={"z-0 bg-[#fff] rounded-[25px] text-center w-full"}
                        style={{
                            shape: "pill",
                        }}

                        onClick={(data, actions) => {                            // Validate on button click, client or server side

                            return actions.resolve();

                        }}
                        createOrder={(data, actions) => {
                            return actions.order.create({
                                purchase_units: [
                                    {
                                        description: "Foodies Booth Subscription",
                                        amount: {
                                            value: '45'
                                        }
                                    }
                                ]
                            });
                        }}
                        onApprove={async (data, actions) => {

                            if (typeof actions.order !== 'undefined') {
                                const order = await actions.order.capture();
                                console.log("order", order);


                                handleApprove(order);
                            }

                        }}
                        onCancel={() => {
                            // Display cancel message, modal or redirect user to cancel page or back to cart
                            toast.warn('Payment was Cancelled');
                            //TODO Capture abandoned cart
                        }}
                        onError={(err) => {
                            setError(err);
                            console.error("PayPal Checkout onError", err);
                            toast.error('Payment check out error, please try again');
                        }}
                    />
                    <ToastContainer
                        position="top-right"
                        autoClose={5000} />
                </div>}

        </div>
    );
};

export default PaypalCheckoutButton;
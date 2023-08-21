import React, { useEffect, useState } from 'react'
import { COOKIE_EMAIL, COOKIE_ID, COOKIE_NAME, COOKIE_ORGANISATION, COOKIE_PHONE, PRIMARY_COLOR } from '../app/constants/constants';
import Carousel from '../app/components/carousel';
import { auth } from '../firebase/clientApp';
import Loader from '../app/components/loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router'
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { addAdmin } from '../app/api/adminApi';
import { setCookie } from 'react-use-cookie';
import { DocumentData, DocumentReference } from 'firebase/firestore';
import { encrypt } from '../app/utils/crypto';
import Link from 'next/link';
import { format, compareAsc, subDays } from 'date-fns'
import { addPayment } from '../app/api/paymentApi';
import Random from '../app/utils/random';
import Script from 'next/script';
import Head from 'next/head';


const SignUp = () => {
    const [phone, setPhone] = useState("");
    const [accessCode, setAccessCode] = useState("");
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [fullName, setFullName] = useState("");
    const [organisationName, setOrganisationName] = useState("");
    const [email, setEmail] = useState("");
    const [checked, setChecked] = useState(false);






    useEffect(() => {
        document.body.style.backgroundColor = PRIMARY_COLOR;
        auth.languageCode = 'en';
        window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
            'size': 'visible',
            'callback': (response: any) => {
                // reCAPTCHA solved, allow signInWithPhoneNumber.              
                // ...
            },
            'expired-callback': () => {
                // Response expired. Ask user to solve reCAPTCHA again.
                // ...
                window.location.reload();
            }
        }, auth);


        return () => {

        }

    }, []);

    const shownSlides = [
        {
            image: '/images/bg-swurl.png',

        },
        {
            image: '/images/bg-swurl.png',

        },
        {
            image: '/images/bg-swurl.png',

        },
    ]


    const slide = (image: string) => {
        return (
            <div className="w-full h-96 rounded-lg">
                <img src={image} className='w-full h-full' />
            </div>


        )
    }


    const signUp = () => {

        if (checked) {
            setLoading(true);

            const appVerifier = window.recaptchaVerifier;
            signInWithPhoneNumber(auth, phone, appVerifier)
                .then((confirmationResult) => {
                    // SMS sent. Prompt user to type the code from the message, then sign the
                    // user in with confirmationResult.confirm(code).
                    toast.success("Passcode sent")
                    setSent(true);
                    window.confirmationResult = confirmationResult;

                    setLoading(false);
                    // ...
                }).catch((error) => {
                    // Error; SMS not sent
                    // ...
                    console.error(error);
                    setLoading(false);
                    toast.error("There was an error please refresh the page and try again")
                });
        } else {
            toast.error("It appears you are yet to agree to our Terms and Conditions")
        }



    }

    const signIn = () => {
        setLoading(true);
        window.confirmationResult.confirm(accessCode).then((result: { user: any; }) => {

            const user = result.user;
            const userId = user.uid;

            // success
            const admin = {
                id: userId,
                name: fullName,
                phoneNumber: phone,
                createdDate: new Date().toString(),
                email: email,
                organizationName: organisationName,
            }

            addAdmin(admin).then((v: DocumentReference<DocumentData> | null) => {
                if (v == null) {
                    toast.warn("Phone number already exists, user another phone number or login");
                    setSent(false);
                } else {


                    const payment = {
                        id: Random.randomString(13, "abcdefghijkhlmnopqrstuvwxz123456789"),
                        userId: userId,
                        date: subDays(new Date(), 23).toString(),
                        amount: 0,
                        refCode: ""
                    }

                    addPayment(payment).then((v) => {

                    }).catch((er) => {
                        console.error(er);
                    });

                    const key = v.id.substring(-13);
                    setCookie(COOKIE_ID, encrypt(userId, COOKIE_ID), {
                        days: 1,
                        SameSite: 'Strict',
                        Secure: true,
                    });
                    setCookie(COOKIE_ORGANISATION, encrypt(organisationName, key), {
                        days: 1,
                        SameSite: 'Strict',
                        Secure: true,
                    });
                    setCookie(COOKIE_EMAIL, encrypt(email, key), {
                        days: 1,
                        SameSite: 'Strict',
                        Secure: true,
                    });
                    setCookie(COOKIE_NAME, encrypt(fullName, key), {
                        days: 1,
                        SameSite: 'Strict',
                        Secure: true,
                    });

                    setCookie(COOKIE_PHONE, encrypt(phone, key), {
                        days: 1,
                        SameSite: 'Strict',
                        Secure: true,
                    });
                    router.push('/home');
                }
                setLoading(false);

            }).catch(console.error);

        }).catch((err: any) => {
            alert("The One Time Password you sent was not correct please retry");
        });
    }

    const handleChange = () => {
        setChecked(true);
    };




    return (
        <>

            {/* <!-- Global site tag (gtag.js) - Google Analytics --> */}
            <Script
                src="https://www.googletagmanager.com/gtag/js?id=G-YRWLWE46T0"
                strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){window.dataLayer.push(arguments);}
                    gtag('js', new Date());

                    gtag('config', 'G-YRWLWE46T0');
                    `}
            </Script>

            <div className='bg-[#00947a] w-full h-full p-4 md:p-8 lg:p-16 '>
                <div className='bg-white h-full rounded-[25px] grid grid-cols-1 md:grid-cols-2 p-4 place-items-center'>

                    <div className='hidden lg:block'>
                        <Carousel children={shownSlides.map((v) => {
                            return (
                                slide(v.image)
                            )
                        })} />

                    </div>

                    <div className=''>
                        {loading ?
                            <Loader />

                            :

                            <>
                                {sent ?
                                    <form onSubmit={
                                        (e) => {
                                            e.preventDefault()
                                            signIn()
                                        }
                                    }>
                                        <div className="mb-6">
                                            <input
                                                type="text"
                                                value={accessCode}
                                                placeholder={"Please enter the One Time Password"}
                                                onChange={(e) => {

                                                    setAccessCode(e.target.value);


                                                }}
                                                className="
                                                w-full
                                                rounded-[25px]
                                                border-2
                                                border-[#fdc92f]
                                                py-3
                                                px-5
                                                bg-white
                                                text-base text-body-color
                                                placeholder-[#ACB6BE]
                                                outline-none
                                                focus-visible:shadow-none
                                                focus:border-primary
                                                "
                                                required
                                            />
                                        </div>

                                        <div className="mb-10">
                                            <input
                                                type="submit"
                                                value={"Login"}
                                                className="
                                            font-bold
                                            w-full
                                            rounded-[25px]
                                            border-2
                                            border-[#fdc92f]
                                            border-primary
                                            py-3
                                            px-5
                                            bg-[#fdc92f]
                                            text-base 
                                            text-[#7d5c00]
                                            cursor-pointer
                                            hover:bg-opacity-90
                                            transition
                                            "
                                            />
                                        </div>
                                    </form>

                                    :
                                    <form onSubmit={
                                        (e) => {
                                            e.preventDefault()
                                            signUp()
                                        }
                                    }>
                                        <p className='text-center text-xs text-black-300 mb-4 font-bold'>Start your 7 Day FREE trial</p>
                                        <div className="mb-6">
                                            <input
                                                type="text"
                                                value={fullName}
                                                placeholder={"Full Name"}
                                                onChange={(e) => {
                                                    setFullName(e.target.value);

                                                }}
                                                className="
                                                    w-full
                                                    rounded-[25px]
                                                    border-2
                                                    border-[#fdc92f]
                                                    py-3
                                                    px-5
                                                    bg-white
                                                    text-base text-body-color
                                                    placeholder-[#ACB6BE]
                                                    outline-none
                                                    focus-visible:shadow-none
                                                    focus:border-primary
                                                    "
                                                required
                                            />
                                        </div>
                                        <div className="mb-6">
                                            <input
                                                type="text"
                                                value={phone}
                                                placeholder={"Phone (include country your code )"}
                                                onChange={(e) => {
                                                    setPhone(e.target.value);

                                                }}
                                                className="
                                                w-full
                                                rounded-[25px]
                                                border-2
                                                border-[#fdc92f]
                                                py-3
                                                px-5
                                                bg-white
                                                text-base text-body-color
                                                placeholder-[#ACB6BE]
                                                outline-none
                                                focus-visible:shadow-none
                                                focus:border-primary
                                                "
                                                required
                                            />
                                        </div>
                                        <div className="mb-6">
                                            <input
                                                type="text"
                                                value={email}
                                                placeholder={"Email"}
                                                onChange={(e) => {
                                                    setEmail(e.target.value);

                                                }}
                                                className="
                                                w-full
                                                rounded-[25px]
                                                border-2
                                                border-[#fdc92f]
                                                py-3
                                                px-5
                                                bg-white
                                                text-base text-body-color
                                                placeholder-[#ACB6BE]
                                                outline-none
                                                focus-visible:shadow-none
                                                focus:border-primary
                                                "
                                                required
                                            />
                                        </div>
                                        <div className="mb-6">
                                            <input
                                                type="text"
                                                value={organisationName}
                                                placeholder={"Organisation Name"}
                                                onChange={(e) => {
                                                    setOrganisationName(e.target.value);

                                                }}
                                                className="
                                                w-full
                                                rounded-[25px]
                                                border-2
                                                border-[#fdc92f]
                                                py-3
                                                px-5
                                                bg-white
                                                text-base text-body-color
                                                placeholder-[#ACB6BE]
                                                outline-none
                                                focus-visible:shadow-none
                                                focus:border-primary
                                                "
                                                required
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <input
                                                type="submit"
                                                value={"Send One Time Password"}
                                                className="
                                            font-bold
                                                w-full
                                                rounded-[25px]
                                            border-2
                                            border-[#fdc92f]
                                                border-primary
                                                py-3
                                                px-5
                                                bg-[#fdc92f]
                                                text-base 
                                                text-[#7d5c00]
                                                cursor-pointer
                                                hover:bg-opacity-90
                                                transition
                                                "
                                            />
                                        </div>
                                        <div className='text-center' >
                                            <input
                                                onChange={() => { setChecked(true) }}
                                                type="checkbox"
                                                id="terms"
                                                name="terms"
                                                value="terms"
                                                className='accent-green-700 text-white bg-whites' />
                                            <label htmlFor="terms"> I understand the Terms and Conditions</label><br></br>
                                        </div>
                                        <Link href={'/terms'}>
                                            <p className='text-center text-xs text-gray-300 mb-4 font-bold underline'>See Terms</p>
                                        </Link>
                                    </form>}

                            </>
                        }
                    </div>

                </div>
                <div id="recaptcha-container"></div>
                <ToastContainer
                    position="top-right"
                    autoClose={5000} />
            </div>
        </>

    )
};




export default SignUp

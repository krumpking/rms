import React, { useEffect, useState } from 'react'
import { ADMIN_ID, COOKIE_EMAIL, COOKIE_ID, COOKIE_NAME, COOKIE_ORGANISATION, COOKIE_PHONE, PERSON_ROLE, PRIMARY_COLOR } from '../app/constants/constants';
import Carousel from '../app/components/carousel';
import { auth } from '../firebase/clientApp';
import Loader from '../app/components/loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router'
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { getCookie, setCookie } from 'react-use-cookie';
import { decrypt, encrypt } from '../app/utils/crypto';

import { COOKIE_AFFILIATE_NUMBER } from '../app/constants/affilliateConstants';

const Login = () => {
    const [phone, setPhone] = useState("");
    const [accessCode, setAccessCode] = useState("");
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [userId, setUserId] = useState("");




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


        var infoFormCookie = getCookie(COOKIE_ID);
        if (typeof infoFormCookie !== 'undefined') {

            if (infoFormCookie.length > 0) {

                const id = decrypt(infoFormCookie, COOKIE_ID);


            } else {
                setLoading(false);
            }


        } else {
            setLoading(false);
        }


    }, []);


    const login = () => {
        setLoading(true);
        if (sent) {

            window.confirmationResult.confirm(accessCode).then((result: { user: any; }) => {
                const user = result.user;
                const userId = user.uid;

                // getUser(phone).then(async (v) => {

                //     if (v == null) {
                //         toast.warn('User not found, please Sign Up');
                //         router.push({
                //             pathname: '/signup',
                //         });
                //     } else {

                //         v.data.forEach((doc) => {

                //             toast.success('Welcome to Digital Data Tree');



                //             const key = userId.substring(0, 13);
                //             setCookie(COOKIE_ID, encrypt(userId, COOKIE_ID), {
                //                 days: 7,
                //                 SameSite: 'Strict',
                //                 Secure: true,
                //             });
                //             //  
                //             if (v.userType == "admin") {


                //                 setCookie(COOKIE_ORGANISATION, encrypt(doc.data().organizationName, key), {
                //                     days: 7,
                //                     SameSite: 'Strict',
                //                     Secure: true,
                //                 });

                //                 setCookie(ADMIN_ID, "", {
                //                     days: 7,
                //                     SameSite: 'Strict',
                //                     Secure: true,
                //                 });


                //                 setCookie(PERSON_ROLE, encrypt("Admin", userId), {
                //                     days: 7,
                //                     SameSite: 'Strict',
                //                     Secure: true,
                //                 });




                //             } else if (v.userType == "added") {
                //                 setCookie(ADMIN_ID, encrypt(doc.data().adminId, COOKIE_ID), {
                //                     days: 7,
                //                     SameSite: 'Strict',
                //                     Secure: true,
                //                 });

                //                 setCookie(PERSON_ROLE, doc.data().role, {
                //                     days: 7,
                //                     SameSite: 'Strict',
                //                     Secure: true,
                //                 });
                //             } else {
                //                 setCookie(COOKIE_AFFILIATE_NUMBER, doc.data().affiliateNo, {
                //                     days: 7,
                //                     SameSite: 'Strict',
                //                     Secure: true,
                //                 });
                //             }

                //             setCookie(COOKIE_EMAIL, encrypt(doc.data().email, key), {
                //                 days: 7,
                //                 SameSite: 'Strict',
                //                 Secure: true,
                //             });
                //             setCookie(COOKIE_NAME, encrypt(doc.data().name, key), {
                //                 days: 7,
                //                 SameSite: 'Strict',
                //                 Secure: true,
                //             });
                //             setCookie(COOKIE_PHONE, encrypt(phone, key), {
                //                 days: 7,
                //                 SameSite: 'Strict',
                //                 Secure: true,
                //             });
                //         });

                //         router.push({
                //             pathname: '/home'
                //         });
                //         setLoading(false);

                //     }


                // }).catch((e) => {
                //     toast.error('There was an error getting your profile, please try again');
                //     console.error(e);

                // });
                // success


            }).catch((err: any) => {
                alert("The One Time Password you sent was not correct please retry");
                console.error(err);
                toast.error('There was an error with the One Time Password, please try again');
            });
        } else {
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
        }

    }

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


    return (
        <div className=' w-full h-full p-4 md:p-8 2xl:p-16 ' style={{ backgroundColor: PRIMARY_COLOR }}>
            <div className='bg-white h-full rounded-[25px] p-4'>
                <div className='h-16'>
                    <a href="/">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
                        </svg>

                    </a>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 place-items-center p-4 h-full'>

                    <div className='hidden lg:block'>
                        <img src={"images/webOneDefaultPicture.jpg"} className='h-96 w-full' />
                    </div>

                    <div className=''>
                        {loading ?
                            <div className='w-full flex flex-col items-center content-center'>
                                <Loader />
                            </div>


                            : <form
                                className='flex flex-col content-center items-center justify-center'
                                onSubmit={
                                    (e) => {
                                        e.preventDefault()
                                        //login()
                                        router.push({
                                            pathname: '/home'
                                        });
                                    }
                                }>


                                <p className='text-center text-xs text-gray-300 mb-4 font-bold'>Login</p>
                                <div className="mb-6">
                                    <input
                                        type="text"
                                        value={sent ? accessCode : phone}
                                        placeholder={sent ? "Please enter the One Time Password" : "Phone (include country your code )"}
                                        onChange={(e) => {
                                            if (sent) {
                                                setAccessCode(e.target.value);
                                            } else {
                                                setPhone(e.target.value)
                                            }

                                        }}
                                        className="
                                        w-full
                                        rounded-[25px]
                                        border-2
                                        py-3
                                        px-5
                                        bg-white
                                        text-base text-body-color
                                        placeholder-[#ACB6BE]
                                        outline-none
                                        focus-visible:shadow-none
                                        focus:border-primary
                                        "
                                        style={{ borderColor: PRIMARY_COLOR }}
                                        required
                                    />
                                </div>

                                <div className="mb-10">
                                    <input
                                        type="submit"
                                        value={sent ? "Login" : "Send One Time Password"}
                                        className="
                                        font-bold
                                        w-full
                                        rounded-[25px]
                                        border-2
                                        border-primary
                                        py-3
                                        px-5
                                        text-base 
                                        text-white
                                        cursor-pointer
                                        hover:bg-opacity-90
                                        transition
                                    "
                                        style={{ backgroundColor: PRIMARY_COLOR, borderColor: PRIMARY_COLOR }}
                                    />
                                </div>
                            </form>}
                    </div>
                </div>
            </div>
            <div id="recaptcha-container"></div>
            <ToastContainer
                position="top-right"
                autoClose={5000} />
        </div>
    )
};


export default Login



import React, { useEffect, useState } from 'react'
import { COOKIE_EMAIL, COOKIE_ID, COOKIE_NAME, COOKIE_ORGANISATION, COOKIE_PHONE, PRIMARY_COLOR } from '../app/constants/constants';
import { auth } from '../firebase/clientApp';
import Loader from '../app/components/loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router'
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { setCookie } from 'react-use-cookie';
import { encrypt } from '../app/utils/crypto';
import Link from 'next/link';
import { addAffiliate } from '../app/api/affiliateApi';


const Affiliate = () => {
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
            const affiliate = {
                id: userId,
                name: fullName,
                phoneNumber: phone,
                createdDate: new Date().toString(),
                email: email
            }

            addAffiliate(affiliate).then((v: Number | null) => {
                if (v == null) {
                    toast.warn("Phone number already exists, user another phone number");
                    setSent(false);
                } else {


                    setCookie(COOKIE_ID, encrypt(userId, COOKIE_ID), {
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
        setChecked(!checked);
    };




    return (
        <div className='bg-[#00947a] w-full h-full p-4 md:p-8 lg:p-16 '>
            <div className='bg-white h-full rounded-[25px] grid grid-cols-1 md:grid-cols-2 p-4 place-items-center'>

                <div className=''>
                    <h1 className='text-2xl'>Join the #DigitalRevolution</h1>
                    <p>The digital revolution has transformed the world in ways we could have never imagined. It has brought us closer together, made communication easier and faster, and opened up endless opportunities for growth and development. Joining the digital revolution means being a part of something bigger than ourselves, something that has the power to change lives and make a difference in the world. It means being at the forefront of innovation and progress, and having the ability to shape the future. It&#39;s an exciting and exhilarating time to be alive, and by joining the digital revolution, we can be a part of the movement that is shaping the world for generations to come. So don&#39;t hesitate, take the leap and join the digital revolution today!</p>
                    <h1 className='text-xl mt-10'>How much do you earn per refferal?</h1>
                    <p className='text-xl'>Per customer who signs up with your refferal code you earn <span className='text-xl text-[#00947a]'>50USD</span> &#x1F4B8;</p>
                    <p className='text-xl'>Per every 5 clients you bring you earn an extra <span className='text-xl text-[#00947a]'>100USD</span> &#x1F4B8;</p>
                </div>

                <div >
                    {loading ?

                        <div className='flex items-center justify-center justify-items-center'>
                            <Loader />
                        </div>


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
                                            text-white
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
                                    <p className='text-center text-xs text-gray-300 mb-4 font-bold'>Sign Up</p>
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
                                                text-white
                                                cursor-pointer
                                                hover:bg-opacity-90
                                                transition
                                                "
                                        />
                                    </div>
                                    <div className='text-center' >
                                        <input
                                            onChange={handleChange}
                                            type="checkbox"
                                            id="terms"
                                            name="terms"
                                            value="terms"
                                            className='accent-green-700 text-white bg-whites'></input>
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
    )
};




export default Affiliate

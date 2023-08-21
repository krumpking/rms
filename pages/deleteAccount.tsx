import type { NextPage } from 'next'
import React, { useState, useEffect } from 'react'
import { PRIMARY_COLOR } from '../app/constants/constants';




const DeleteAccount: NextPage = () => {
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    useEffect(() => {
        document.body.style.backgroundColor = PRIMARY_COLOR;


    }, []);



    return (

        <div className='p-6'>



            <div className='bg-white col-span-8 m-8 rounded-[30px] p-8'>
                <h1 className='text-3xl'>Delete Account</h1>
                <h4 className='font-bold'>Introduction</h4>
                <p>
                    This refers to deleting an account from Digital Data Tree mobile application, Digital Data Tree is a product of Vision Is Primary
                </p>
                <h1>
                    Steps to delete account:
                </h1>
                <p>
                    Send an email at help@visionisprimary.com stating the desire to delete your cloud account then you can:
                </p>
                <ul className="list-disc px-8">
                    <li>Uninstall the app from your phone.</li>

                </ul>
                <h1>Please note you can re-create an account but you data will be deleted and will have to start again</h1>

                <p>If you have any questions about this Privacy Policy, please contact us at help@visionisprimary.com</p>
            </div>






        </div>


    )
}

export default DeleteAccount

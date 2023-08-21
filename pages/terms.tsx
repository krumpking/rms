import type { NextPage } from 'next'
import React, { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../app/store/hooks';
import { selectPosition } from '../app/store/reducer';
import { PRIMARY_COLOR, WHATSAPP_CONTACT } from '../app/constants/constants';





const Terms: NextPage = () => {
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
                <h1 className='text-3xl'>Terms</h1>
                <h4 className='font-bold'>Introduction</h4>
                <p>
                    These Terms and Conditions govern your use of the website and app (the &quot;Service&quot;) operated by Vision Is Primary (the &quot;Company&quot;). By accessing or using the Service, you agree to be bound by these Terms and Conditions.
                </p>
                <h1>
                    Intellectual Property
                </h1>
                <p>
                    The Service and its content, including but not limited to text, graphics, logos, images, audio, video, and software, are the property of the Company or its licensors and are protected by copyright, trademark, and other intellectual property laws. You agree not to use, copy, reproduce, distribute, transmit, broadcast, display, modify, create derivative works from, or otherwise exploit the Service or its content, in whole or in part, without the prior written consent of the Company.
                </p>
                <h1>User Conduct</h1>
                <p>You agree to use the Service in a manner that is lawful, ethical, and in accordance with these Terms and Conditions. You agree not to use the Service for any of the following purposes:</p>
                <ul className="list-disc px-8">
                    <li>To send or post any unlawful, threatening, abusive, defamatory, obscene, vulgar, pornographic, profane, indecent, or otherwise objectionable content.</li>
                    <li>To harm or attempt to harm minors in any way.</li>
                    <li>To impersonate any person or entity, or to misrepresent your affiliation with any person or entity.</li>
                    <li>To spam or otherwise flood the Service with unwanted content.</li>
                    <li>To collect or store personal information about other users</li>
                    <li>To violate any applicable law or regulation.</li>
                </ul>
                <p>The Company reserves the right to terminate your account or access to the Service if you violate any of these Terms and Conditions.</p>
                <h1>Disclaimer of Warranties</h1>
                <h4>THE SERVICE IS PROVIDED &quot;AS IS&quot; AND THE COMPANY MAKES NO WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. THE COMPANY DOES NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS. THE COMPANY ASSUMES NO LIABILITY FOR ANY DAMAGES RESULTING FROM YOUR USE OF THE SERVICE, INCLUDING BUT NOT LIMITED TO DIRECT, INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, OR PUNITIVE DAMAGES.</h4>
                <h1>Limitation of Liability</h1>
                <h4>IN NO EVENT SHALL THE COMPANY&quot;S LIABILITY FOR ANY DAMAGES ARISING OUT OF OR IN CONNECTION WITH THESE TERMS AND CONDITIONS EXCEED THE AMOUNTS PAID BY YOU TO THE COMPANY FOR THE SERVICE IN THE 12 MONTHS IMMEDIATELY PRECEDING THE EVENT GIVING RISE TO THE LIABILITY.</h4>
                <h1>Indemnification</h1>
                <p>You agree to indemnify and hold the Company harmless from and against any and all claims, losses, damages, liabilities, costs, and expenses (including reasonable attorneys&quot; fees) arising out of or in connection with your use of the Service.</p>
                <h1>Severability</h1>
                <p>If any provision of these Terms and Conditions is held to be invalid or unenforceable, such provision shall be struck from these Terms and Conditions and the remaining provisions shall remain in full force and effect               </p>
                <h1>Governing Law</h1>
                <p>These Terms and Conditions shall be governed by and construed in accordance with the laws of the Republic of Zimbabwe and International Law, without regard to its conflict of laws provisions. Any disputes arising out of or relating to these Terms and Conditions shall be subject to the exclusive jurisdiction of the courts of the republic of Zimbabwe and International Law</p>
                <h1>Entire Agreement</h1>
                <p>These Terms and Conditions constitute the entire agreement between you and the Company with respect to the Service and supersede all prior or contemporaneous communications, representations, or agreements, whether oral or written.</p>
                <h1>Changes to Terms and Conditions</h1>
                <p>The Company may update these Terms and Conditions from time to time. You will be notified of any changes by email or by posting the changes on the Service. Your continued use of the Service after any changes to these Terms and Conditions constitutes your acceptance of the changes.</p>
                <h1>Contact Us</h1>
                <p>If you have any questions about these Terms and Conditions, please contact us at help@visionisprimary.com</p>

            </div>






        </div>


    )
}

export default Terms

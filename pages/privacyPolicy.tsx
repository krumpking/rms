import type { NextPage } from 'next'
import React, { useState, useEffect } from 'react'
import { PRIMARY_COLOR, WHATSAPP_CONTACT } from '../app/constants/constants';




const PrivacyPolicy: NextPage = () => {



    return (

        <div className='p-6'>



            <div className='bg-white col-span-8 m-8 rounded-[30px] p-8'>
                <h1 className='text-3xl'>Privacy Policy</h1>
                <h4 className='font-bold'>Introduction</h4>
                <p>
                    This Privacy Policy describes how Vision Is Primary collects, uses, and shares your personal information when you visit our website or use our mobile application (the &quot;Service&quot;).
                </p>
                <h1>
                    Personal Information We Collect
                </h1>
                <p>
                    We collect the following types of personal information from you:
                </p>
                <ul className="list-disc px-8">
                    <li>Information you provide us: We collect the information you provide us when you create an account, sign up for our newsletter, or contact us. This information may include your name, email address, mailing address, phone number, and other contact information.</li>
                    <li>Information we collect automatically: When you visit our website or use our mobile application, we collect certain information automatically, such as your IP address, browser type, operating system, referring website, and the pages you view on our website.</li>
                    <li>Information we collect from third parties: We may collect information about you from third parties, such as social media platforms, advertising networks, and analytics providers.</li>
                </ul>
                <h1>How We Use Your Personal Information</h1>
                <h4>We use your personal information for the following purposes:</h4>
                <ul className="list-disc px-8">
                    <li>To provide you with the Service: We use your personal information to provide you with the Service, including to process your orders, deliver your products, and respond to your requests.</li>
                    <li>To improve our Service: We use your personal information to improve our Service, such as by personalizing your experience, developing new features, and fixing bugs.</li>
                    <li>To communicate with you: We may use your personal information to communicate with you about the Service, such as to send you order confirmations, newsletters, and other updates.</li>
                    <li>To market to you: We may use your personal information to market to you about our products and services, such as sending you promotional emails.</li>
                    <li>To comply with the law: We may use your personal information to comply with the law, such as to respond to a subpoena or court order.</li>
                </ul>
                <h1>Sharing Your Personal Information</h1>
                <h4>We may share your personal information with the following third parties:</h4>
                <ul className="list-disc px-8">
                    <li>Service providers: We may share your personal information with our service providers, who help us provide the Service, such as shipping companies, payment processors, and email marketing providers.</li>
                    <li>Business partners: We may share your personal information with our business partners, who may use your information to market to you about their products and services.</li>
                    <li>Other third parties: We may share your personal information with other third parties, such as in response to a subpoena or court order, or to protect our rights.</li>
                </ul>
                <h1>International Data Transfers</h1>
                <p>Our Service is hosted in the United States. If you are located outside of the United States, your personal information will be transferred to the United States. By using our Service, you consent to the transfer of your personal information to the United States.</p>
                <h1>Data Security</h1>
                <p>We take steps to protect your personal information from unauthorized access, use, and disclosure. These steps include:</p>
                <ul className="list-disc px-8">
                    <li>Physical security: We store your personal information in secure facilities.</li>
                    <li>Technical security: We use encryption and other security measures to protect your personal information when it is transmitted over the internet.</li>
                    <li>Employee training: We train our employees on the importance of protecting your personal information.</li>
                </ul>
                <h1>Data Retention</h1>
                <p>We will retain your personal information for as long as necessary to provide you with the Service, to comply with the law, and for our legitimate business interests.</p>
                <h1>Your Rights</h1>
                <h4>You have the following rights with respect to your personal information:</h4>
                <ul className="list-disc px-8">
                    <li>Access: You have the right to access your personal information.</li>
                    <li>Correction: You have the right to correct any inaccurate or incomplete personal information we have about you.</li>
                    <li>Deletion: You have the right to request that we delete your personal information.</li>
                    <li>Objection: You have the right to object to our processing of your personal information.</li>
                    <li>Portability: You have the right to request that we provide you with a copy of your personal information in a machine-readable format.</li>
                    <li>Withdrawal of consent: You have the right to withdraw your consent to our processing of your personal information.</li>
                </ul>
                <p>To exercise any of these rights, please contact us at help@visionisprimary.com</p>
                <h1>Changes to this Privacy Policy</h1>
                <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on our website. You are responsible for reviewing the Privacy Policy periodically to stay informed of our updates.</p>
                <h1>Contact Us</h1>
                <p>If you have any questions about this Privacy Policy, please contact us at help@visionisprimary.com</p>
            </div>






        </div>


    )
}

export default PrivacyPolicy

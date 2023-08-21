import type { NextPage } from 'next'
import React, { useState, useEffect } from 'react'
import { WHATSAPP_CONTACT } from '../app/constants/constants';
import Nav from '../app/components/nav';
import Header from '../app/components/header';
import Carousel from '../app/components/carousel';
import Link from 'next/link';
import Script from 'next/script';
import YouTube from "react-youtube";



const Home: NextPage = () => {
  const [trackingId, settrackingId] = useState("AW-11208371394");



  const shownSlides = [
    {
      title: 'Efficiency',
      description: 'Digital data can be stored, retrieved, and shared instantly and effortlessly. Compared to paper documents that require manual sorting, filing, and transporting, digital files save time and resources, which can then be directed towards more critical functions.',
      buttonText: 'Get Started',
    },
    {
      title: 'Security',
      description: 'Digital data can be encrypted and protected through firewalls and other security measures. Access permissions ensure only authorized personnel can view sensitive information, whereas paper copies can be lost, stolen, or damaged.',
      buttonText: 'Get Started',
    },
    {
      title: 'Cost savings',
      description: 'Paper documentation requires printing, storage space, mailing fees, and disposal costs. Conversely, digital data requires minimal infrastructure investment and low maintenance costs. Overall, this leads to significant cost reductions compared to paper-based systems.',
      buttonText: 'Get Started',
    },
    {
      title: 'Collaboration',
      description: ' Digital data makes collaboration easier between team members regardless of geographical location. Multiple people can edit the same document simultaneously, and real-time updates eliminate version control conflicts common with paper documents.',
      buttonText: 'Get Started'
    },
    {
      title: 'Data analysis',
      description: 'Digital data lends itself to easier manipulation, organization, and analysis, making it simpler to identify patterns, trends, and relationships. Advanced software programs perform calculations and generate reports automatically, saving time and reducing errors.',
      buttonText: 'Get Started'
    },
    {
      title: 'Portability',
      description: 'Digital data is lightweight and highly portable, making it ideal for fieldwork where lugging around bulky folders would be impractical. Mobile device compatibility means team members can access necessary files from anywhere, anytime.',
      buttonText: 'Get Started'
    },
    {
      title: 'Adaptability',
      description: 'Digital data is highly flexible, able to accommodate various file formats and types without issue.',
      buttonText: 'Get Started'
    },
    {
      title: 'Improved decision-making',
      description: 'Digital data provides immediate access to accurate, up-to-date information. This allows organizations to make informed decisions faster, which can lead to increased efficiency and competitiveness in today\'s fast- paced business environment.',
      buttonText: 'Get Started'
    },
    {
      title: 'Disaster recovery',
      description: 'Digital data offers better protection against unforeseen events such as fires, floods, and earthquakes. Backups and cloud storage ensure continuity when facing catastrophic situations that could destroy paper documents irretrievably.',
      buttonText: 'Get Started'
    },
    {
      title: 'Integration with automated systems',
      description: 'Digital data easily integrates with workflows involving artificial intelligence, machine learning algorithms, and Internet of Things (IoT) devices. Such connections help optimize operations, increase productivity, and reduce human input requirement',
      buttonText: 'Get Started'
    },
    {
      title: 'Flexible scalability',
      description: 'Digital data is highly scalable, meaning organizations can quickly adjust to changes in volume or complexity without incurring high setup costs. Scale-out architectures and cloud environments provide elastic capacity, allowing companies to respond rapidly to growing demands or unexpected surges.',
      buttonText: 'Get Started'
    },
    {
      title: 'Enhanced privacy',
      description: 'Digital data can incorporate robust encryption mechanisms to protect confidential information from unauthorized access. By keeping private details secure, organizations demonstrate responsible stewardship of sensitive data while building trust among clients, partners, and regulators.',
      buttonText: 'Get Started'
    },
    {
      title: 'Transparency and accountability',
      description: 'Digital data creates an auditable trail of actions taken, allowing managers to review user activity, track progress, and verify compliance efforts. This level of transparency increases accountability within teams, leading to higher standards and ethical behavior.',
      buttonText: 'Get Started'
    },
    {
      title: 'Increased mobility',
      description: 'With digital data available online or offline, employees and customers have the flexibility to work remotely or access services at any time, from virtually anywhere. This capability boosts convenience, adaptability, and responsiveness during both routine and emergency circumstances.',
      buttonText: 'Get Started'
    },
    {
      title: 'Streamlined supply chain management',
      description: 'Digital data streamlines procurement procedures, inventory tracking, and logistics coordination. Automating these processes improves visibility into materials flow, ensures timelier deliveries, and reduces waste due to miscommunication, overstocking, or understocking issues.',
      buttonText: 'Get Started'
    },
    {
      title: 'Expanded creative opportunities',
      description: 'Digital data presents endless possibilities for generating, editing, and combining multimedia elements like text, images, videos, audio clips, animations, and virtual/augmented reality experiences. These interactive forms of storytelling engage users and foster memorable encounters with branded content.',
      buttonText: 'Get Started'
    },
    {
      title: 'Innovation and experimentation',
      description: 'Digital data encourages risk-taking, iterative testing, and rapid prototyping. Embracing failure as part of the learning process, companies are freer to explore novel approaches and potentially groundbreaking applications that conventional methods might have discouraged or deemed too expensive to pursue.',
      buttonText: 'Get Started'
    }
  ]

  const testimonialSlidesData = [
    {
      name: 'Reduced costs',
      message: 'Digital Data Tree can help your organisation to reduce their costs by eliminating the need to store and maintain physical records.',
      image: '/images/1.png',
    },
    {
      name: 'Improved security',
      message: 'Digitized information is more secure than physical records, as it can be encrypted and stored in a secure location.Digital Data Tree uses Bank Level Encryption',
      image: '/images/unashe.png',
    },
    {
      name: 'Increased flexibility',
      message: 'Digitized information can be accessed from anywhere, which can give your organization more flexibility in how you operate.',
      image: '/images/test-1.png',
    },

  ]


  const slide = (title: string, description: string, buttonText: string) => {
    return (
      <div className="h-fit rounded-lg flex flex-col content-center items-center">
        <h1 className='text-xs xxsMD:text-sm xsMD:text-xl mini:text-4xl text-white font-extrabold mb-4'>{title}</h1>
        <button className="w-24 xxsMD:w-48 md:w-1/12 lg:w-1/6 2xl:w-1/4 text-center">
          <p className='text-white text-xs xsMD:text-sm'>{description}</p>
        </button>

        <button
          className='h-12 w-24 xxsMD:w-48 bg-[#00947a] rounded-[25px] mt-5 mx-auto text-white p-2'>
          <Link href='/signup'><p className='font-bold text-xs xxsMD:text-xl'>{buttonText}</p></Link>
        </button>
      </div>


    )
  }

  const testimonialSlides = (name: string, testimonial: string, img: string) => {
    return (
      <div className="w-full h-fit rounded-lg flex flex-col items-center mb-8">
        <div className='bg-carousel w-full bg-no-repeat bg-center flex flex-col items-center'>
          <img src={img} className='h-96 w-fit' />
        </div>
        <h1 className='text-xl text-white font-extrabold mb-4'>{name}</h1>
        <p className='text-white w-48 smXS:w-full'>{testimonial}</p>
      </div>


    )
  }

  const tuts = [
    {
      title: 'How to generate a Quotation on Digital Data Tree',
      description: 'Easily generate a Quotation on Digital Data Tree.Each Quotation is automatically added to you Customer Relationship Managment',
      id: 'hYjzHBrUmxk',
    },
    {
      title: 'How to generate a Quotation on Digital Data Tree',
      description: 'Easily generate a Quotation on Digital Data Tree.Each Quotation is automatically added to you Customer Relationship Managment',
      id: 'uNjtbj12MBI',
    },
    {
      title: 'How to generate a Quotation on Digital Data Tree',
      description: 'Easily generate a Quotation on Digital Data Tree.Each Quotation is automatically added to you Customer Relationship Managment',
      id: 'BycELuE3GJs',
    },
    {
      title: 'How to generate a Quotation on Digital Data Tree',
      description: 'Easily generate a Quotation on Digital Data Tree.Each Quotation is automatically added to you Customer Relationship Managment',
      id: 'GCJqe8Rdymk',
    },
    {
      title: 'How to generate a Quotation on Digital Data Tree',
      description: 'Easily generate a Quotation on Digital Data Tree.Each Quotation is automatically added to you Customer Relationship Managment',
      id: 'BUd57WkUQ1c',
    },
    {
      title: 'How to generate a Quotation on Digital Data Tree',
      description: 'Easily generate a Quotation on Digital Data Tree.Each Quotation is automatically added to you Customer Relationship Managment',
      id: 'F3C4fIPxOfE',
    },
    {
      title: 'How to generate a Quotation on Digital Data Tree',
      description: 'Easily generate a Quotation on Digital Data Tree.Each Quotation is automatically added to you Customer Relationship Managment',
      id: '7FIUetzu9T0',
    },
    {
      title: 'How to generate a Quotation on Digital Data Tree',
      description: 'Easily generate a Quotation on Digital Data Tree.Each Quotation is automatically added to you Customer Relationship Managment',
      id: 'aezxv_OE6aY',
    },
    {
      title: 'How to generate a Quotation on Digital Data Tree',
      description: 'Easily generate a Quotation on Digital Data Tree.Each Quotation is automatically added to you Customer Relationship Managment',
      id: 'LnathUtkUYI',
    },
    {
      title: 'How to generate a Quotation on Digital Data Tree',
      description: 'Easily generate a Quotation on Digital Data Tree.Each Quotation is automatically added to you Customer Relationship Managment',
      id: 'QW5n4pVW5BM',
    },
    {
      title: 'How to generate a Quotation on Digital Data Tree',
      description: 'Easily generate a Quotation on Digital Data Tree.Each Quotation is automatically added to you Customer Relationship Managment',
      id: 'AVTPs8nGUeg',
    },


  ]

  const onReady = (event: { data?: any; target: any; }) => {
    event.target.pauseVideo();
  }

  return (
    <div className='relative bg-[#00947a] w-full h-full'>


      <div>
        <Nav />
      </div>
      <Header />
      <div className="rounded-t-[70px] bg-[#027f6d] text-center items-center content-center" id='home'>
        <div id="discover">
          <img src='/images/start.png' className='mx-auto w-48 h-24 mb-6' />
          <h1 className='text-white'>TRUSTED BY</h1>
          <div className='p-16 grid grid-cols-2 sm:grid-cols-4 gap-4'>
            <img src='/images/duraroof.png' className='mx-auto w-48 h-24 object-contain' />
            <img src='/images/megans.png' className='mx-auto w-48 h-24 object-contain' />
            <img src='/images/fundo.png' className='mx-auto w-48 h-24 object-contain' />
            <img src='/images/adlset.png' className='mx-auto w-48 h-24 object-contain' />
            {/* <h1 className='text-white text-sm xs:text-xl xsMD:text-3xl font-bold'>Transform Your Data into a Story with Stunning Presentations</h1>
            <p className='text-white font-bold mt-5 text-xs xs:text-sm xxsMD:text-base'>Turning data into a format that is easy to understand and analyze can be a daunting task, but it doesn&apos;t have to be! With the right tools and software, you can transform your data into a beautiful and emotional presentation that tells a story. Imagine taking a bunch of numbers and turning them into a colorful chart or graph that not only looks stunning but also conveys important information. It&apos;s like creating a work of art that speaks to your audience&apos;s hearts and minds. So, don&apos;t be afraid to get creative and experiment with different formats and presentation styles to bring your data to life and make a lasting impact on your viewers.</p> */}
          </div>

          {/* <img src="/images/sample.png" className='h-full w-full' /> */}

        </div>


        <div className='bg-[#fdc92f] w-full h-fit mt-24 grid grid-cols-1 mini:grid-cols-5 p-8 items-center content-center justify-center space-x-5'>
          <div className='flex flex-col m-4  items-center'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-12 h-12 md:w-32 md:h-32 text-[#7d5c00]">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 3l8.735 8.735m0 0a.374.374 0 11.53.53m-.53-.53l.53.53m0 0L21 21M14.652 9.348a3.75 3.75 0 010 5.304m2.121-7.425a6.75 6.75 0 010 9.546m2.121-11.667c3.808 3.807 3.808 9.98 0 13.788m-9.546-4.242a3.733 3.733 0 01-1.06-2.122m-1.061 4.243a6.75 6.75 0 01-1.625-6.929m-.496 9.05c-3.068-3.067-3.664-7.67-1.79-11.334M12 12h.008v.008H12V12z" />
            </svg>

            <h1 className='text-xs md:text-sm font-bold text-[#7d5c00]'>Works Offline</h1>
          </div>
          <div className='flex flex-col m-4 items-center'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-12 h-12 md:w-32 md:h-32 text-[#7d5c00]">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            <h1 className='text-xs md:text-sm font-bold text-[#7d5c00]'>Bank Level Encryption</h1>
          </div>
          <div className='flex flex-col m-4 items-center'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-12 h-12 md:w-32 md:h-32 text-[#7d5c00]">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
            </svg>
            <h1 className='text-xs md:text-sm  font-bold text-[#7d5c00]'>Barcode/QR Code Scanner Functions</h1>
          </div>
          <div className='flex flex-col m-4 items-center'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-12 h-12 md:w-32 md:h-32 text-[#7d5c00]">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
            </svg>
            <h1 className='text-xs md:text-sm  font-bold text-[#7d5c00]'>Hosted on the Cloud</h1>
          </div>

          <div className='flex flex-col m-4  items-center'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-12 h-12 md:w-32 md:h-32 text-[#7d5c00]">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
            </svg>
            <h1 className='text-xs md:text-sm  font-bold text-[#7d5c00]'>Mobile Application</h1>
          </div>

        </div>
        <div className='p-16 shadow-xl  rounded-2xl'>

          <div className="h-fit rounded-lg grid grid-cols-1 md:grid-cols-2 ">
            <div>
              <img src="/images/automation.jpg" className='w-full h-4/5' />
            </div>
            <div>
              <h1 className='text-xs xxsMD:text-sm xsMD:text-xl mini:text-4xl text-white font-extrabold mb-4'>Customizable Enteprise System</h1>
              <button className="w-full text-left">
                <p className='text-white text-xs xsMD:text-sm m-4'>
                  Digital Data Tree is not just another enterprise system - it&apos;s a transformational solution. We understand that managing data can be overwhelming for businesses, leading to inefficiencies and missed opportunities. That&apos;s why we have created Digital Data Tree, a customizable system that can be tailored to fit the exact digitization needs of every client.
                </p>
                <p className='text-white text-xs xsMD:text-sm m-4'>
                  Think about it: no more manual data entry, no more missing or inaccurate information, no more wasted time. With Digital Data Tree, you can streamline your operations, enhance productivity, and drive business success. Our easy-to-use interface and customizable options empower you to take control of your data and transform your business from the inside out.
                </p>
                <p className='text-white text-xs xsMD:text-sm m-4'>
                  Whether you need to manage customer relationships, optimize event logistics, track inventory, or monitor production, Digital Data Tree has you covered. Say goodbye to tedious and error-prone manual processes, and say hello to automation and efficiency. With real-time access to critical business information, you can provide personalized experiences to your customers, build trust with stakeholders, and make data-driven decisions.
                </p>
                <p className='text-white text-xs xsMD:text-sm m-4'>
                  Imagine the satisfaction of being able to focus on growing your business instead of being bogged down by data management. Think about the joy of having more time to spend with your customers, employees, or loved ones. With Digital Data Tree, you can experience all of this and more.
                </p>
                <p className='text-white text-xs xsMD:text-sm m-4'>
                  So why wait? Join us on the journey to unlocking the full potential of your data. With Digital Data Tree, you can achieve greater efficiency, enhance customer experiences, ensure data security, and make informed decisions in real-time. Transform your business and bring your vision to life with Digital Data Tree today!
                </p>
              </button>


            </div>

          </div>
          <button
            className='h-12 w-full xxsMD:w-48 bg-[#00947a] rounded-[25px] mt-5 mx-auto text-white p-2'>
            <Link href='/signup'><p className='font-bold text-xs xxsMD:text-xl'>Register for Free</p></Link>
          </button>
        </div>
        <div id="blog" className='text-center p-16'>
          {/* // eslint-disable */}
          <Carousel children={shownSlides.map((v) => {
            return (
              slide(v.title, v.description, v.buttonText)
            )
          })} />
        </div>
        <div className='p-8' id="action">
          <h1 className='text-white text-3xl font-bold m-4'>See it in action</h1>
          <p className='text-white m-4'>Elegent and intuitive interface makes Digital Data Tree, easy to use</p>
          <div className='flex flex-row space-x-4 overflow-x-scroll no-scrollbar p-4'>
            {tuts.map((v) => (
              <div key={v.title}>
                <YouTube videoId={v.id}

                  opts={{
                    height: "390",
                    width: "640",
                    playerVars: {
                      autoplay: 0,
                    },
                  }} onReady={(e) => { onReady(e) }} />
              </div>

            ))}
          </div>
        </div>
        <div className='p-8' id="testimonials">
          <h1 className='text-white text-3xl font-bold m-4'>Unlock the Power of Digitization: Transform Your Business for Success</h1>
          <p className='text-white m-4'>Digitization can be a game-changer for businesses of all sizes, offering a multitude of benefits that can transform the way they operate. By embracing digitization, businesses can streamline their processes, boost their productivity, and enhance their customer service. This can lead to increased revenue, improved profitability, and a stronger bottom line. So, if you want to take your business to the next level and stay ahead of the competition, it&apos;s time to embrace digitization and unlock its full potential!

          </p>
          <Carousel children={testimonialSlidesData.map((v) => {
            return (
              testimonialSlides(v.name, v.message, v.image)
            )
          })} />

        </div>
        <div className='text-center rounded-t-[70px] bg-[#0fa991]  p-8 xl:p-16 m-auto' id="pricing">
          <h1 className='text-3xl m-2 text-white'>Pricing</h1>
          <div className='hidden lg:block'>
            <div className='grid grid-cols-5 content-center place-content-center place-items-center justify-center'>
              <div className='bg-[#fdc92f] text-[#7d5c00] rounded-[40px] p-4 font-bold  text-center m-auto shadow-xl  flex flex-col items-center w-48 2xl:w-72'>
                <h1 className='text-xl m-8'>Customer Relationship Management</h1>
                <p>Contact management</p>
                <p>Sales management</p>
                <p>Customer service</p>
                <p>Reporting and analytics</p>
                <h1 className='text-xl m-8 line-through '>500USD</h1>
                <p className='text-sm line-through '>50USD pm hosting</p>
              </div>
              <div className='bg-[#fdc92f] text-[#7d5c00] rounded-[40px] p-4 font-bold  text-center m-auto shadow-xl  flex flex-col items-center w-48 2xl:w-72'>
                <h1 className='text-xl m-8'>HR System</h1>
                <p>Onboarding</p>
                <p>Performance management</p>
                <p>Time and attendance</p>
                <p>Leave management</p>
                <p>Training and development</p>
                <p>Reporting and analytics</p>
                <h1 className='text-xl m-8 line-through '>620USD</h1>
                <p className='text-sm line-through '>25USD pm hosting</p>

              </div>
              <div className='bg-[#fdc92f] text-[#7d5c00] rounded-[40px] p-4 font-bold  text-center m-auto shadow-xl  flex flex-col items-center w-48 2xl:w-72'>
                <h1 className='text-xl m-8'>Digital Data Tree</h1>
                <p>Customer Relationship Management</p>
                <h1 className='text-xl m-8 line-through lg:hidden'>500USD</h1>
                <p>HR System</p>
                <h1 className='text-xl m-8 line-through lg:hidden'>620USD</h1>
                <p>Enteprise Resource Planning</p>
                <h1 className='text-xl m-8 line-through lg:hidden'>1520USD</h1>
                <p>Inventory Management</p>
                <h1 className='text-xl m-8 line-through lg:hidden'>1220USD</h1>
                <p>Compliance System</p>
                <p>E-Receipting</p>
                <p>Events Management</p>
                <p>....and many more </p>
                <h1>Events Management</h1>
                <h1 className='text-xl mt-8 line-through '>2740USD</h1>
                <h1 className='text-xl '>45USD per month</h1>
                <p className='text-sm line-through '>100USD pm hosting</p>
                <p className='text-sm'>Hosting</p>
                <p className='text-sm'>24/7 support</p>
              </div>
              <div className='bg-[#fdc92f] text-[#7d5c00] rounded-[40px] p-4 font-bold  text-center m-auto shadow-xl  flex flex-col w-48 items-center 2xl:w-72'>
                <h1 className='text-xl m-8'>ERP</h1>
                <p>Manage production</p>
                <p>Accounting</p>
                <p>Record customer interactions</p>
                <p>Manage sales orders, quotes, and invoices</p>
                <p>Reporting and analytics</p>
                <h1 className='text-xl m-8 line-through '>1520USD</h1>
                <p className='text-sm line-through '>100USD pm hosting</p>
              </div>
              <div className='bg-[#fdc92f] text-[#7d5c00] rounded-[40px] p-4 font-bold  text-center m-auto shadow-xl  flex flex-col items-center w-48 2xl:w-72'>
                <h1 className='text-xl m-8'>Inventory Management</h1>
                <p>Item tracking</p>
                <p>Receiving,Putaway, Picking, Shipping and Returns</p>
                <p> Cycle counting</p>
                <p>Reporting and analytics</p>
                <h1 className='text-xl m-8 line-through '>1220USD</h1>
                <p className='text-sm line-through '>100USD pm hosting</p>
              </div>
            </div>
          </div>
          <div className='lg:hidden'>
            <div className='bg-[#fdc92f] text-[#7d5c00] rounded-[40px] p-4 font-bold  text-center m-auto shadow-xl  flex flex-col items-center w-full'>
              <h1 className='text-xl m-8'>Digital Data Tree</h1>
              <p>Customer Relationship Management</p>
              <p className='text-xs line-through lg:hidden'>500USD</p>
              <p>HR System</p>
              <p className='text-xs line-through lg:hidden'>620USD</p>
              <p>Enteprise Resource Planning</p>
              <p className='text-xs line-through lg:hidden'>1520USD</p>
              <p>Inventory Management</p>
              <p className='text-xs line-through lg:hidden'>1220USD</p>
              <p>Compliance System</p>
              <p className='text-xs line-through lg:hidden'>820USD</p>
              <p>E-Receipting</p>
              <p className='text-xs line-through lg:hidden'>520USD</p>
              <p>Events Management</p>
              <p className='text-xs line-through lg:hidden'>420USD</p>
              <p>....and many more can be done on Digital Data Tree</p>
              <h1 className='text-xs line-through lg:hidden'>2740USD</h1>
              <h1 className='text-xl '>45USD per month</h1>
              <p className='text-xs line-through lg:hidden'>100USD pm hosting</p>
              <p className='text-sm'>hosting</p>
              <p className='text-sm'>24/7 support</p>
            </div>
          </div>
          <button className={`bg-[#fdc92f] rounded-[30px] p-3 m-8 text-center`}>
            <Link className='text-xl text-[#7d5c00] text-center ' href='/signup'>Get Started</Link>
          </button>

          {/* <div className='text-white my-8 shadow-xl p-8 rounded-2xl' id="affiliate">
            <h1 className='text-5xl font-bold font-title tracking-wide text-[#fdc92f] m-4'>Join us to change the world </h1>
            <p>Imagine a world where you can connect with anyone, anywhere in the world, at any time. A world where you have access to all the information you could ever need, at your fingertips. A world where you can learn new skills, start your own business, and make a difference in the world.

              This is the new digitalised world. And it&#39;s not just a dream. It&#39;s happening right now.

              Digitzation is changing the way we live, work, and learn. It&#39;s creating new opportunities and challenges. But it&#39;s also empowering people like you to make a difference in the world.

              If you&#39;re looking for a way to make a difference, if you&#39;re looking for a new challenge, or if you&#39;re just looking for a way to connect with the world, then digitilization is for you.</p>
            <button className={`bg-[#fdc92f] rounded-[30px] p-3 m-8 text-center`}>
              <Link className='text-xl text-[#7d5c00] text-center ' href='/affiliate'>Become an affiliate</Link>
            </button>
          </div> */}



          <div className='flex flex-col items-center content-center h-fit'>
            <img src='/images/vipLogo.png' className='h-24 mt-8' />
            <p className='text-white text-xs'> a product of</p>
            <p className='text-white'>Vision Is Primary</p>
            <p className='text-white'>©2023</p>
          </div>
        </div>




      </div>
      <Link href={WHATSAPP_CONTACT}>
        <img src='/images/whatsapp.png' className={'animate-bounce fixed bottom-20  right-10 h-16 w-16'} />
      </Link>
    </div >
  )
}

export default Home

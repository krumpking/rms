import React, { useEffect, useState } from 'react';
import { FC } from 'react';
import { getCookie } from 'react-use-cookie';
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from 'next/router';
import Loader from '../../loader';
import { Tab } from '@headlessui/react';
import WebOneWebsite from './webOneWebsite';
import WebOneWebsiteInfo from './webOneInfo';
import { IWebsiteOneInfo } from '../../../types/websiteTypes';
import { getDataFromDBOne } from '../../../api/mainApi';
import { INFO_COLLECTION } from '../../../constants/infoConstants';
import { AMDIN_FIELD } from '../../../constants/constants';
import { useAuthIds } from '../../authHook';
import { WEBSITE_COLLECTION, WEBSITE_INFO_COLLECTION } from '../../../constants/websiteConstants';

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

const Web1 = () => {
    const { adminId, userId, access } = useAuthIds();
    const [loading, setLoading] = useState(true);

    const [tabs, setTabs] = useState(['Website', 'Website Info']);
    const [info, setInfo] = useState<IWebsiteOneInfo>({
        id: "",
        websiteName: "",
        adminId: "",
        userId: "",
        logo: {
            original: "",
            thumbnail: ""
        },
        serviceProviderName: "Quizznos",
        headerTitle: "Meet, East & Enjoy the true taste",
        headerText: "The food places an neighourhood restaurent serving seasonal global cuisine driven by faire",
        aboutUsImage: {
            original: "",
            thumbnail: ""
        },
        aboutUsTitle: "About us title",
        aboutUsInfo: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam ornare tempus aliquet. Pellentesque finibus, est et iaculis suscipit, dolor nulla commodo dui, nec ultricies arcu nisl tristique eros. Morbi eros est, pulvinar eget ornare ac, ultrices eget risus. Ut lobortis pellentesque pretium. Praesent sollicitudin vestibulum iaculis. Mauris a finibus orci. Quisque ipsum nunc, efficitur sit amet blandit ut, aliquam quis dui.",
        themeMainColor: "#8b0e06",
        themeSecondaryColor: "#8b0e06",
        headerImage: {
            original: "",
            thumbnail: ""
        },
        reservation: true,
        contactUsImage: {
            original: "",
            thumbnail: ""
        },
        email: "email@email.com",
        address: "Address",
        phone: "phone Number",
        date: new Date(),
        dateString: new Date().toString(),
        deliveryCost: 0,
        mapLocation: {}

    });


    useEffect(() => {

        getInfo();


    }, []);

    const getInfo = () => {
        getDataFromDBOne(WEBSITE_INFO_COLLECTION, AMDIN_FIELD, adminId).then((v) => {
            if (v !== null) {
                v.data.forEach((el) => {
                    let d = el.data();
                    setInfo({
                        id: el.id,
                        websiteName: d.websiteName,
                        adminId: d.adminId,
                        userId: d.userId,
                        logo: d.logo,
                        serviceProviderName: d.serviceProvider,
                        headerTitle: d.headerTitle,
                        headerText: d.headerText,
                        aboutUsImage: d.aboutUsImage,
                        aboutUsTitle: d.aboutUsTitle,
                        aboutUsInfo: d.aboutUsInfo,
                        themeMainColor: d.themeMainColor,
                        themeSecondaryColor: d.themeSecondaryColor,
                        headerImage: d.headerImage,
                        reservation: d.reservation,
                        contactUsImage: d.contactUsImage,
                        email: d.email,
                        address: d.adress,
                        phone: d.phone,
                        date: d.date,
                        dateString: d.dateString,
                        deliveryCost: d.deliveryCost,
                        mapLocation: d.mapLocation
                    });
                });

            }
            setLoading(false);
        }).catch((e) => {
            console.error(e);
            toast.error('There was an error, please try again');
        })
    }








    return (
        <div>
            {loading ? (
                <div className="flex flex-col items-center content-center h-screen justify-center">
                    <Loader color={''} />
                </div>
            ) : (
                <div className="bg-white rounded-[30px] p-4 ">

                    <Tab.Group>
                        <Tab.List className="flex space-x-4 rounded-[25px] bg-[#f3f3f3] p-1 overflow-x-auto whitespace-nowrap">
                            {tabs.map((category) => (
                                <Tab
                                    key={category}
                                    className={({ selected }) =>
                                        classNames(
                                            'w-full  py-2.5 text-sm font-medium leading-5 text-black rounded-[25px]',
                                            'ring-white m-1',
                                            selected
                                                ? 'bg-white shadow-md focus:outline-none te'
                                                : 'text-black hover:bg-white/[0.12] hover:text-white focus:outline-none'
                                        )
                                    }
                                >
                                    {category}
                                </Tab>
                            ))}
                        </Tab.List>
                        <Tab.Panels className="mt-2 ">
                            <Tab.Panel
                                className={classNames(
                                    'rounded-xl bg-white p-3',
                                    'ring-white  ring-offset-2 focus:outline-none focus:ring-2'
                                )}
                            >
                                <WebOneWebsite info={info} />
                            </Tab.Panel>
                            <Tab.Panel
                                className={classNames(
                                    'rounded-xl bg-white p-3',
                                    'ring-white  ring-offset-2 focus:outline-none focus:ring-2'
                                )}
                            >
                                <WebOneWebsiteInfo />
                            </Tab.Panel>

                        </Tab.Panels>
                    </Tab.Group>
                </div>
            )}
            <ToastContainer position="top-right" autoClose={5000} />
        </div>
    );
};

export default Web1;

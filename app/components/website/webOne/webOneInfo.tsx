import React, { useEffect, useState } from 'react';
import { FC } from 'react';
import { getCookie } from 'react-use-cookie';
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from 'next/router';
import Loader from '../../loader';
import { IWebsiteOneInfo } from '../../../types/websiteTypes';


const WebOneWebsiteInfo = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [info, setInfo] = useState<IWebsiteOneInfo>({
        id: "",
        websiteId: 1,
        adminId: "",
        userId: "",
        title: "",
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

    });


    useEffect(() => {




    }, [])




    return (
        <div>
            {loading ? (
                <div className="flex flex-col items-center content-center">
                    <Loader />
                </div>
            ) : (
                <div className="bg-white rounded-[30px] p-4 ">


                </div>
            )}
            <ToastContainer position="top-right" autoClose={5000} />
        </div>
    );
};

export default WebOneWebsiteInfo;

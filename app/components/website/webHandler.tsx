import React, { useEffect, useState } from 'react';
import { FC } from 'react';
import { getCookie } from 'react-use-cookie';
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from 'next/router';
import Loader from '../loader';
import { getDataFromDBOne, getDataFromDBTwo } from '../../api/mainApi';
import { WEBSITE_COLLECTION, WEBSITE_INFO_COLLECTION } from '../../constants/websiteConstants';
import { AMDIN_FIELD } from '../../constants/constants';
import { IWebsite, IWebsiteOneInfo } from '../../types/websiteTypes';
import WebOneWebsite from './webOne/webOneWebsite';
import Nothing from '../nothing';
import { print } from '../../utils/console';
import { Any } from 'react-spring';

interface MyProps {
    business: string,
}


const WebsiteHandler: FC<MyProps> = ({ business }) => {
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [adminId, setAdminId] = useState("adminId");
    const [website, setWebsite] = useState<IWebsite>({
        id: "",
        websiteId: "",
        adminId: "",
        userId: "",
        websiteName: "",
        chosenWebsiteNo: 0,
        src: 'images/webOne.png',
        date: new Date(),
        dateString: ""
    });
    const [info, setInfo] = useState<any>(); // Make this IWebsiteInfo to catch errors earlier

    useEffect(() => {
        getWebsiteInfo();
    }, []);

    const getWebsiteInfo = () => {

        getDataFromDBTwo(WEBSITE_COLLECTION, AMDIN_FIELD, adminId, "websiteName", business).then((v) => {
            if (v !== null) {
                v.data.forEach((el) => {
                    let d = el.data();
                    setWebsite({
                        id: d.id,
                        websiteId: d.websiteId,
                        adminId: d.adminId,
                        userId: d.userId,
                        websiteName: d.websiteName,
                        chosenWebsiteNo: d.chosenWebsiteNo,
                        src: d.src,
                        date: d.date,
                        dateString: d.dateString
                    });
                });

                getDataFromDBOne(WEBSITE_INFO_COLLECTION, AMDIN_FIELD, adminId).then((v) => {

                    if (v !== null) {

                        v.data.forEach(element => {
                            let d = element.data();

                            setInfo({
                                id: element.id,
                                websiteName: d.websiteName,
                                adminId: d.adminId,
                                userId: d.userId,
                                logo: d.logo,
                                serviceProviderName: d.serviceProviderName,
                                headerImage: d.headerImage,
                                headerTitle: d.headerTitle,
                                headerText: d.headerText,
                                aboutUsImage: d.aboutUsImage,
                                aboutUsTitle: d.aboutUsTitle,
                                aboutUsInfo: d.aboutUsInfo,
                                themeMainColor: d.themeMainColor,
                                themeSecondaryColor: d.themeSecondaryColor,
                                reservation: d.reservation,
                                contactUsImage: d.contactUsImage,
                                email: d.email,
                                address: d.address,
                                phone: d.phone,
                                date: d.date,
                                dateString: d.dateString,
                                deliveryCost: d.deliveryCost,
                                mapLocation: d.mapLocation
                            });

                        });


                        setLoading(false);




                    } else {
                        setLoading(false);
                    }


                }).catch((e) => {
                    console.error(e);
                    setLoading(true);
                });

            } else {
                router.push("/");
                setLoading(false);
            }

        }).catch((e) => {
            console.error(e);
        });
    }


    const getWebSite = () => {
        switch (website.chosenWebsiteNo) {
            case 0:
                return <Nothing text={'It looks like such a website does not exist with us'} />
            case 1:
                return <WebOneWebsite info={info} />;

            default:
                return <Nothing text={'It looks like such a website does not exist with us'} />
        }
    }

    return (
        <div>
            {loading ? (
                <div className="flex flex-col items-center content-center h-screen justify-center">
                    <Loader color={''} />
                </div>
            ) : (
                <div>{getWebSite()}</div>
            )}
            <ToastContainer position="top-right" autoClose={5000} />
        </div>
    );
};

export default WebsiteHandler;

import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import Loader from '../app/components/loader';
import { LIGHT_GRAY, PRIMARY_COLOR } from '../app/constants/constants';
import DeliveryComponent from '../app/components/delivery/delivery';
import Login from './login';
import { Tab } from '@headlessui/react';

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}


const Delivery = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [index, setIndex] = useState(0);
    const [tabs, setTabs] = useState(['Available Deliveries', 'My Deliveries', 'Delivery History']);
    const [userId, setUserId] = useState("");


    useEffect(() => {

        document.body.style.backgroundColor = LIGHT_GRAY;


    }, [])


    const getView = () => {
        switch (index) {
            case 0:

                return (
                    <Login
                        changeIndex={(index: number, userId: string) => {
                            setIndex(index);
                            setUserId(userId);
                        }}
                        isDeliveryService={true}
                    />
                );

            case 1:
                return (
                    <div className=' w-full h-screen p-4 md:p-8 2xl:p-16 '>

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
                                                    ? 'bg-white shadow-md focus:outline-none'
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
                                    <DeliveryComponent
                                        changeIndex={(index: number) => {
                                            setIndex(index);
                                        }}
                                        tab={0}
                                        userId={userId}
                                    />
                                </Tab.Panel>
                                <Tab.Panel
                                    className={classNames(
                                        'rounded-xl bg-white p-3',
                                        'ring-white  ring-offset-2 focus:outline-none focus:ring-2'
                                    )}
                                >
                                    <DeliveryComponent
                                        changeIndex={(index: number) => {
                                            setIndex(index);

                                        }}
                                        tab={1}
                                        userId={userId}
                                    />
                                </Tab.Panel>
                                <Tab.Panel
                                    className={classNames(
                                        'rounded-xl bg-white p-3',
                                        'ring-white  ring-offset-2 focus:outline-none focus:ring-2'
                                    )}
                                >
                                    <DeliveryComponent
                                        changeIndex={(index: number) => {
                                            setIndex(index);

                                        }}
                                        tab={2}
                                        userId={userId}
                                    />
                                </Tab.Panel>

                            </Tab.Panels>
                        </Tab.Group>
                    </div>
                );

            default:
                break;
        }

    }

    return (
        <div>


            {getView()}


        </div>
    );
};

export default Delivery;

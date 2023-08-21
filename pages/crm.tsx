import React, { useEffect, useState } from 'react'
import { LIGHT_GRAY, PRIMARY_COLOR } from '../app/constants/constants';
import Loader from '../app/components/loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClientNav from '../app/components/clientNav';
import { Tab } from '@headlessui/react';
import AddClient from '../app/components/addClients';
import ClientProfile from '../app/components/clientProfiles';
import CRMTasks from '../app/components/crmTasks';
import ClientJourney from '../app/components/clientJourney';
import CRMReport from '../app/components/crmReport';

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

const CRM = () => {
    const [tabs, setTabs] = useState([
        "Add Profile",
        "Profiles",
        "Tasks",
        // "Client Journey",
        "Reports"
    ])



    useEffect(() => {
        document.body.style.backgroundColor = LIGHT_GRAY;


        return () => {

        }

    }, []);






    return (
        <div>
            <div className='flex flex-col lg:grid lg:grid-cols-12 '>

                <div className='lg:col-span-3'>
                    <ClientNav organisationName={'Vision Is Primary'} url={'crm'} />
                </div>

                <div className="w-full m-2 px-2 py-8 sm:px-0 col-span-9  ">
                    <Tab.Group>
                        <Tab.List className="flex space-x-4 rounded-[25px] bg-green-900/20 p-1 overflow-x-auto whitespace-nowrap">
                            {tabs.map((category) => (
                                <Tab
                                    key={category}
                                    className={({ selected }) =>
                                        classNames(
                                            'w-full  py-2.5 text-sm font-medium leading-5 text-[#00947a] rounded-[25px]',
                                            'ring-white ring-opacity-60 ring-offset-2 ring-offset-[#00947a] focus:outline-none focus:ring-2',
                                            selected
                                                ? 'bg-white shadow p-4'
                                                : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
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
                                    'ring-white ring-opacity-60 ring-offset-2 focus:outline-none focus:ring-2'
                                )}
                            >
                                <AddClient />
                            </Tab.Panel>
                            <Tab.Panel

                                className={classNames(
                                    'rounded-xl bg-white p-3',
                                    'ring-white ring-opacity-60 ring-offset-2 focus:outline-none focus:ring-2'
                                )}
                            >
                                <ClientProfile />
                            </Tab.Panel>
                            <Tab.Panel

                                className={classNames(
                                    'rounded-xl bg-white p-3',
                                    'ring-white ring-opacity-60 ring-offset-2 focus:outline-none focus:ring-2'
                                )}
                            >
                                <CRMTasks />
                            </Tab.Panel>
                            {/* <Tab.Panel

                                className={classNames(
                                    'rounded-xl bg-white p-3',
                                    'ring-white ring-opacity-60 ring-offset-2  focus:outline-none focus:ring-2'
                                )}
                            >
                                <ClientJourney />
                            </Tab.Panel> */}
                            <Tab.Panel

                                className={classNames(
                                    'rounded-xl bg-white p-3',
                                    'ring-white ring-opacity-60 ring-offset-2 focus:outline-none focus:ring-2'
                                )}
                            >
                                <CRMReport />
                            </Tab.Panel>

                        </Tab.Panels>
                    </Tab.Group>
                </div>




            </div>

            <ToastContainer
                position="top-right"
                autoClose={5000} />
        </div>

    )
};


export default CRM

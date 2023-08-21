import React, { useEffect, useState } from 'react';
import { LIGHT_GRAY, PRIMARY_COLOR } from '../app/constants/constants';
import Loader from '../app/components/loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import ClientNav from '../app/components/clientNav';
import { Tab } from '@headlessui/react';
import AddStock from '../app/components/addStock';
import ConfirmStock from '../app/components/confirmStock';
import AvailableStock from '../app/components/availableStock';
import Analytics from '../app/components/analytics';


function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const Inventory = () => {
  const [tabs, setTabs] = useState([
    'Add Stock',
    'Confirm Stock',
    'Available Stock',
    'Analytics'
  ]);

  useEffect(() => {
    document.body.style.backgroundColor = LIGHT_GRAY;

    return () => {};
  }, []);

  return (
    <div>
      <div className="grid grid-cols-12">
        <div className="col-span-3">
          <ClientNav organisationName={'Vision Is Primary'} url={'inventory'} />
        </div>

        <div className="w-full m-2 px-2 py-8 sm:px-0 col-span-9 ">
          <Tab.Group>
            <Tab.List className="flex space-x-1 rounded-[25px] bg-green-900/20 p-1">
              {tabs.map((category) => (
                <Tab
                  key={category}
                  className={({ selected }) =>
                    classNames(
                      'w-full  py-2.5 text-sm font-medium leading-5 text-[#00947a] rounded-[25px]',
                      'ring-white ring-opacity-60 ring-offset-2 ring-offset-[#00947a] focus:outline-none focus:ring-2',
                      selected
                        ? 'bg-white shadow'
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
                <AddStock />
              </Tab.Panel>
              <Tab.Panel
                className={classNames(
                  'rounded-xl bg-white p-3',
                  'ring-white ring-opacity-60 ring-offset-2 focus:outline-none focus:ring-2'
                )}
              >
              
              <ConfirmStock/>
              </Tab.Panel> 

              <Tab.Panel
                className={classNames(
                  'rounded-xl bg-white p-3',
                  'ring-white ring-opacity-60 ring-offset-2 focus:outline-none focus:ring-2'
                )}
              >
              
              <AvailableStock/>
              </Tab.Panel> 
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default Inventory;

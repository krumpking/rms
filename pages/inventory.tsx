import React, { useEffect, useState } from 'react';
import { LIGHT_GRAY, PRIMARY_COLOR } from '../app/constants/constants';
import Loader from '../app/components/loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import ClientNav from '../app/components/clientNav';
import { Tab } from '@headlessui/react';
import AddStock from '../app/components/inventory/addStock';
import AvailableStock from '../app/components/inventory/availableStock';
import Analytics from '../app/components/analytics';
import AddInventory from '../app/components/inventory/addStock';
import AddStockCategory from '../app/components/inventory/addStockCategory';
import ConfirmStock from '../app/components/inventory/confirmStock';
import StockOverview from '../app/components/inventory/stockOverview';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const Inventory = () => {
  const [tabs, setTabs] = useState([
    'Overview',
    'Served',
    'In The Kitchen',
    'In Pantry',
    'Confirm Stock',
    'Add Stock',
    'Add Category'


  ]);

  useEffect(() => {
    document.body.style.backgroundColor = LIGHT_GRAY;

    return () => { };
  }, []);

  return (
    <div>
      <div className="flex flex-col">
        <div className="col-span-3">
          <ClientNav organisationName={'Vision Is Primary'} url={'inventory'} />
        </div>

        <div className="w-full m-2 px-2 py-8 sm:px-0 col-span-9 ">
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
                        : 'text-blue-100 hover:bg-white/[0.12] hover:text-white focus:outline-none'
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
                <StockOverview />
              </Tab.Panel>
              <Tab.Panel
                className={classNames(
                  'rounded-xl bg-white p-3',
                  'ring-white ring-opacity-60 ring-offset-2 focus:outline-none focus:ring-2'
                )}
              >
                <AvailableStock status='Served' />
              </Tab.Panel>
              <Tab.Panel
                className={classNames(
                  'rounded-xl bg-white p-3',
                  'ring-white ring-opacity-60 ring-offset-2 focus:outline-none focus:ring-2'
                )}
              >
                <AvailableStock status='Kitchen' />
              </Tab.Panel>

              <Tab.Panel
                className={classNames(
                  'rounded-xl bg-white p-3',
                  'ring-white ring-opacity-60 ring-offset-2 focus:outline-none focus:ring-2'
                )}
              >
                <AvailableStock status='Pantry' />
              </Tab.Panel>
              <Tab.Panel
                className={classNames(
                  'rounded-xl bg-white p-3',
                  'ring-white ring-opacity-60 ring-offset-2 focus:outline-none focus:ring-2'
                )}
              >
                <ConfirmStock />
              </Tab.Panel>
              <Tab.Panel
                className={classNames(
                  'rounded-xl bg-white p-3',
                  'ring-white ring-opacity-60 ring-offset-2 focus:outline-none focus:ring-2'
                )}
              >
                <AddInventory />
              </Tab.Panel>
              <Tab.Panel
                className={classNames(
                  'rounded-xl bg-white p-3',
                  'ring-white ring-opacity-60 ring-offset-2 focus:outline-none focus:ring-2'
                )}
              >
                <AddStockCategory />
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

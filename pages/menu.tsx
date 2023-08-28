import React, { useEffect, useState } from 'react';
import { LIGHT_GRAY, PRIMARY_COLOR } from '../app/constants/constants';
import Loader from '../app/components/loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import ClientNav from '../app/components/clientNav';
import { Tab } from '@headlessui/react';
import AddMenuCategory from '../app/components/menu/menuCategory';
import AddMenuItem from '../app/components/menu/addMenuItem';
import CreateMeal from '../app/components/menu/createMeal';
import Meal from '../app/components/menu/meal';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const Menu = () => {
  const [phone, setPhone] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [tabs, setTabs] = useState([
    'Create Category',
    'Add Menu Item',
    'Create Meal',
    'Meals',
  ]);

  useEffect(() => {
    document.body.style.backgroundColor = LIGHT_GRAY;
  }, []);

  return (
    <div>
      <div>
        <div className="flex flex-col ">
          <div className="lg:col-span-3" id="nav">
            <ClientNav organisationName={'FoodiesBooth'} url={'menu'} />
          </div>

          {loading ? (
            <div className="flex flex-col justify-center items-center w-full col-span-9">
              <Loader />
            </div>
          ) : (
            <div className="bg-white col-span-8 my-8 rounded-[30px] flex flex-col p-8">
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
                      'ring-white  ring-offset-2 focus:outline-none focus:ring-2'
                    )}
                  >
                    <AddMenuCategory />
                  </Tab.Panel>
                  <Tab.Panel
                    className={classNames(
                      'rounded-xl bg-white p-3',
                      'ring-white  ring-offset-2 focus:outline-none focus:ring-2'
                    )}
                  >
                    <AddMenuItem />
                  </Tab.Panel>
                  <Tab.Panel
                    className={classNames(
                      'rounded-xl bg-white p-3',
                      'ring-white  ring-offset-2 focus:outline-none focus:ring-2'
                    )}
                  >
                    <CreateMeal />
                  </Tab.Panel>
                  <Tab.Panel
                    className={classNames(
                      'rounded-xl bg-white p-3',
                      'ring-white  ring-offset-2 focus:outline-none focus:ring-2'
                    )}
                  >
                    <Meal />
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
            </div>
          )}
        </div>

        <ToastContainer position="top-right" autoClose={5000} />
      </div>

      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default Menu;

import React, { useEffect, useState } from 'react';
import {
  LIGHT_GRAY,
} from '../app/constants/constants';
import Loader from '../app/components/loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import ClientNav from '../app/components/clientNav';
import { searchStringInMembers } from '../app/utils/stringM';
import { print } from '../app/utils/console';
import { IForm } from '../app/types/formTypes';
import { getForms } from '../app/api/formApi';
import { Tab } from '@headlessui/react';
import AddReservation from '../app/components/reservations/addReservation';
import AvailableReservations from '../app/components/reservations/availableReservations';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const Bookings = () => {
  const [phone, setPhone] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [previousForms, setPreviousForms] = useState<IForm[]>([]);
  const [formsSearch, setFormsSearch] = useState('');
  const [temp, setTemp] = useState<IForm[]>([]);
  const [tabs, setTabs] = useState([
    'Available Reservations',
    'Reservations History',
    'Add Reservation',
  ]);

  useEffect(() => {
    document.body.style.backgroundColor = LIGHT_GRAY;
    setPreviousForms([]);

    // checkPayment();


  }, []);

  // const checkPayment = async () => {
  //     const paymentStatus = await Payment.checkPaymentStatus();
  //     if (!paymentStatus) {
  //         toast.warn('It appears your payment is due, please pay up to continue enjoying Digital Data Tree');

  //         setTimeout(() => {
  //             router.push({
  //                 pathname: '/payments',
  //             });
  //         }, 5000);

  //     }
  // }

  const handleKeyDown = (event: { key: string }) => {
    if (event.key === 'Enter') {
      setLoading(true);
      if (formsSearch !== '') {
        let res: IForm[] = searchStringInMembers(temp, formsSearch);
        setTemp([]);
        print(res);
        if (res.length > 0) {
          setTimeout(() => {
            setTemp(res);
            setLoading(false);
          }, 1500);
        } else {
          toast.info(`${formsSearch} not found`);
          setTimeout(() => {
            setTemp(previousForms);
            setLoading(false);
          }, 1500);
        }
      } else {
        setTemp([]);
        setTimeout(() => {
          setTemp(previousForms);
          setLoading(false);
        }, 1500);
      }
    }
  };

  return (
    <div>
      <div className="flex flex-col">
        <div className="lg:col-span-3">
          <ClientNav organisationName={'Vision Is Primary'} url={'bookings'} />
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center w-full col-span-8">
            <Loader color={''} />
          </div>
        ) : (
          <div className="bg-white col-span-9 m-8 rounded-[30px] p-4 lg:p-16 overflow-y-scroll">
            <Tab.Group>
              <Tab.List className="flex space-x-1 rounded-[25px] bg-[#f3f3f3] p-1">
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
                    'ring-white ring-opacity-60 ring-offset-2 focus:outline-none focus:ring-2'
                  )}
                >
                  <AvailableReservations isHistory={false} />
                </Tab.Panel>
                <Tab.Panel
                  className={classNames(
                    'rounded-xl bg-white p-3',
                    'ring-white ring-opacity-60 ring-offset-2 focus:outline-none focus:ring-2'
                  )}
                >
                  <AvailableReservations isHistory={true} />
                </Tab.Panel>
                <Tab.Panel
                  className={classNames(
                    'rounded-xl bg-white p-3',
                    'ring-white ring-opacity-60 ring-offset-2 focus:outline-none focus:ring-2'
                  )}
                >

                  <AddReservation />
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default Bookings;

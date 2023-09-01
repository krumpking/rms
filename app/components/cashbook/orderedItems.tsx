import React, { useEffect, useState } from 'react';
import { FC } from 'react';
import { getCookie } from 'react-use-cookie';
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from 'next/router';
import Loader from '../loader';
import { Disclosure } from '@headlessui/react';
import { IOrder } from '../../types/orderTypes';
import { getOneDocument } from '../../api/mainApi';
import { ORDER_COLLECTION } from '../../constants/orderConstants';
import { print } from '../../utils/console';
import { IMeal } from '../../types/menuTypes';



interface MyProps {
    id: string,
}


const OrderedItems: FC<MyProps> = ({ id }) => {
    const [meals, setMeals] = useState<IMeal[]>([]);
    const [loading, setLoading] = useState(true);
    const [orderNo, setOrderNo] = useState("");
    const [date, setDate] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [total, setTotal] = useState("");
    const router = useRouter()


    useEffect(() => {


        getOrders();

    }, [])


    const getOrders = () => {

        getOneDocument(ORDER_COLLECTION, id).then((v) => {

            if (v !== null) {
                let res = v.data.data();
                setOrderNo(`Order No: ${res.orderNo}`);
                setCustomerName(`Customer Name: ${res.customerName}`);
                setDate(res.dateString);
                setTotal(`Total: ${res.totalCost}USD`);
                res.items.forEach((element: any) => {
                    let d = element;

                    setMeals(meals => [...meals, {
                        id: element.id,
                        adminId: d.adminId,
                        userId: d.userId,
                        menuItems: d.menuItems,
                        title: d.title,
                        discount: d.discount,
                        description: d.description,
                        category: d.category,
                        date: d.date,
                        dateString: d.dateString,
                        price: d.price,
                        pic: d.pic
                    }]);

                });



            }
            setLoading(false);

        }).catch((e) => {
            console.error(e);
            setLoading(true);
        });
    }



    return (
        <div>
            {loading ? (
                <div className="flex flex-col items-center content-center">
                    <Loader />
                </div>
            ) : (
                <div className="bg-white rounded-[30px] p-4  ">
                    <h1>
                        {orderNo}
                    </h1>
                    <h1>
                        {total}
                    </h1>
                    <h1>
                        {customerName}
                    </h1>
                    <p className='text-xs text-gray-400'>
                        {date}
                    </p>

                    <div className='grid grid-cols-2 lg:grid-cols-5  gap-4'>
                        {meals.map((v) => {
                            return (
                                <div className='flex flex-col shadow-xl rounded-[25px] p-8 w-[250px] '>
                                    <h1 className='font-bold text-xl text-[#8b0e06]'>Title: {v.title}</h1>
                                    <h1 className='font-bold text-sm'>Price: {v.price}USD</h1>
                                    <p className='font-bold text-sm'>{v.description}</p>

                                </div>
                            )
                        })}
                    </div>


                </div>
            )}
            <ToastContainer position="top-right" autoClose={5000} />
        </div>
    );
};

export default OrderedItems;

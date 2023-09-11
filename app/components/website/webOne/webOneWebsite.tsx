import React, { useEffect, useState } from 'react';
import { FC } from 'react';
import { getCookie } from 'react-use-cookie';
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from 'next/router';
import Loader from '../../loader';
import { IContact, IWebsiteOneInfo } from '../../../types/websiteTypes';
import ShowImage from '../../showImage';
import { IMeal, IMenuItem } from '../../../types/menuTypes';
import { getDataFromDBOne } from '../../../api/mainApi';
import { MEAL_ITEM_COLLECTION, MEAL_STORAGE_REF, MENU_ITEM_COLLECTION, MENU_STORAGE_REF } from '../../../constants/menuConstants';
import { AMDIN_FIELD } from '../../../constants/constants';
import { searchStringInArray } from '../../../utils/arrayM';
import { IOrder } from '../../../types/orderTypes';

const WebOneWebsite = () => {
    const [surname, setSurname] = useState('');
    const [position, setPosition] = useState('');
    const [name, setName] = useState('');
    const [gender, setGender] = useState('');
    const [date, setDate] = useState('');
    const [address, setAddress] = useState('');
    const [number, setNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [account, setAccount] = useState('');
    const [bank, setBank] = useState('');
    const router = useRouter();
    const [index, setIndex] = useState(0);
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
    const [meals, setMeals] = useState<IMeal[]>([]);
    const [mealsSto, setMealsSto] = useState<IMeal[]>([]);
    const [menuItems, setMenuItems] = useState<IMenuItem[]>([]);
    const [menuItemsSto, setMenuItemsSto] = useState<IMenuItem[]>([]);
    const [webfrontname, setWebfrontname] = useState("webfrontId");
    const [adminId, setAdminId] = useState("adminId");
    const [search, setSearch] = useState("");
    const [reservation, setReservation] = useState({});
    const [contact, setContact] = useState<IContact>({
        id: "",
        adminId: "",
        userId: "",
        name: "",
        phone: "",
        email: '',
        message: ""
    });
    const [view, setView] = useState<any>(<p>Hi</p>)
    const [addItems, setAddItems] = useState<any[]>([]);


    useEffect(() => {

        getMeals();
        getMenuItems();
    }, []);

    const getMeals = () => {

        getDataFromDBOne(MEAL_ITEM_COLLECTION, AMDIN_FIELD, adminId).then((v) => {

            if (v !== null) {

                v.data.forEach(element => {
                    let d = element.data();

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
                    setMealsSto(meals => [...meals, {
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

    const getMenuItems = () => {

        getDataFromDBOne(MENU_ITEM_COLLECTION, AMDIN_FIELD, adminId).then((v) => {

            if (v !== null) {

                v.data.forEach(element => {
                    let d = element.data();

                    setMenuItems(menuItems => [...menuItems, {
                        id: element.id,
                        adminId: d.adminId,
                        userId: d.userId,
                        pic: d.pic,
                        title: d.title,
                        discount: d.discount,
                        description: d.description,
                        category: d.category,
                        date: d.date,
                        dateString: d.dateString,
                        price: d.price
                    }]);
                    setMenuItemsSto(menuItems => [...menuItems, {
                        id: element.id,
                        adminId: d.adminId,
                        userId: d.userId,
                        pic: d.pic,
                        title: d.title,
                        discount: d.discount,
                        description: d.description,
                        category: d.category,
                        date: d.date,
                        dateString: d.dateString,
                        price: d.price
                    }]);

                });



            }
            setLoading(false);

        }).catch((e) => {
            console.error(e);
            setLoading(true);
        });
    }

    const handleKeyDown = (event: { key: string; }) => {

        if (event.key === 'Enter') {
            searchFor();
        }
    };

    const searchFor = () => {
        setMenuItems([]);
        setMeals([]);
        setLoading(true);
        if (search !== '') {

            let res: IMenuItem[] = searchStringInArray(menuItemsSto, search);
            let results: IMeal[] = searchStringInArray(mealsSto, search);
            if (res.length > 0 || results.length > 0) {
                setTimeout(() => {
                    setMenuItems(res);
                    setMeals(results);
                    setLoading(false);
                }, 1500);

            } else {
                toast.info(`${search} not found `);
                setTimeout(() => {
                    setMenuItems(menuItemsSto);
                    setMeals(mealsSto);
                    setLoading(false);
                }, 1500);


            }


        } else {

            setTimeout(() => {
                setMenuItems(menuItemsSto);
                setMeals(mealsSto);
                setLoading(false);
            }, 1500);

        }
    }


    const handleChange = (e: any) => {
        setReservation({
            ...reservation,
            [e.target.name]: e.target.value
        })
    }

    const handleChangeContact = (e: any) => {
        setContact({
            ...contact,
            [e.target.name]: [e.target.value]
        })
    }




    const addToCart = (v: any) => {
        setAddItems(categories => [...categories, v]);
    }




    return (
        <div>
            {loading ? (
                <div className="flex flex-col items-center content-center">
                    <Loader />
                </div>
            ) : (
                <div className="bg-white rounded-[30px] p-4 ">
                    <div className='flex flex-col'>
                        <div className='flex justify-between'>
                            <div className='flex flex-row items-center space-x-4'>
                                {info.logo.thumbnail !== "" ?
                                    <ShowImage src={`${webfrontname}/info/websiteOne/${info.logo.thumbnail}`} alt={''} style={'h-8 rounded-md w-8'} /> :
                                    <img src="images/logo.png" className='h-8 rounded-[25px] w-8' />}
                                {info.serviceProviderName}
                            </div>
                            <div className='flex flex-row items-center space-x-4 font-bold'>
                                <a><h1>Home</h1></a>
                                <a><h1>Menu</h1></a>
                                <a><h1>About Us</h1></a>
                                <a><h1>Contact Us</h1></a>
                                <button className="py-4 px-1 relative border-2 border-transparent text-gray-800 rounded-full hover:text-gray-400 focus:outline-none focus:text-gray-500 transition duration-150 ease-in-out" aria-label="Cart"
                                >
                                    <svg className="h-6 w-6" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
                                        <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                    </svg>
                                    <span className="absolute inset-0 object-right-top -mr-6">
                                        <div className={"inline-flex items-center px-1.5 py-0.5 border-2 border-white rounded-full text-xs font-semibold leading-4 text-white"} style={{ backgroundColor: `${info.themeMainColor}` }} >
                                            {addItems.length}
                                        </div>
                                    </span>
                                </button>
                            </div>
                        </div>
                        <div className='grid grid-cols-2 place-content-center place-items-center mb-6'>
                            <div className='flex flex-col space-y-10'>
                                <h1 className='text-6xl font-bold'>{info.headerTitle}</h1>
                                <p className='text-bold'>{info.headerText}</p>
                                <button
                                    className='py-2 px-5 text-white rounded-md w-1/4'
                                    style={{ backgroundColor: `${info.themeMainColor}` }}
                                >
                                    Order Now
                                </button>
                            </div>
                            <div className='p-4 '>
                                {info.headerImage.thumbnail !== "" ?
                                    <ShowImage src={`${webfrontname}/info/websiteOne/${info.headerImage.thumbnail}`} alt={''} style={''} /> :
                                    <img src="images/webOneDefaultPicture.jpg" className='h-96 rounded-[25px] w-96' />}

                            </div>

                        </div>
                        <div className='flex flex-col mb-6'>
                            <h1 className='text-4xl text-center mb-12'>Our Favorite Menu</h1>
                            <div className='grid grid-cols-3 gap-8'>
                                {menuItems.slice(0, 3).map((v) => (
                                    <div className='relative shadow-2xl rounded-md p-4 w-3/4'>
                                        <div className='p-4'>
                                            <p className="text-xl">{v.title}</p>
                                            <div className='flex justify-between'>
                                                <p className='text-md'>{v.price}USD</p>
                                                <div className='relative rounded-md p-2' style={{ backgroundColor: `${info.themeMainColor}` }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 text-white">
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                                                    </svg>
                                                </div>
                                            </div>

                                        </div>
                                        <div className='absolute -top-10 -left-10 right-10 z-10 '>
                                            <ShowImage src={`/${webfrontname}/${MENU_STORAGE_REF}/${v.pic.thumbnail}`} alt={'Menu Item'} style={'rounded-full h-20 w-20 '} />
                                        </div>
                                    </div>
                                ))}

                            </div>

                        </div>
                        <div className='grid grid-cols-2 place-content-center place-items-center mb-6'>
                            <div>
                                {info.headerImage.thumbnail !== "" ?
                                    <ShowImage src={`${webfrontname}/info/websiteOne/${info.aboutUsImage.thumbnail}`} alt={''} style={'h-96 rounded-[25px] w-96'} /> :
                                    <img src="images/webOneDefaultPicture.jpg" className='h-96 rounded-[25px] w-96' />}
                            </div>
                            <div>
                                <h1 className='text-5xl'>{info.aboutUsTitle}</h1>
                                <p>{info.aboutUsInfo}</p>
                            </div>

                        </div>
                        <div className='flex flex-col'>
                            <div className='flex justify-between content-center items-center mb-6'>
                                <h1 className='text-2xl'>Order Now</h1>
                                <div className='flex flex-row space-x-4 max-w-[800px] overflow-x-auto'>
                                    {menuItems.map((v) => (
                                        <h1
                                            className='hover:cursor-pointer'
                                            onClick={() => { setSearch(v.category); searchFor(); }
                                            }>
                                            {v.category}
                                        </h1>
                                    ))}
                                    {meals.map((v) => (
                                        <h1
                                            className='hover:cursor-pointer'

                                            onClick={() => { setSearch(v.category); searchFor(); }}>
                                            {v.category}
                                        </h1>
                                    ))}

                                </div>

                            </div>
                            <input
                                type="text"
                                value={search}
                                placeholder={"Search"}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                }}
                                style={{ borderColor: `${info.themeMainColor}` }}
                                className="
                                        w-full
                                        rounded-md
                                        border-2
                                        py-3
                                        px-5
                                        bg-white
                                        text-base text-body-color
                                        placeholder-[#ACB6BE]
                                        outline-none
                                        focus-visible:shadow-none
                                        focus:border-primary
                                        mb-6
                                        "

                                onKeyDown={handleKeyDown}
                            />
                            <div className='grid grid-cols-4 gap-4 mb-6'>
                                {menuItems.map((v) => (
                                    <div className='flex flex-col shadow-2xl rounded-md'>
                                        <ShowImage src={`/${webfrontname}/${MENU_STORAGE_REF}/${v.pic.thumbnail}`} alt={'Menu Item'} style={'rounded-md h-64 w-full'} />
                                        <h1 className='font-bold text-4xl px-4'>{v.title}</h1>
                                        <div className='flex flex-row justify-between p-4 items-center'>
                                            <h1 className='font-bold text-xl'>{v.price}USD</h1>
                                            <button
                                                className='py-2 px-5 text-white rounded-md w-1/2'
                                                style={{ backgroundColor: `${info.themeMainColor}` }}
                                            >
                                                Add to cart
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {meals.map((v) => (
                                    <div className='flex flex-col shadow-2xl rounded-md'>
                                        <ShowImage src={`/${webfrontname}/${MEAL_STORAGE_REF}/${v.pic.thumbnail}`} alt={'Menu Item'} style={'rounded-md h-64 w-full'} />
                                        <h1 className='font-bold text-4xl px-4'>{v.title}</h1>
                                        <div className='flex flex-row justify-between p-4 items-center'>
                                            <h1 className='font-bold text-xl'>{v.price}USD</h1>
                                            <button
                                                className='py-2 px-5 text-white rounded-md w-1/2'
                                                style={{ backgroundColor: `${info.themeMainColor}` }}
                                            >
                                                Add to cart
                                            </button>
                                        </div>
                                    </div>
                                ))}


                            </div>
                        </div>
                        {info.reservation ?
                            <div className='flex flex-col p-4 mb-6'>
                                <h1 className='text-4xl text-center'>Make a reservation</h1>
                                <div className='grid grid-cols-2 mb-6 gap-4 shadow-md p-8'>
                                    <input
                                        type="text"
                                        // value={reservation}
                                        name="name"
                                        placeholder={"Full Name"}
                                        onChange={handleChange}
                                        style={{ borderColor: `${info.themeMainColor}` }}
                                        className="
                                        w-full
                                        rounded-md
                                        border-2
                                        py-3
                                        px-5
                                        bg-white
                                        text-base text-body-color
                                        placeholder-[#ACB6BE]
                                        outline-none
                                        focus-visible:shadow-none
                                        focus:border-primary
                                        mb-6
                                        "
                                    />
                                    <input
                                        type="date"
                                        // value={search}
                                        // placeholder={"Date"}
                                        name="date"
                                        onChange={handleChange}
                                        style={{ borderColor: `${info.themeMainColor}` }}
                                        className="
                                        w-full
                                        rounded-md
                                        border-2
                                        py-3
                                        px-5
                                        bg-white
                                        text-base text-body-color
                                        placeholder-[#ACB6BE]
                                        outline-none
                                        focus-visible:shadow-none
                                        focus:border-primary
                                        mb-6
                                        "
                                    />
                                    <input
                                        type="time"
                                        // value={search}
                                        placeholder={"time"}
                                        name="time"
                                        onChange={handleChange}
                                        style={{ borderColor: `${info.themeMainColor}` }}
                                        className="
                                        w-full
                                        rounded-md
                                        border-2
                                        py-3
                                        px-5
                                        bg-white
                                        text-base text-body-color
                                        placeholder-[#ACB6BE]
                                        outline-none
                                        focus-visible:shadow-none
                                        focus:border-primary
                                        mb-6
                                        "

                                        onKeyDown={handleKeyDown}
                                    />
                                    <input
                                        type="number"
                                        name="number"
                                        value={search}
                                        placeholder={"Number of people"}
                                        onChange={(e) => {
                                            setSearch(e.target.value);
                                        }}
                                        style={{ borderColor: `${info.themeMainColor}` }}
                                        className="
                                        w-full
                                        rounded-md
                                        border-2
                                        py-3
                                        px-5
                                        bg-white
                                        text-base text-body-color
                                        placeholder-[#ACB6BE]
                                        outline-none
                                        focus-visible:shadow-none
                                        focus:border-primary
                                        mb-6
                                        "

                                        onKeyDown={handleKeyDown}
                                    />
                                    <button
                                        className='py-2 px-5 text-white rounded-md w-full'
                                        style={{ backgroundColor: `${info.themeMainColor}` }}
                                    >
                                        Add Reservation
                                    </button>

                                </div>
                            </div>
                            : <p></p>}
                        <div className='grid grid-cols-2 gap-4 mb-6 place-items-center'>
                            <div>
                                {info.headerImage.thumbnail !== "" ?
                                    <ShowImage src={`${webfrontname}/info/websiteOne/${info.aboutUsImage.thumbnail}`} alt={''} style={'h-96 rounded-[25px] w-96'} /> :
                                    <img src="images/webOneDefaultPicture.jpg" className='h-96 rounded-[25px] w-96' />}
                            </div>
                            <div>
                                <h1 className='text-4xl text-center mb-6'>Contact Us</h1>
                                <input
                                    type="text"
                                    // value={reservation}
                                    name="name"
                                    placeholder={"Full Name"}
                                    onChange={handleChangeContact}
                                    style={{ borderColor: `${info.themeMainColor}` }}
                                    className="
                                        w-full
                                        rounded-md
                                        border-2
                                        py-3
                                        px-5
                                        bg-white
                                        text-base text-body-color
                                        placeholder-[#ACB6BE]
                                        outline-none
                                        focus-visible:shadow-none
                                        focus:border-primary
                                        mb-6
                                        "
                                />
                                <input
                                    type="text"
                                    // value={reservation}
                                    name="phoneNumber"
                                    placeholder={"Phone Number"}
                                    onChange={handleChangeContact}
                                    style={{ borderColor: `${info.themeMainColor}` }}
                                    className="
                                        w-full
                                        rounded-md
                                        border-2
                                        py-3
                                        px-5
                                        bg-white
                                        text-base text-body-color
                                        placeholder-[#ACB6BE]
                                        outline-none
                                        focus-visible:shadow-none
                                        focus:border-primary
                                        mb-6
                                        "
                                />
                                <input
                                    type="text"
                                    // value={reservation}
                                    name="email"
                                    placeholder={"Email"}
                                    onChange={handleChangeContact}
                                    style={{ borderColor: `${info.themeMainColor}` }}
                                    className="
                                        w-full
                                        rounded-md
                                        border-2
                                        py-3
                                        px-5
                                        bg-white
                                        text-base text-body-color
                                        placeholder-[#ACB6BE]
                                        outline-none
                                        focus-visible:shadow-none
                                        focus:border-primary
                                        mb-6
                                        "
                                />
                                <textarea

                                    // value={reservation}
                                    name="message"
                                    placeholder={"Message"}
                                    onChange={handleChangeContact}
                                    style={{ borderColor: `${info.themeMainColor}` }}
                                    className="
                                        w-full
                                        rounded-md
                                        border-2
                                        py-3
                                        px-5
                                        bg-white
                                        text-base text-body-color
                                        placeholder-[#ACB6BE]
                                        outline-none
                                        focus-visible:shadow-none
                                        focus:border-primary
                                        mb-6
                                        "
                                />
                                <button
                                    className='py-2 px-5 text-white rounded-md w-full'
                                    style={{ backgroundColor: `${info.themeMainColor}` }}
                                >
                                    Send Message
                                </button>
                            </div>

                        </div>
                        <div className='flex flex-col content-center items-center min-h-48 text-white p-8' style={{ backgroundColor: `${info.themeMainColor}` }}>
                            {info.logo.thumbnail !== "" ?
                                <ShowImage src={`${webfrontname}/info/websiteOne/${info.logo.thumbnail}`} alt={''} style={'h-8 rounded-[25px] w-8'} /> :
                                <img src="images/logo.png" className='h-8 rounded-[25px] w-8' />}
                            <h1 className='mb-6'>{info.title}</h1>
                            <h1 className='mb-6'>{info.email}</h1>
                            <h1 className='mb-6'>{info.phone}</h1>
                            <h1 className='mb-6'>{info.address}</h1>
                            <h1 className='mb-6'>&copy;2023</h1>

                        </div>


                    </div >

                </div>
            )}
            <ToastContainer position="top-right" autoClose={5000} />
        </div>
    );
};

export default WebOneWebsite;

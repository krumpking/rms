import React, { useEffect, useState } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import { getCookie } from 'react-use-cookie';
import { ADMIN_ID, COOKIE_ID, LIGHT_GRAY } from '../../constants/constants';
import Loader from '../loader';
import { createId } from '../../utils/stringM';
import { Iinfo } from '../../types/infoTypes';
import { addResInfo, getResInfo } from '../../api/infoApi';
import { decrypt } from '../../utils/crypto';
import { setDate } from 'date-fns';
import { checkEmptyOrNull } from '../../utils/objectM';

const AddMenuCategory = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [webfrontname, setWebfrontname] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [adminId, setAdminId] = useState('adminId');
  const [date, setDate] = useState<Date>(new Date());
  const [dateString, setDateString] = useState('');
  const [id, setId] = useState('');
  const [docId, setDocId] = useState('');

  useEffect(() => {
    document.body.style.backgroundColor = LIGHT_GRAY;

    var infoFromCookie = '';
    if (getCookie(ADMIN_ID) == '') {
      infoFromCookie = getCookie(COOKIE_ID);
    } else {
      infoFromCookie = getCookie(ADMIN_ID);
    }
    setAdminId(decrypt(infoFromCookie, COOKIE_ID));

    getInfo();
  }, []);

  const getInfo = () => {
    getResInfo(adminId)
      .then((r) => {
        if (r !== null) {
          r.forEach((el) => {
            let val = el.data();
            setWebfrontname(val.webfrontId);
            setTitle(val.title);
            setDescription(val.description);
            setCategory(val.category);
            setPrice(val.price);
            setEmail(val.email);
            setDate(val.date);
            setDateString(val.dateString);
            setId(val.id);
            setDocId(el.id);
          });
          setLoading(false);
        }
      })
      .catch((e: any) => {
        console.error(e);
        setLoading(false);
        toast.error('There was an error please try again');
      });
  };

  const addInfo = () => {
    let ident = '';
    if (id === '') {
      ident = createId();
    } else {
      ident = id;
    }

    let info: Iinfo = {
      adminId: 'adminId',
      webfrontId: webfrontname,
      title: title,
      description: description,
      category: category,
      price: price,
      email: email,
      date: new Date(),
      dateString: new Date().toDateString(),
      id: ident,
      gallery: [],
    };

    if (checkEmptyOrNull(info)) {
      toast.error('Ooops looks like you left out some information');
    } else {
      setLoading(true);
      addResInfo(docId, info)
        .then((v) => {
          if (v == null) {
            toast.error(
              'Webfront name is already taken please try another one'
            );
          } else {
            toast.success('Wohooo information successfully saved!');
          }
          setLoading(false);
        })
        .catch((e: any) => {
          setLoading(false);
          console.error(e);
          toast.error('There was an error please try again');
        });
    }
  };

  return (
    <div>
      <div className="bg-white rounded-[30px] p-4  overflow-y-scroll">
        {loading ? (
          <div className="w-full flex flex-col items-center content-center">
            <Loader />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="flex flex-col items-center space-y-2 w-full">
              <div className="grid grid-rows-auto bg-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-lg sm:rounded-lg sm:px-10 space-y-4">
                <div className="grid grid-rows-4 border-dashed border-2 border-indigo-600 place-items-center">
                  <input className="hidden" />
                  <div className="mt-8">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776"
                      />
                    </svg>
                  </div>
                  <p>Select multiple files</p>
                  <p>OR</p>
                  <p>Drop pictures here</p>
                </div>

                <button
                  onClick={() => {}}
                  className="
    font-bold
    w-ful
    rounded-[25px]
    border-2
    border-[#8b0e06]
    border-primary
    py-3
    px-10
    bg-[#8b0e06]
    text-base 
    text-white
    cursor-pointer
    hover:bg-opacity-90
    transition
"
                >
                  Upload Images
                </button>
              </div>

              <div className="mb-6">
                <input
                  type="text"
                  value={title}
                  placeholder={'Title'}
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                  className="
                                        w-full
                                        rounded-[25px]
                                        border-2
                                        border-[#8b0e06]
                                        py-3
                                        px-5
                                        bg-white
                                        text-base text-body-color
                                        placeholder-[#ACB6BE]
                                        outline-none
                                        focus-visible:shadow-none
                                        focus:border-primary
                                        "
                  required
                />
              </div>
              <div className="mb-6">
                <textarea
                  value={description}
                  placeholder={'Description'}
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                  className="
                                        w-full
                                        h-48
                                        rounded-[25px]
                                        border-2
                                        border-[#8b0e06]
                                        py-3
                                        px-5
                                        bg-white
                                        text-base text-body-color
                                        placeholder-[#ACB6BE]
                                        outline-none
                                        focus-visible:shadow-none
                                        focus:border-primary
                                        "
                  required
                />
              </div>
              <div className="mb-6">
                <input
                  type="text"
                  value={category}
                  placeholder={'Category'}
                  onChange={(e) => {
                    setCategory(e.target.value);
                  }}
                  className="
                                        w-full
                                        rounded-[25px]
                                        border-2
                                        border-[#8b0e06]
                                        py-3
                                        px-5
                                        bg-white
                                        text-base text-body-color
                                        placeholder-[#ACB6BE]
                                        outline-none
                                        focus-visible:shadow-none
                                        focus:border-primary
                                        "
                  required
                />
              </div>

              <div className="mb-6">
                <input
                  type="text"
                  value={price}
                  placeholder={'Price'}
                  onChange={(e) => {
                    setPrice(e.target.value);
                  }}
                  className="
                                        w-full
                                        rounded-[25px]
                                        border-2
                                        border-[#8b0e06]
                                        py-3
                                        px-5
                                        bg-white
                                        text-base text-body-color
                                        placeholder-[#ACB6BE]
                                        outline-none
                                        focus-visible:shadow-none
                                        focus:border-primary
                                        "
                  required
                />
              </div>
              <button
                onClick={() => {
                  addInfo();
                }}
                className="
                                        font-bold
                                        w-ful
                                        rounded-[25px]
                                        border-2
                                        border-[#8b0e06]
                                        border-primary
                                        py-3
                                        px-10
                                        bg-[#8b0e06]
                                        text-base 
                                        text-white
                                        cursor-pointer
                                        hover:bg-opacity-90
                                        transition
                                    "
              >
                Add Menu Item
              </button>
            </div>
            <div className="flex flex-col items-center space-y-2 w-fullre"></div>
          </div>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default AddMenuCategory;

import React, { Fragment, useCallback, useEffect, useState } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import { getCookie } from 'react-use-cookie';
import { ADMIN_ID, AMDIN_FIELD, COOKIE_ID, LIGHT_GRAY } from '../../constants/constants';
import Loader from '../loader';
import { createId } from '../../utils/stringM';
import { Iinfo } from '../../types/infoTypes';
import { addResInfo, getResInfo } from '../../api/infoApi';
import { decrypt } from '../../utils/crypto';
import { setDate } from 'date-fns';
import { checkEmptyOrNull } from '../../utils/objectM';
import { ICategory } from '../../types/menuTypes';
import ShowImage from '../showImage';
import { useDropzone } from 'react-dropzone';
import imageCompression from 'browser-image-compression';
import { MENU_CAT_COLLECTION } from '../../constants/menuConstants';
import { addDocument, deleteDocument, deleteFile, getDataFromDBOne, uploadFile } from '../../api/mainApi';
import { CATEGORY_STORAGE_REF } from '../../constants/categoryConstants';
import { Dialog, Transition } from '@headlessui/react';

const AddMenuCategory = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [adminId, setAdminId] = useState('adminId');
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [webfrontId, setWebfrontId] = useState("");
  const [title, setTitle] = useState("");
  const [files, setFiles] = useState<any[]>([]);
  const [docId, setDocId] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.backgroundColor = LIGHT_GRAY;

    var infoFromCookie = '';
    if (getCookie(ADMIN_ID) == '') {
      infoFromCookie = getCookie(COOKIE_ID);
    } else {
      infoFromCookie = getCookie(ADMIN_ID);
    }
    // setAdminId(decrypt(infoFromCookie, COOKIE_ID));
    setWebfrontId("webfrontId");

    getCategories();
  }, []);


  const getCategories = () => {
    getDataFromDBOne(MENU_CAT_COLLECTION, AMDIN_FIELD, adminId).then((v) => {

      if (v !== null) {

        v.data.forEach(element => {
          let d = element.data();
          setCategories(categories => [...categories, {
            id: element.id,
            adminId: d.adminId,
            userId: d.userId,
            pic: d.pic,
            category: d.category,
            date: d.date,
            dateString: d.dateString
          }]);
        });


      }
      setLoading(false);

    }).catch((e) => {
      console.error(e);
      setLoading(true);
    });
  }


  const addCategory = async () => {

    setLoading(true);
    const name = files[0].name;


    try {


      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      }



      await uploadFile(`${webfrontId}/${CATEGORY_STORAGE_REF}/${name}`, files[0]);
      const info = name.split('_');


      try {
        const compressedFile = await imageCompression(files[0], options);

        // Thumbnail
        await uploadFile(`${webfrontId}/${CATEGORY_STORAGE_REF}/thumbnail_${name}`, compressedFile);




        let category: ICategory = {
          id: 'id',
          adminId: "adminId",
          category: title,
          pic: {
            original: name,
            thumbnail: `thumbnail_${name}`
          },
          date: new Date(),
          dateString: new Date().toDateString(),
          userId: "id"
        }
        setCategories([]);

        addDocument(MENU_CAT_COLLECTION, category).then((v) => {
          setLoading(false);
          setFiles([]);
          getCategories();
        }).catch((e: any) => {
          setFiles([]);
          getCategories();
          setLoading(false);
          console.error(e);
          toast.error('There was an error please try again');
        });
      } catch (error) {
        console.log(error);
      }




    } catch (e) {
      console.error(e);
    }



  }

  const onDrop = useCallback((acceptedFiles: File[]) => {


    if (files.length > 0) {
      let currFiles = files;

      currFiles.concat(acceptedFiles);
      setFiles(currFiles);
    } else {
      setFiles(acceptedFiles);
    }




  }, [])

  const { getRootProps, getInputProps } = useDropzone({ onDrop });


  const deleteItem = (id: string, pic: any) => {
    var result = confirm("Are you sure you want to delete?");
    if (result) {
      setLoading(true);
      deleteFile(`${webfrontId}/${CATEGORY_STORAGE_REF}/${pic.original}`);
      deleteFile(`${webfrontId}/${CATEGORY_STORAGE_REF}/${pic.thumbnail}`);
      deleteDocument(MENU_CAT_COLLECTION, id).then(() => {
        getCategories();
      }).catch((e: any) => {
        console.error(e);
        setLoading(false);
      });
    }

  }


  return (
    <div>
      <div className="bg-white rounded-[30px] p-4">
        {loading ? (
          <div className="w-full flex flex-col items-center content-center">
            <Loader />
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-5 overflow-y-scroll max-h-[700px] w-full gap-4 p-4">
            <div className='flex shadow-xl rounded-[25px] p-8 w-[250px]  items-center justify-center' onClick={() => { setOpen(true) }}>
              <div className='flex flex-col items-center justify-center'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" className="w-16 h-16">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add Menu Item
              </div>
            </div>
            {categories.map((v) => {
              return (
                <div className='flex flex-col shadow-xl rounded-[25px] p-8 w-[250px] '>
                  <div className='flex flex-row-reverse'>
                    <button onClick={() => { deleteItem(v.id, v.pic) }}>

                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 m-1">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>


                    </button>
                  </div>
                  <ShowImage src={`/${webfrontId}/menu-category/${v.pic.thumbnail}`} alt={'Menu Category'} style={'rounded-[25px] h-20 w-full'} />
                  <h1 className='font-bold text-2xl'>{v.category}</h1>
                </div>
              )
            })}


          </div>
        )}
      </div>

      <Transition appear show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setOpen(false)}
        >
          <div className="min-h-screen px-4 text-center backdrop-blur-sm ">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="bg-white my-8 inline-block w-full max-w-md transform overflow-hidden rounded-2xl p-6 text-left align-middle shadow-xl transition-all">

                <Dialog.Title
                  as="h3"
                  className="text-sm font-medium leading-6 text-gray-900 m-4"
                >

                  {files.length > 0 ?
                    <div className="grid grid-cols-2 gap-4">
                      <p>Adding  Category</p>
                      <p>{files.length} Picture{files.length > 1 ? 's' : ''} Added</p>
                    </div> : 'Adding Category Item'}
                </Dialog.Title>
                <div className="flex flex-col items-center space-y-2 w-full">
                  <div className="w-full">
                    <div className="flex flex-col border-dashed border-2 border-[#8b0e06] place-items-center p-8" {...getRootProps()}>
                      <input className="hidden"

                        {...getInputProps()} />

                      <div className="mt-4">
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
                      <p>Drop picture here</p>
                      <p>or</p>
                      <p>Click here to select</p>
                    </div>


                  </div>
                  {files.length > 0 ? <p className='bg-green-600 text-white w-full rounded-[25px] p-4'>{files.length} Image{files.length > 1 ? 's' : ''} Added</p> : <p></p>}
                  <div className="mb-6 w-full">
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
                  <button
                    onClick={() => {
                      addCategory();
                    }}
                    className="
                    font-bold
                    w-full
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
                    Add Category
                  </button>
                </div>


              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default AddMenuCategory;


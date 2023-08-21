import React, { Fragment, useEffect, useState } from 'react'
import { FC } from 'react';
import Elem, { iElements } from './elements';
import { Menu, Transition } from '@headlessui/react'
import Random from '../utils/random';
import Loader from './loader';
import { IFormElement } from '../types/formTypes';

interface MyProps {
    addElement: (elemt: IFormElement) => void,
    duplicateElement: (elemt: IFormElement) => void,
    deleteElement: (index: number) => void,
    form: IFormElement,
    index: number,
    elements: IFormElement[]
}



const FormElement: FC<MyProps> = ({ addElement, duplicateElement, deleteElement, form, index, elements }) => {
    const [label, setLabel] = useState("");
    const [num, setNum] = useState(0);
    const [clicked, setClicked] = useState("");



    useEffect(() => {

        if (elements.length === 1) {
            setClicked(form.id);
        }



    }, [elements])




    const createId = () => {
        return Random.randomString(8, "abcdefghijklmnopqrstuvwxyz");
    }



    return (
        <div className='w-full flex flex-col items-center'
        >

            {clicked === form.id ?
                <div className='grid grid-cols-12 w-11/12 gap-4'>
                    <div className='col-span-10 flex flex-row w-full shadow-md'>
                        <div className='bg-[#00947a] rounded-l-[30px] w-2'>

                        </div>
                        <div className="p-4 flex flex-col space-y-6  bg-white w-full rounded-r-[10px]">

                            <div className='flex flex-col space-y-6 p-2'>
                                <div className='grid grid-cols-2 gap-4'>
                                    <input
                                        type="text"
                                        placeholder={"Enter label"}
                                        value={label}
                                        onChange={(e) => {
                                            setLabel(e.target.value);
                                        }}
                                        className="
                                        col-span-1
                                        w-full
                                        rounded-[25px]
                                        border-2
                                        border-[#fdc92f]
                                        py-3
                                        px-5
                                        bg-white
                                        text-base text-body-color
                                        placeholder-[#ACB6BE]
                                        outline-none
                                        focus-visible:shadow-none
                                        focus:border-primary
                                        "
                                    />
                                    <Menu as="div" className="relative inline-block text-left col-span-1 px-2">
                                        <div>
                                            <Menu.Button className="inline-flex w-full justify-center rounded-[30px] bg-[#fdc92f] px-4 py-3  font-medium text-white hover:bg-opacity-70">
                                                Options
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                                                    className="w-6 h-6">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                                </svg>

                                            </Menu.Button>
                                        </div>
                                        <Transition
                                            as={Fragment}
                                            enter="transition ease-out duration-100"
                                            enterFrom="transform opacity-0 scale-95"
                                            enterTo="transform opacity-100 scale-100"
                                            leave="transition ease-in duration-75"
                                            leaveFrom="transform opacity-100 scale-100"
                                            leaveTo="transform opacity-0 scale-95"
                                        >
                                            <Menu.Items className="absolute right-0 mt-2 w-full origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                <div className="px-1 py-1 flex flex-col space-y-2 w-full">
                                                    {iElements.map((v, index) => (
                                                        <Menu.Button
                                                            key={index}
                                                            onClick={() => {
                                                                setNum(index);
                                                            }}>
                                                            {v}
                                                        </Menu.Button>
                                                    ))}
                                                </div>

                                            </Menu.Items>
                                        </Transition>
                                    </Menu>
                                </div>

                                <Elem label={label} num={num} />
                            </div>


                        </div>

                    </div>
                    <div className='col-span-2 w-full rounded-[10px] grid grid-cols-1 gap-4 '>
                        {/* Add , Duplicate,Delete */}
                        <button className='bg-white rounded-[10px] flex flex-col items-center p-2 shadow-md'
                            onClick={() => {
                                const el = {
                                    id: createId(),
                                    elementId: num,
                                    label: label,
                                    arg1: null,
                                    arg2: null,
                                    arg3: null
                                }
                                setClicked(el.id);
                                addElement(el);

                            }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            Add
                        </button>

                        <button className='bg-white rounded-[10px] flex flex-col items-center p-2 shadow-md'
                            onClick={() => {
                                const el = {
                                    id: createId(),
                                    elementId: form.elementId,
                                    label: form.label,
                                    arg1: null,
                                    arg2: null,
                                    arg3: null
                                }
                                addElement(el);
                                setClicked(el.id);
                            }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                            </svg>
                            Duplicate
                        </button>
                        <button className='bg-white rounded-[10px] flex flex-col items-center p-2 shadow-md'
                            onClick={() => {
                                deleteElement(index);

                            }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                            Delete
                        </button>


                    </div>
                </div> :
                <div className='flex flex-col space-y-4  bg-white shadow-2xl rounded-[10px] w-11/12 p-8'
                    onClick={() => {
                        setClicked(form.id);
                    }}
                    onFocus={() => {
                        setClicked(form.id);
                    }}
                    onBlur={() => {
                        setClicked("");
                    }}>
                    <h1 className='w-full'>Label: {label}</h1>
                    <div className='flex flex-row space-x-4'>
                        <p>
                            Expected Input:
                        </p>
                        <Elem label={label} num={num} />
                    </div>

                </div>

            }


        </div>
    )
};


export default FormElement
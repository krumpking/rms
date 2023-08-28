import React, { FC } from "react";

interface MyProps {
    children: any,
    isOpen: any,
    setIsOpen: any,
    bg: string
}

const Drawer: FC<MyProps> = ({ children, isOpen, setIsOpen, bg }) => {
    return (
        <main
            className={
                " fixed overflow-hidden z-[100] bg-gray-900 bg-opacity-25 inset-0 transform ease-in-out " +
                (isOpen
                    ? " transition-opacity opacity-100 duration-500 translate-x-0 backdrop-blur-sm bg-white "
                    : " transition-all delay-500 opacity-0 translate-x-full  ")
            }
        >
            <section
                onClick={() => {
                    setIsOpen(false);
                }}
                className={
                    " w-screen max-w-lg right-0 absolute bg-transparent h-full shadow-xl delay-400 duration-500 ease-in-out transition-all transform   " +
                    (isOpen ? " translate-x-0 " : " translate-x-full ")
                }
            >
                <article className={bg + " relative w-screen max-w-lg pb-10 flex flex-col space-y-6 overflow-y-scroll h-full  rounded-[30px] items-center shadow-md px-8"}>
                    {children}
                </article>
            </section>
            <section
                className=" w-screen h-full cursor-pointer "
                onClick={() => {
                    setIsOpen(false);
                }}
            ></section>
        </main>
    );
}

export default Drawer
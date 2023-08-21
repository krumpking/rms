import { FC, useEffect, useState } from "react";
import classNames from "classnames";
import Pill from "./pill";
import TaskExpressed from "./taskExpressed";
import { print } from "../utils/console";

interface MyProps {
    title: string,
    task: any
}



const TaskAccordion: FC<MyProps> = ({ title, task }) => {
    const [open, setOpen] = useState(false);





    return (
        <div className="w-full">
            <input
                id="expandCollapse"
                type="checkbox"
                checked={open}
                className="peer sr-only h-24"
            />
            <label
                htmlFor="expandCollapse"
                className={classNames(
                    "w-full flex px-4 items-center bg-[#00947a] h-12 rounded-[15px] justify-between"
                )}
                onClick={() => setOpen(!open)}
            >

                <p className="text-white">{title}</p>
                {open ?
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 text-right text-white">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>

                    :

                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 text-right text-white">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                }

            </label>
            <div
                className={classNames(
                    "overflow-hidden h-0 bg-gray-100 rounded-[15px] ",
                    "peer-checked:h-[300px] peer-checked:overflow-scroll ",
                )}
            >
                <div className="p-4 grid grid-cols-2">
                    <div className='flex flex-col'>
                        <Pill title={`${task.client?.name}`} description={'Name'} />
                        <Pill title={`${task.client?.contact}`} description={'Contact'} />
                        <Pill title={`${task.client?.organisation}`} description={'Organization'} />
                        <Pill title={`${task.client?.refSource}`} description={'Came to us through'} />
                        <Pill title={`${task.client?.enquired.map((v: any) => v.product)}`} description={'Enquired About'} />
                        <Pill title={`${task.client?.value}`} description={'Total Value'} />
                        <Pill title={`${task.client?.stage}`} description={'Stage'} />
                        <Pill title={`${task.client?.notes}`} description={'Notes'} />
                    </div>
                    <div>
                        <TaskExpressed title={task.title} description={task.description} date={task.date} priority={task.priority} email={task.email} />
                    </div>
                </div>

            </div>
        </div>
    );
};


export default TaskAccordion;
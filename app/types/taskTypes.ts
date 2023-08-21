import { IClient } from "./userTypes"

export type ITask = {
    docId: any,
    title: any,
    email: any,
    priority: any,
    reminder: any,
    description: any,
    encryption: number,
    date: any,
    dateString: any,
    active: boolean,
    taskDate: any,
    client: IClient

}


export type IData = {
    id: string,
    title: string,
    descr: string,
    date: string,
    editorId: string,
    encryption: number,
    info: any[],
    infoId: string
}




export interface IDynamicObject {
    [key: string]: any;
}



export interface DateTime {
    // Required fields
    readonly timestamp: number | undefined;
    // Optional additional members based on other types
}
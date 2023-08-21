export type IForm = {
    id?: string,
    title: string,
    description: string,
    elements: IFormElement[],
    dateCreated: string,
    creatorId: string,
    adminId: string,
    editorNumbers: string[]
}

export type IFormElement = {
    id: string,
    elementId: number,
    label: string,
    arg1: any,
    arg2: any,
    arg3: any
}
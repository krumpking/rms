export const checkEmptyOrNull = (obj: any) => {
    for (let key in obj) {
        if (obj[key] === null || obj[key] === undefined || obj[key] === '') {
            return true; // returns true if any property is empty, null or undefined
        }
    }
    return false; // returns false if all properties have value
}


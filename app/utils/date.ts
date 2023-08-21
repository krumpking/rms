import { DateTime } from "../types/types";

export default class DateMethods {

    static showMonth = (number: number) => {
        switch (number + 1) {
            case 1:
                return "January";
            case 2:
                return "February";
            case 3:
                return "March";
            case 4:
                return "April";
            case 5:
                return "May";
            case 6:
                return "June";
            case 7:
                return "July";
            case 8:
                return "August";
            case 9:
                return "September";
            case 10:
                return "October";
            case 11:
                return "November";
            case 12:
                return "December";
            default:
                break;
        }
    };

    static diffDatesDays(d1: string, d2: string): number {
        let date1 = new Date(d1);
        let date2 = new Date(d2);

        let diffTime = date2.getTime() - date1.getTime();

        return Math.floor(diffTime / (1000 * 60 * 60 * 24));
    }




    static sortObjectsByDate(objects: any, up: boolean): any {
        const sortedObjects = objects.sort((a: any, b: any) => {
            let date1: any;
            let date2: any;
            if (a.hasOwn('dateString')) {
                date1 = new Date(a.dateString);
                date2 = new Date(b.dateString);
            } else {
                date1 = new Date(a.date);
                date2 = new Date(b.date);
            }

            if (up) {
                return date1 - date2;
            } else {
                return date2 - date1;
            }

        });
        return sortedObjects;
    }





}
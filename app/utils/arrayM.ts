import { getCookie } from 'react-use-cookie';
import { print } from './console';
import { decrypt } from './crypto';
import { numberWithCommas } from './stringM';
import { ADMIN_ID } from '../constants/constants';
import { useAuthIds } from '../components/authHook';

const { adminId, userId, access } = useAuthIds();

export function findOccurrences(array: any[], value: any): number {
	let count = 0;
	for (let i = 0; i < array.length; i++) {
		if (array[i] === value) {
			count++;
		}
	}
	return count;
}

export function findOccurrencesObjectId(array: any[], id: any): number {
	let count = 0;
	for (let i = 0; i < array.length; i++) {
		if (array[i].id === id) {
			count++;
		}
	}
	return count;
}

export function returnOccurrencesIndex(array: any[], id: any): number {
	let count = -1;
	for (let i = 0; i < array.length; i++) {
		if (array[i].id === id) {
			count = i;
			break;
		}
	}
	return count;
}

export function returnOccurrencesIndexAdmin(array: any[], id: any): number {
	let count = -1;
	for (let i = 0; i < array.length; i++) {
		if (array[i].adminId === id) {
			count = i;
			break;
		}
	}
	return count;
}

export function addTotalValue(array: any[], value: any): number {
	let total: number = 0.0;
	for (let i = 0; i < array.length; i++) {
		if (array[i].product === value) {
			total += parseFloat(array[i].value.replace('$', '').replace(',', ''));
		}
	}
	return parseFloat(total.toFixed(2));
}

export function highest(givenArray: any[]) {
	let itemsMap: any = {};
	let maxValue = 0;
	let maxCount = 0;

	// 3
	for (let item of givenArray) {
		// 4
		if (itemsMap[item] == null) {
			itemsMap[item] = 1;
		} else {
			itemsMap[item]++;
		}

		//5
		if (itemsMap[item] > maxCount) {
			maxValue = item;
			maxCount = itemsMap[item];
		}
	}

	return {
		value: maxValue,
		count: maxCount,
	};
}

export function highestProduct(givenArray: any[]) {
	let itemsMap: any = {};
	let maxValue = 0;
	let maxCount = 0;

	// 3
	for (let item of givenArray) {
		// 4
		if (itemsMap[item.product] == null) {
			itemsMap[item.product] = 1;
		} else {
			itemsMap[item.product]++;
		}

		//5
		if (itemsMap[item.product] > maxCount) {
			maxValue = item.product;
			maxCount = itemsMap[item];
		}
	}

	return {
		value: maxValue,
		count: maxCount,
	};
}

export function getSalesRepMapFromArray(arr: any[]) {
	let arrRes: any = [];
	let checkArr: any = [];

	for (var i = 0; i < arr.length; i++) {
		var key = arr[i].salesPerson;

		if (checkArr.includes(key)) {
			for (let index = 0; index < arrRes.length; index++) {
				const element = arrRes[index];
				if (element.person == key) {
					let valArr = element.value;
					valArr.push(arr[i]);
					arrRes[index] = { person: key, value: valArr };
				}
			}
		} else {
			let valArr = [];
			valArr.push(arr[i]);
			arrRes.push({ person: key, value: valArr });
			checkArr.push(key);
		}
	}

	return arrRes;
}

export function getProductsRepMapFromArray(arr: any[]) {
	let arrRes: any = [];
	let checkArr: any = [];

	for (var i = 0; i < arr.length; i++) {
		if (arr[i].enquired.length > 0) {
			arr[i].enquired.forEach((element: any) => {
				var key = element.product;

				if (checkArr.includes(key)) {
					for (let index = 0; index < arrRes.length; index++) {
						const element = arrRes[index];
						if (element.product == key) {
							let valArr = element.value;
							valArr.push(arr[i]);
							arrRes[index] = { product: key, value: valArr };
						}
					}
				} else {
					let valArr = [];
					valArr.push(arr[i]);
					arrRes.push({ product: key, value: valArr });
					checkArr.push(key);
				}
			});
		} else {
			var key = arr[i].enquired[0].product.product;

			if (checkArr.includes(key)) {
				for (let index = 0; index < arrRes.length; index++) {
					const element = arrRes[index];
					if (element.product == key) {
						let valArr = element.value;
						valArr.push(arr[i]);
						arrRes[index] = { product: key, value: valArr };
					}
				}
			} else {
				let valArr = [];
				valArr.push(arr[i]);
				arrRes.push({ product: key, value: valArr });
				checkArr.push(key);
			}
		}
	}

	return arrRes;
}

export function searchStringInArrayOfObjects(
	members: any[],
	searchString: string
): any[] {
	// Iterate over the array of members.
	const matches = [];
	for (const member of members) {
		// Check if the search string is present in any of the member properties.
		for (const key in member) {
			let k: string = member[key];
			if (k.length > 70) {
				if (adminId === searchString) {
					if (!containsObject(member, matches)) {
						matches.push(member);
					}
				} else if (typeof k == 'string') {
					if (contains(k, searchString)) {
						if (!containsObject(member, matches)) {
							matches.push(member);
						}
					}
				}
			} else {
				if (k === searchString) {
					if (!containsObject(member, matches)) {
						matches.push(member);
					}
				} else if (typeof k == 'string') {
					if (contains(k, searchString)) {
						if (!containsObject(member, matches)) {
							matches.push(member);
						}
					}
				}
			}
		}
	}

	// Return the array of matches.
	return matches;
}

function contains(haystack: string, needle: string): boolean {
	return haystack.indexOf(needle) !== -1;
}

export function containsObject(obj: any, list: any[]) {
	var i;
	for (i = 0; i < list.length; i++) {
		if (list[i] === obj) {
			return true;
		}
	}

	return false;
}

export function searchStringInArray(
	members: any[],
	searchString: string
): any[] {
	// Iterate over the array of members.
	const matches = [];
	for (const member of members) {
		// Check if the search string is present in any of the member properties.
		for (const key in member) {
			let k: string = member[key];

			if (k === searchString) {
				if (!containsObject(member, matches)) {
					matches.push(member);
				}
			} else if (typeof k == 'string') {
				if (contains(k.toLowerCase(), searchString.toLowerCase())) {
					if (!containsObject(member, matches)) {
						matches.push(member);
					}
				}
			}
		}
	}

	// Return the array of matches.
	return matches;
}

export function returnOnlyUnique(arr: any[]) {
	return arr.filter(function (v, i, self) {
		// It returns the index of the first
		// instance of each value
		return i == self.indexOf(v);
	});
}

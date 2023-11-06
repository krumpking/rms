import { IOrder } from './orderTypes';

export type IPoints = {
	adminId: string;
	userId: string;
	id: string;
	dateString: string;
	date: Date;
	name: string;
	phone: string;
	order: IOrder;
	email: string;
	orderTotal: number;
	pointsTotal: number;
	used: boolean;
};

export type IPointsRate = {
	adminId: string;
	userId: string;
	id: string;
	dateString: string;
	date: Date;
	numberOfPoints: number;
	dollarAmount: number;
	rewardType: string;
};

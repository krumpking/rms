export type IWebsite = {
	id: string;
	websiteId: string;
	adminId: string;
	userId: string;
	websiteName: string;
	chosenWebsiteNo: number;
	src: string;
	date: Date;
	dateString: string;
};

export type IWebsiteOneInfo = {
	id: string;
	websiteName: string;
	adminId: string;
	userId: string;
	logo: any;
	serviceProviderName: string;
	headerTitle: string;
	headerText: string;
	headerImage: any;
	aboutUsImage: any;
	aboutUsTitle: string;
	aboutUsInfo: string;
	themeMainColor: string;
	themeSecondaryColor: string;
	reservation: boolean;
	contactUsImage: any;
	email: string;
	address: string;
	phone: string;
	date: Date;
	dateString: string;
	deliveryCost: number;
	mapLocation: any;
	daysOfWork: string[];
	radius: number;
	freeDeliveryAreas: string[];
	prepTime: number;
	socialMedialinks: string[];
};

export type IContact = {
	id: string;
	adminId: string;
	userId: string;
	name: string;
	phone: string;
	email: string;
	message: string;
};

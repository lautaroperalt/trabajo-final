export interface User {
    id: number,
    restaurantName: string,
    password: string,
    firstName: string,
    lastName: string,
    address: string,
    phoneNumber: string,
}

export interface NewUser {
    restaurantName: string;
    password: string;
    //estos son opcionales (nullable =true) según el schema
    firstName?: string;
    lastName?: string;
    address?: string;
    phoneNumber?: string;
}


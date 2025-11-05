export interface User {
    id: number,
    email: string,
    password: string,
    restaurant: string,
    address: string,
}

export type NewUser = Omit<User,"id">
//es equivalente a type NewUser = {
// name: string;
//  email: string;};


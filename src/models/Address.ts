import { User } from "./User";

export interface Address {
    id?: number;
    country: string;
    city: string;
    district: string;
    ward: string;
    addressDetail: string;
    addressType: string;
    user: User;
}
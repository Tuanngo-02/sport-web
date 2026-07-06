export interface User {
    id?: number,
    email: string,
    password: string,
    fullName?: string,
    gender?: string,
    dateOfBirth?: string,
    phone?: string,
    role: string,
    image: File | null
    userImage?: string | null;
    avatarUrl?: string | null;
    disabled?: boolean | string;
}
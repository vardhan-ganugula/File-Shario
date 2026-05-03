

export interface User{
    username: string;
    password: string;
    email: string;
}   

export interface LoginUser extends Omit<User, 'username'> {}

export interface ExtendedUser extends Omit<User, 'password'> {
    id: string;
    role: 'USER' | 'ADMIN';
    createdAt: Date;
    updatedAt: Date;   
    password?: string;
}

export interface FullUser extends User {
    id: string;
    role: 'USER' | 'ADMIN';
    createdAt: Date;
    updatedAt: Date;   
}

export interface JWTPayload {
    userId: string;
    userRole: 'USER' | 'ADMIN'; 
    userEmail: string;
}
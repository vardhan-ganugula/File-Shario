import db from "@/db/index.js";
import { type User, type ExtendedUser } from '@interfaces/auth.interface.js';
import { users } from "@/db/schema.js";
import bcryptjs from 'bcryptjs';
import { eq } from 'drizzle-orm';

export const createUser = async (userData: User) : Promise<ExtendedUser> => {
    try {
        const { username, password, email } = userData;
        const hashedPassword = await bcryptjs.hash(password, 10);
        const [newUser] = await db.insert(users).values({
            username,
            password: hashedPassword,
            email,
        }).returning({
            id: users.id,
            username: users.username,
            email: users.email,
            role: users.role,
            createdAt: users.createdAt,
            updatedAt: users.updatedAt,
        });
        if(!newUser) {
            throw new Error('User creation failed');
        }
        return newUser;
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};  

export const findUserByEmail = async (email: string) : Promise<ExtendedUser | null> => {
    try {
        const [user] = await db.select().from(users)
            .where(eq(users.email, email))
        return user ?? null;
    } catch (error) {
        console.error("Error finding user by email:", error);
        throw null;
    }
};

import {type Request, type Response} from "express";
import {type JWTPayload, type User, type ExtendedUser, type LoginUser} from '@interfaces/auth.interface.js';
import { generateToken } from "@/utils/auth.util.js";
import { createUser, findUserByEmail } from "@/services/auth.service.js";
import bcryptjs from 'bcryptjs';

export const signupUpUser = async (req : Request, res : Response) => {
    const body = req.body as User | undefined;
    if (!body) {
        return res.status(400).json({ message: 'Request body is required' });
    }
    let {username, password, email} = body;
    if(!username || !password || !email) {
        return res.status(400).json({message: 'Username, password and email are required'});
    }
    let user : ExtendedUser;
    try {
        const user = await findUserByEmail(email);
        if(user) {
            return res.status(400).json({message: 'User with this email already exists'});
        }
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }

    try {
        user = await createUser(body);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }

    const payLoad : JWTPayload = {
        userId: user.id,
        userRole: user.role,
        userEmail: user.email,
    } 

    const token = generateToken(payLoad);
    res.json({
        message: 'User signed up successfully',
        user,
        token
    });
}


export const loginUser = async (req : Request, res : Response) => {
    const body = req.body as LoginUser | undefined;
    if(!body) {
        return res.status(400).json({message: 'Request body is required'});
    }
    let user : ExtendedUser | null;

    try {
        user = await findUserByEmail(body.email);
        if(!user) {
            return res.status(400).json({message: 'Invalid email or password'});
        }
    } catch (error) {
        console.error("Error finding user by email:", error);
        return res.status(500).json({ message: 'Internal server error' });
    }

    try {
        const isMatch : boolean = await bcryptjs.compare(body.password, user.password as string);
        if(!isMatch) {
            return res.status(400).json({message: 'Invalid email or password'});
        }
    } catch (error) {
        console.error("Error comparing passwords:", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
    const payLoad : JWTPayload = {
        userId: user.id,
        userRole: user.role,
        userEmail: user.email,
    }

    const token = generateToken(payLoad);
    const { password, ...userWithoutPassword } = user;
    res.json({
        message: 'Login successful',
        user: userWithoutPassword,
        token
    });
}
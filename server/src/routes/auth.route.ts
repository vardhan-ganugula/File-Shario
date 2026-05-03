import {type Request, type Response, Router} from 'express';
import {signupUpUser, loginUser} from '@controllers/auth.controller.js';

const authRouter = Router();


authRouter.post('/register', signupUpUser);
authRouter.post('/login', loginUser);

export default authRouter;
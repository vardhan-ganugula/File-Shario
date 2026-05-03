import express, {type Request, type Response} from 'express';
import { PORT } from '@utils/config.util.js';

const app = express();
// Middleware to parse JSON bodies
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// Importing routes
import authRouter from '@routes/auth.route.js'; 

// Use the auth routes
app.use('/api/auth', authRouter);




app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
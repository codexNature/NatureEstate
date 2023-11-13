import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';

mongoose.connect(process.env.MONGO)
.then(()=> {
    console.log("Conected to DB");
    }).catch((err) => {
        console.log(err)
    })

const __dirname = path.resolve();

const app = express();

app.use(express.json());

app.use(cookieParser());



app.listen(3000, ()=> {
    console.log('Server running running runnning running on port 3k!!!');
});

app.use('/Backend/user', userRouter);
app.use('/Backend/auth', authRouter);
app.use('/Backend/listing', listingRouter);


app.use(express.static(path.join(__dirname, "client", "dist")));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});



//passed to auth.controller with "next" to handle errors
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});

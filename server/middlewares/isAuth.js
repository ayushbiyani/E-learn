import jwt from 'jsonwebtoken'
import { user } from '../models/user.js';

export const isAuth = async(req,res,next) =>{
    try {
        const token = req.headers.token;

        if (!token){
            return res.status(403).json({
                message: "Please Login",
            });
        }

        const decodedData = jwt.verify(token, process.env.Jwt_sec);

        req.user1 = await user.findById(decodedData._id);

        next();
    } catch (error) {
        res.status(500).json({
            message:"Login First",
        });
    }
};

export const isAdmin = (req,res,next) =>{
    try {
        if(req.user1.role !== "admin"){
            return res.status(403).json({
                message: "You are not admin",
            });
        }
        next() ;
    } catch (error) {
        res.status(500).json({
            message:error.message,
        });
    }
};
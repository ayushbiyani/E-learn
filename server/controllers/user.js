import { user } from "../models/user.js";
import bcyrpt from 'bcrypt';
import jwt from 'jsonwebtoken'
import sendMail from "../middlewares/sendMail.js";
import TryCatch from "../middlewares/TryCatch.js";

export const register = TryCatch(async(req,res)=>{
    const { email, name, password } = req.body ;

        let user1 = await user.findOne({ email });

        if (user1)
            return res.status(400).json({
                message: "  User Already Exists",
            });

        const hashPassword = await bcyrpt.hash(password, 10)

        user1 = {
            name,
            email,
            password: hashPassword
        }

        const otp = Math.floor(Math.random()*1000000);

        const activationToken = jwt.sign({
            user1,
            otp,
        }, process.env.Activation_Secret,{
            expiresIn: "5m",
        });

        const data = {
            name,
            otp,
        };

        await sendMail(
            email,
            "E learning",
            data
        );

        res.status(200).json({
            message: "Otp send to your mail",
            activationToken,
        });
})

export const verifyUser = TryCatch(async(req,res)=>{
    const {otp, activationToken} = req.body

    const verify = jwt.verify(activationToken, process.env.Activation_Secret)

    if(!verify) return res.status(400).json({
        message: "Otp Expired",
    });

    if (verify.otp !== otp) return res.status(400).json({
        message: "Otp Wrong",
    });

    await user.create({
        name: verify.user1.name,
        email: verify.user1.email,
        password: verify.user1.password,
    })

    res.json({
        message: "User Registered",
    })
})

export const loginUser = TryCatch(async(req,res) =>{
    const {email, password} = req.body

    const user1 = await user.findOne({ email });

    if (!user1){
        return res.status(400).json({
            message: "No User with this email",
        });
    }
    const mathpassword = await bcyrpt.compare(password, user1.password);

    if (!mathpassword){
        return res.status(400).json({
            message: "Wrong Password",
        });
    }

    const token = await jwt.sign({_id: user1._id}, process.env.Jwt_sec, {
        expiresIn: "15d",
    });

    res.json({
        message: `Welcome back ${user1.name}`,
        token,
        user1,
    })
});

export const myProfile = TryCatch(async(req,res)=>{
    const user1 = await user.findById(req.user1._id);

    res.json({ user1 });
});
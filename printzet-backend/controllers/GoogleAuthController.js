import User from "../models/User.js";
import { oauth2Client } from "../utils/googleConfig.js";
import axios from "axios";
import jwt from "jsonwebtoken";

const googleSignUp = async (req, res) => {
    try {
        const {code} = req.query;
        const googleRes = await oauth2Client.getToken(code);
        //console.log(oauth2Client.redirectUri);
        oauth2Client.setCredentials(googleRes.tokens);
        const userRes = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`)

        const { email, name } = userRes.data;
        //console.log(userRes);
        let user = await User.findOne({ email });
        

        if (!user) {
            user = new User({
                fullName:name,
                email,
            });
            await user.save({validateBeforeSave: false});
        }
        const { _id } = user;
        const token = jwt.sign({ _id, email },
            process.env.JWT_SECRET, {
            expiresIn:"7d",
        });
        return res.status(200).json({
            message: 'success',
            token,
            user,
        });
    } catch (err) {
        console.error("Google Sign-Up Error:", err);
        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message,
            user: null,  // ensure key exists
            token: null
        });
    }   
}

export {
    googleSignUp
}
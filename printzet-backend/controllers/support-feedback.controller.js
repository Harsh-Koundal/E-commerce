import { Support } from "../models/support.model.js";
import { Feedback } from "../models/feedback.model.js";

const support= async(req,res)=>{
    try {
        const { message } = req.body;
        const user = req.user
        const { fullName, email } = user;

        if (!message) {
            return res.status(400).json({ success: false, message: "Message is required." });
        }

        const entry = new Support({ fullName, email, message });
        await entry.save();
        res.status(200).json({ success: true, data:entry, message: "Support message received." });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

const feedback = async(req,res)=>{
    try {
        const { rating, comment } = req.body;
        const user = req.user;
        const userId = user._id;

        if (!rating || !comment) {
            return res.status(400).json({ success: false, message: "Rating and comment are required." });
        }

        const entry = new Feedback({ rating, comment, userId });
        await entry.save();
        res.status(200).json({ success: true, data:entry, message: "Feedback submitted" });
    } catch (err) {
        res.status(500).json({ success: false, err });
    }
}

export {
    feedback,
    support
}

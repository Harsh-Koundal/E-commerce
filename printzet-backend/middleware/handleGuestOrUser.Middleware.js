import Cart from "../models/Cart.js";
import { v4 as uuidv4 } from "uuid";
import { calculateTotalCost } from "../controllers/cartController.js";

const handleGuestOrUser = async (req, res, next) => {
  // If user is authenticated, req.user will be set by the protect middleware
  if (req.user) {
    req.userId = req.user._id;
    
    // Check if there's a guestId in the request and we need to merge carts
    const guestId = req.body.guestId || req.query.guestId || req.cookies?.guestId;
    if (guestId) {
      try {
        // Find guest cart
        const guestCart = await Cart.findOne({ guestId });
        
        if (guestCart && guestCart.items.length > 0) {
          // Find user cart or create one
          let userCart = await Cart.findOne({ userId: req.userId });
          
          if (!userCart) {
            userCart = new Cart({
              userId: req.userId,
              items: [],
              totalCost: 0
            });
          }
          
          // Merge guest cart items into user cart
          userCart.items = [...userCart.items, ...guestCart.items];
          userCart.totalCost = calculateTotalCost(userCart.items);
          userCart.lastUpdated = Date.now();
          
          // Save the updated user cart
          await userCart.save();
          
          // Delete the guest cart
          await Cart.deleteOne({ guestId });
          
          // Clear the guestId cookie after merging
          res.clearCookie('guestId');
        }
      } catch (error) {
        console.error("Error merging carts:", error);
      }
    }
  } else {
    // For guest users, get guestId from request or generate a new one
    let guestId = req.body.guestId || req.query.guestId || req.cookies?.guestId;
    
    if (!guestId) {
      // Generate a new guestId
      guestId = uuidv4();
      
      // Set the guestId as a cookie that expires in 30 days
      res.cookie('guestId', guestId, {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
    }
    
    req.guestId = guestId;
  }
  
  next();
};

export { handleGuestOrUser };
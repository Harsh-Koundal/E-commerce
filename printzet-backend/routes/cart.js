import express from "express";
import { addToCart, removeCartItem, updateCartItem, viewCart } from "../controllers/cartController.js";
import { handleGuestOrUser } from "../middleware/handleGuestOrUser.Middleware.js";

const router = express.Router();

// POST /cart/add - Add item to cart
router.post("/add",handleGuestOrUser, addToCart);

// GET /cart/view - View cart contents
router.get("/view", handleGuestOrUser, viewCart);

// PUT /cart/update - Update cart item
router.put("/update", handleGuestOrUser, updateCartItem);

// DELETE /cart/remove - Remove item from cart
router.delete("/remove", handleGuestOrUser, removeCartItem);

export default router;

import Cart from "../models/Cart.js";

// -------------------- Helpers --------------------
const getCart = async (userId, guestId) => {
  let cart;

  if (userId) {
    cart = await Cart.findOne({ userId });
  } else if (guestId) {
    cart = await Cart.findOne({ guestId });
  }

  if (!cart) {
    cart = new Cart({
      ...(userId ? { userId } : {}),
      ...(guestId ? { guestId } : {}),
      items: [],
      totalCost: 0,
    });
    await cart.save();
  }

  return cart;
};

const calculateItemCost = (item) => {
  if (item.categoryType === "document") {
    return item.numCopies * item.totalPages * item.unitCost;
  } else if (item.categoryType === "accessory") {
    return item.unitCost; // extend with qty if needed
  }
  return 0;
};

const calculateTotalCost = (items) => {
  return items.reduce((total, item) => total + calculateItemCost(item), 0);
};

// -------------------- Add to Cart --------------------
const addToCart = async (req, res) => {
  try {
    const {
      categoryType,
      categoryId,
      name,
      description,
      image,
      unitCost,

      // Document
      numCopies,
      paperType,
      binding,
      lamination,
      printedSides,
      totalPages,
      files,

      // Accessory
      size,
      color,
      customizations,
    } = req.body;

    if (!categoryType || !categoryId || !unitCost || !name) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const cart = await getCart(req.userId, req.guestId);

    let newItem = {
      categoryType,
      categoryId,
      name,
      description,
      image,
      unitCost,
      addedAt: Date.now(),
    };

    if (categoryType === "document") {
      if (!numCopies || !totalPages) {
        return res.status(400).json({ message: "Missing document fields" });
      }
      newItem = {
        ...newItem,
        numCopies,
        paperType,
        binding,
        lamination,
        printedSides,
        totalPages,
        files,
      };
    } else if (categoryType === "accessory") {
      if (!size || !color) {
        return res.status(400).json({ message: "Missing accessory fields" });
      }
      newItem = {
        ...newItem,
        size,
        color,
        customizations,
      };
    }

    newItem.itemCost = calculateItemCost(newItem);

    cart.items.push(newItem);
    cart.totalCost = calculateTotalCost(cart.items);
    cart.lastUpdated = Date.now();

    await cart.save();

    res.status(201).json({ message: "Item added to cart successfully", cart });
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res
      .status(500)
      .json({ message: "Failed to add item to cart", error: error.message });
  }
};

// -------------------- View Cart --------------------
const viewCart = async (req, res) => {
  try {
    const cart = await getCart(req.userId, req.guestId);

    await cart.populate({
      path: "items.categoryId",
      select: "name description image",
    });
        const formattedItems = cart.items.map((item) => {
      const common = {
        id: item._id,
        name: item.name,
        description: item.description,
        image: item.image,
        unitCost: item.unitCost,
        totalCost: item.itemCost,
        categoryType: item.categoryType,
      };

      if (item.categoryType === "document") {
        return {
          ...common,
          numCopies: item.numCopies,
          paperType: item.paperType,
          binding: item.binding,
          lamination: item.lamination,
          printedSides: item.printedSides,
          totalPages: item.totalPages,
          files:item.files,
        };
      } else if (item.categoryType === "accessory") {
        return {
          ...common,
          size: item.size,
          color: item.color,
          customizations: item.customizations,
        };
      }
      return common;
    });

    res.status(200).json({
      cart: { ...cart.toObject(), items: formattedItems },
    });
  } catch (error) {
    console.error("Error viewing cart:", error);
    res
      .status(500)
      .json({ message: "Failed to retrieve cart", error: error.message });
  }
};

// -------------------- Update Cart Item --------------------
const updateCartItem = async (req, res) => {
  try {
    const { itemId, updates } = req.body;

    if (!itemId || !updates) {
      return res.status(400).json({ message: "Item ID and updates are required" });
    }

    const cart = await getCart(req.userId, req.guestId);
    const itemIndex = cart.items.findIndex(
      (item) => item._id.toString() === itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // Apply updates
    Object.assign(cart.items[itemIndex], updates);

    // Recalculate cost
    cart.items[itemIndex].itemCost = calculateItemCost(cart.items[itemIndex]);
    cart.totalCost = calculateTotalCost(cart.items);
    cart.lastUpdated = Date.now();

    await cart.save();

    res
      .status(200)
      .json({ message: "Cart item updated successfully", cart });
  } catch (error) {
    console.error("Error updating cart item:", error);
    res
      .status(500)
      .json({ message: "Failed to update cart item", error: error.message });
  }
};

// -------------------- Remove Cart Item --------------------
const removeCartItem = async (req, res) => {
  try {
    const { itemId } = req.body;

    if (!itemId) {
      return res.status(400).json({ message: "Item ID is required" });
    }

    const cart = await getCart(req.userId, req.guestId);

    const itemIndex = cart.items.findIndex(
      (item) => item._id.toString() === itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    cart.items.splice(itemIndex, 1);
    cart.totalCost = calculateTotalCost(cart.items);
    cart.lastUpdated = Date.now();

    await cart.save();

    res
      .status(200)
      .json({ message: "Item removed from cart successfully", cart });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res
      .status(500)
      .json({ message: "Failed to remove item from cart", error: error.message });
  }
};

export {
  getCart,
  calculateTotalCost,
  addToCart,
  viewCart,
  updateCartItem,
  removeCartItem,
};
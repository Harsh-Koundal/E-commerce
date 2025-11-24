import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import userData from "./routes/user.js";
import authRoutes from "./routes/auth.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import accessoryRoutes from "./routes/accessoryRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import accessoryorderRoutes from "./routes/accessoryorderRoutes.js";
import createAdminUser from "./utils/createAdminUser.js";
import adminRoutes from "./routes/adminRoutes.js";
import accessoryOrdersRoutes from "./routes/accessoryorderRoutes.js";
import vendorAuthRoutes from "./routes/vendorAuth.js";
import vendorRoutes from "./routes/vendor.js";
import vendorServiceRoutes from "./routes/vendorServiceRoutes.js";
import phonepay from "./routes/phonepayRoute.js";
import cartRoutes from "./routes/cart.js";
import session from "express-session";
import blogRoutes from "./routes/blogRoutes.js";
import careerRoutes from "./routes/careerRoutes.js";
import supportFeedbackRouter from "./routes/support-feedbackRoutes.js";
import savedDesignRoutes from "./routes/savedDesignRoutes.js";
import commentingRoutes from "./routes/commentingRoutes.js";
import issueRoutes from "./routes/issueRoutes.js";
import operationRoutes from "./routes/operationRoutes.js";
import policiesRoutes from "./routes/policiesRoutes.js";

import supportRoutes from "./routes/support.js";

import documentRouter from "./routes/documentRoutes.js";

import googleRouter from "./routes/googleAuthRoutes.js";

import swaggerUi from "swagger-ui-express";
import { readFile } from "fs/promises";

import loyaltyRoutes from "./routes/loyaltyRoutes.js";
import referralRoutes from "./routes/referral.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";
import priceRoutes from "./routes/priceRoutes.js";
import estimateRoutes from "./routes/estimateRoutes.js";

import loyaltyAdminRoutes from "./routes/loyaltyAdminRoutes.js";
import adminOrderRoutes from "./routes/adminOrderRoutes.js";
import orderActionsRoutes from "./routes/orderActionRoutes.js";
import vendorRevenueRoutes from "./routes/vendorRevenueRoutes.js";
import deliveryRoutes from "./routes/deliveryRoutes.js";
import deliveryAgentRoutes from "./routes/deliveryAgentRoutes.js";
dotenv.config();
const app = express();

// CORS
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "https://printzet.com",
        "https://www.printzet.com",
        "http://localhost:5173",
        "http://localhost:3020",
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],  // ✅ add this
  })
);
//app.use(cors({ origin: true, credentials: true })); // univerlsally allow all origins for development

if (process.env.NODE_ENV !== "production") {
  let swaggerDocument;
  try {
    swaggerDocument = JSON.parse(
      await readFile("./swagger-output.json", "utf8")
    );
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    console.log("Swagger UI running at /api-docs");
  } catch (err) {
    console.error("Swagger setup error:", err.message);
  }
}

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "phonepe-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 1000 * 60 * 60, // 1 hour
    },
  })
);

// Routes
app.use("/api/auth", userRoutes, authRoutes, userData, googleRouter);
app.use("/api/vendor/auth", vendorAuthRoutes); // Authentication routes
app.use("/api/vendor", vendorRoutes); // Main vendor routes
app.use("/api/vendor/services", vendorServiceRoutes); // Service management routes
app.use("/api/categories", categoryRoutes);
app.use("/api/accessorycategories", accessoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/accessoryorders", accessoryorderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/accessory-orders", accessoryOrdersRoutes);
app.use("/api/phonepay", phonepay);
app.use("/api/blogs", blogRoutes);
app.use("/api/careers", careerRoutes);
app.use("/api/support", supportFeedbackRouter);
app.use("/api/feedback", supportFeedbackRouter);

app.use("/api/cart", cartRoutes);
app.use("/api/saved-designs", savedDesignRoutes);

app.use("/api/document", documentRouter);

app.use("/api/support", supportRoutes);
app.use("/api/user", loyaltyRoutes);
app.use("/api/referral", referralRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api", commentingRoutes);
app.use("/api/issue", issueRoutes);
app.use("/api/operation", operationRoutes);
app.use("/api/policies", policiesRoutes);

app.use("/api/price", priceRoutes);
app.use("/api/delivery", estimateRoutes);
app.use("/api/loyalty", loyaltyAdminRoutes);
app.use("/api/admin/orders", adminOrderRoutes);
app.use("/api/orders/actions", orderActionsRoutes);

app.use("/api/delivery", deliveryRoutes);
app.use("/api/agent", deliveryAgentRoutes);
// MongoDB Connection
mongoose
  .connect(process.env.DB_URI)
  .then(async () => {
    console.log("MongoDB Connected");
    await createAdminUser(); // Create the admin user if not exists
  })
  .catch((err) => console.error("MongoDB Error:", err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

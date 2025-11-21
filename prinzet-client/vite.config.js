import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import sitemap from 'vite-plugin-sitemap';

export default defineConfig({
  plugins: [
    react(),
    sitemap({
      hostname: "https://www.printzet.com", 
       generateRobotsTxt: false,
      outDir: "dist",
      dynamicRoutes: [
        "/", 
        "/about",
        "/contact",
        "/login",
        "/signup",
        "/forgot-password",
        "/reset-password/:token",
        "/verify-email/:token",
        "/email-verified",
        "/email-verification-failed",
        "/category/:categoryId",
        "/accessory-category-details",
        "/profile",
        "/orders",
        "/order-page/:categoryId",
        "/order-page/accessory-printing",
        "/checkout",
        "/accessory-checkout",
        "/admin/dashboard",
        "/admin/document-orders",
        "/admin/accessory-orders",
        "/admin/users",
        "/vendor-login",
        "/vendor-signup",
        "/vendor/dashboard",
        "/faqs",
        "/blog",
        "/policies",
        "/price-calculator",
      ],
      changefreq: "weekly",
      priority: 0.7,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});

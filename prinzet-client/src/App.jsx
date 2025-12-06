import { Routes, Route, Navigate, useLocation, replace } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About-Us";
import Contact from "./pages/Contact-us";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import CategoryDetails from "./pages/CategoryDetails";
import Profile from "./pages/Profile";
import OrderHistory from "./pages/OrderHistory";
import OrderPage from "./pages/OrderPage";
import CheckoutPage from "./pages/CheckoutPage";
import AdminDashboard from "./pages/AdminDashboard";
import FAQs from "./pages/FAQ";
import BlogPage from "./pages/BlogPage";
import Policies from "./pages/Policies";
import PriceCalculator from "./pages/PriceCalc";
import AccessoryCategoryDetails from "./pages/AccessoryCategoryDetails";
import AccessoryOrderPage from "./pages/AccessoryOrderPage";
import AccessoryCheckoutPage from "./pages/AccessoryCheckoutPage";
import AdminDocumentDashboard from "./pages/AdminDocumentDashboard";
import AdminAccessoryDasboard from "./pages/AdminAccessoryDashboard";
import AdminUserDashboard from "./pages/AdminUserDashboard";
import EmailVerifiedPage from "./pages/EmailVerifiedPage";
import VerifyEmail from "./pages/VerifyEmail";
import EmailVerificationFailedPage from "./pages/EmailVerificationFailedPage";
import { useAuth } from "./context/AuthContext";
import VendorLogin from "./pages/VendorLogin";
import VendorSignup from "./pages/VendorSignup";
import PrivateVendorRoute from "./components/PrivateVendorRoute";
import NotFoundPage from "./components/NotFoundPage";
import PaymentStatus from "./pages/PaymentStatus";
import AdminVendorDashboard from "./pages/AdminVendorDashboard";
import TrackOrder from "./pages/TrackOrder";
import CartPage from "./pages/CartPage";
import VendorResetPassword from "./pages/VendorResetPassword";
import VendorForgotPassword from "./pages/VendorForgotPassword";
import PreviewPage from "./pages/PreviewPage";
import Careers from "./pages/Careers";
import SingleBlog from "./pages/SingleBlog";
import SupportPage from "./pages/CustomerSupport";
import UserDashboard from "./pages/UserDashboard";

import LandingPage from "./pages/LandingPage";

import { GoogleOAuthProvider } from "@react-oauth/google";
import Header from "./components/Landing-page/Header";
import DocumentPrinting from "./pages/Document-printing";
import ContactCards from "./pages/ContactCards";
import StampInks from "./pages/StampInks";
import Stationery from "./pages/Stationery";
import PosterSignsMousepads from "./pages/Posters";
import LabelStickersPackaging from "./pages/Packaging";
import MugsAlbumGift from "./pages/Acessories";
import ClothingCapBag from "./pages/Clothing";
import CustomDrinkware from "./pages/CustomDrinkware";
import Infra3dUpcoming from "./pages/Infra3D";

import AdminAnalytics from "./pages/AdminAnalyticsDashboard";

import ScrollToTop from "./lib/ScrollToTop";
import VendorDashboard from "./pages/VendorDashboard";
import AddProductPageForVendor from "./pages/AddProductPageForVendor";
import EditProductPageForVendor from "./pages/EditProductPageForVendor";
import PaymentsPage from "./components/Admin-Dashboard/PaymentPage";
import ReportsPage from "./components/Admin-Dashboard/ReportPage";
import TransactionsPage from "./components/Admin-Dashboard/TransactionPage";
import EditBlog from "./components/Admin-Dashboard/EditBlog";
import InvoiceSummary from "./components/Orders/Confirmations";


// Custom Protected Route for Admin and Authorized Vendors
const AdminProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user?.isAdmin) {
    return children;
  }

  return <Navigate to="/" />;
};

// Custom Protected Route for Logged-in Users (non-vendor)
const UserProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  const location = useLocation();
  const hideFooter = ["/admin/dashboard"];
  const shouldHideFooter = hideFooter.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <>
      {/* {!hideLayout && <Navbar />} */}
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route
          path="/verify-email/:token"
          element={<VerifyEmail type="user" />}
        />
        <Route
          path="/vendor/verify-email/:token"
          element={<VerifyEmail type="vendor" />}
        />
        <Route path="/email-verified" element={<EmailVerifiedPage />} />
        <Route
          path="/email-verification-failed"
          element={<EmailVerificationFailedPage />}
        />
        <Route path="/category/:categoryId" element={<CategoryDetails />} />
        <Route path="/document-printing" element={<DocumentPrinting />} />
        <Route path="/contact-cards" element={<ContactCards />} />
        <Route path="/stamp-inks" element={<StampInks />} />
        <Route path="/stationery" element={<Stationery />} />
        <Route path="/posters" element={<PosterSignsMousepads />} />
        <Route path="/packaging" element={<LabelStickersPackaging />} />
        <Route path="/acessories" element={<MugsAlbumGift />} />
        <Route path="/clothing" element={<ClothingCapBag />} />
        <Route path="/drinkware" element={<CustomDrinkware />} />
        <Route path="/3D-infra" element={<Infra3dUpcoming />} />
        <Route
          path="/accessory-category-details"
          element={<AccessoryCategoryDetails />}
        />
        <Route
          path="/profile"
          element={
            <UserProtectedRoute>
              <Profile />
            </UserProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <UserProtectedRoute>
              <OrderHistory />
            </UserProtectedRoute>
          }
        />
        <Route
          path="/user/dashboard"
          element={

            <UserDashboard />

          }
        />
        <Route path="/order-page/:categoryId" element={<OrderPage />} />
        <Route
          path="/order-page/accessory-printing"
          element={
            //<UserProtectedRoute>
            <AccessoryOrderPage />
            //</UserProtectedRoute>
          }
        />
        <Route
          path="/preview-document"
          element={
            <UserProtectedRoute>
              <PreviewPage />
            </UserProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <UserProtectedRoute>
              <CheckoutPage />
            </UserProtectedRoute>
          }
        />
        <Route path="/confirm-order" element={
          <InvoiceSummary />} />
        <Route
          path="/accessory-checkout"
          element={
            <UserProtectedRoute>
              <AccessoryCheckoutPage />
            </UserProtectedRoute>
          }
        />
        <Route path="/payment-status" element={<PaymentStatus />} />
        <Route path="/track-order/:orderId" element={<TrackOrder />} />
        <Route
          path="/dashboard"
          element={
            <UserProtectedRoute>
              <UserDashboard />
            </UserProtectedRoute>
          }
        />
        <Route path="/careers" element={<Careers />} />
        <Route path="/cart" element={<CartPage />} />

        {/* Protected Admin Routes (Accessible by isAdmin users and isVendor: true vendors) */}
        <Route
          path="/admin/dashboard/:section/:id?"
          element={<AdminDashboard />}
          replace={'/vendor/dashboard/overview'}
        />
        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />
        <Route
          path="/admin/finance/payments"
          element={<PaymentsPage />}
        />
        <Route
          path="/admin/finance/reports"
          element={<ReportsPage />}
        />
        <Route
          path="/admin/finance/transactions"
          element={<TransactionsPage />}
        />
        <Route
          path="/admin/document-orders"
          element={
            <AdminProtectedRoute>
              <AdminDocumentDashboard />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/accessory-orders"
          element={
            <AdminProtectedRoute>
              <AdminAccessoryDasboard />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminProtectedRoute>
              <AdminUserDashboard />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/vendors"
          element={
            <AdminProtectedRoute>
              <AdminVendorDashboard />
            </AdminProtectedRoute>
          }
        />
        <Route path="/vendor-login" element={<VendorLogin />} />
        <Route path="/vendor-signup" element={<VendorSignup />} />
        <Route
          path="/vendor-forgot-password"
          element={<VendorForgotPassword />}
        />
        <Route
          path="/vendor/reset-password/:token"
          element={<VendorResetPassword />}
        />
        <Route
          path="/vendor/dashboard"
          element={
            <VendorDashboard />
          }
          replace={'/vendor/dashboard/overview'}
        />
        <Route
          path="/vendor/dashboard/add-product"
          element={
            <PrivateVendorRoute>
              <AddProductPageForVendor />
            </PrivateVendorRoute>
          }
          replace={'/vendor/dashboard/overview'}
        />
        <Route
          path="/vendor/dashboard/edit-product"
          element={
            <PrivateVendorRoute>
              <EditProductPageForVendor />
            </PrivateVendorRoute>
          }
          replace={'/vendor/dashboard/overview'}
        />
        <Route
          path="/vendor/dashboard/:section"
          element={
            <PrivateVendorRoute>
              <VendorDashboard />
            </PrivateVendorRoute>
          }
        />
        <Route path="/faqs" element={<FAQs />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:id" element={<SingleBlog />} />
        <Route path="/policies" element={<Policies />} />
        <Route path="/price-calculator" element={<PriceCalculator />} />
        <Route path="/career" element={<Careers />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      {!shouldHideFooter&&<Footer />}
    </>
  );
}

export default App;

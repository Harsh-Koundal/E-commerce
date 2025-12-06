import React from "react";
import { ArrowLeft, Edit2, CheckCircle, Loader2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function InvoiceSummary() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const orderId = state?.orderId;
  const order = state?.order;
  const customer = state?.customer;
  const paymentUrl = state?.paymentUrl;

  if (!order || !customer) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Invalid order data. Please try again.
      </div>
    );
  }

  // CALCULATIONS
  const subtotal = Number(order.estimatedCost);
  const discountAmount = 0; // if you add discounts later
  const shippingCharge = 0; // if your printing does not include shipping
  const totalAmount = subtotal + shippingCharge - discountAmount;

  const handleEdit = () => {
    navigate("/checkout", { state: { order } });
  };

  const handleConfirm = async () => {
    if (paymentUrl) {
      window.location.href = paymentUrl;
    } else {
      toast.error("Unable to start payment");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handleEdit}
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Edit
            </button>

            <div className="flex items-center text-green-600">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span className="font-semibold">Order Ready</span>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-2">Invoice Summary</h1>
        </div>

        <div className="grid md:grid-cols-3 gap-6">

          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Product Overview
              </h2>

              <div className="space-y-3">
                <p><b>Total Pages:</b> {order.totalPages}</p>
                <p><b>Copies:</b> {order.numCopies}</p>
                <p><b>Color:</b> {order.colorType}</p>
                <p><b>Paper Type:</b> {order.paperType}</p>
                <p><b>Printed Sides:</b> {order.printedSides}</p>
                <p><b>Binding:</b> {order.binding}</p>
                <p><b>Lamination:</b> {order.lamination}</p>

                <div>
                  <b>Files:</b>
                  <ul className="list-disc pl-4">
                    {order.files.map((file, index) => (
                      <li key={index}>{file.name}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Shipping Address
              </h2>
              <p>{customer.name}</p>
              <p>{customer.email}</p>
              <p>{customer.phone}</p>
              <p>{customer.address}</p>
              <p>{customer.city}, {customer.state} - {customer.pincode}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-4">Price Summary</h2>

            <div className="space-y-2">
              <p><b>Subtotal:</b> ₹{subtotal}</p>
              <p><b>Total:</b> ₹{totalAmount}</p>
            </div>

            <button
              onClick={handleConfirm}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg"
            >
              Confirm & Pay
            </button>

            <button
              onClick={handleEdit}
              className="w-full mt-3 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg"
            >
              Edit Order
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

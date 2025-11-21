const Policies = () => {
    return (
      <div className="bg-gray-50 py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">Our Policies</h2>
          <p className="text-gray-600 text-lg">Understand our terms, privacy policies, and refund policies.</p>
        </div>
  
        <div className="max-w-3xl mx-auto mt-10 bg-white p-6 rounded-lg shadow-lg border border-gray-300">
          <h3 className="text-2xl font-semibold text-gray-900">Privacy Policy</h3>
          <p className="text-gray-700 mt-2">
            We prioritize your privacy. Your personal information is securely stored and never shared without consent.
          </p>
  
          <h3 className="text-2xl font-semibold text-gray-900 mt-6">Terms of Service</h3>
          <p className="text-gray-700 mt-2">
            By using our services, you agree to our terms and conditions. Ensure you read and understand them before making a purchase.
          </p>
  
          <h3 className="text-2xl font-semibold text-gray-900 mt-6">Refund & Cancellation Policy</h3>
          <p className="text-gray-700 mt-2">
            Orders can be canceled within 24 hours of placement. Refunds are processed within 5-7 business days for eligible cases.
          </p>
        </div>
      </div>
    );
  };
  
  export default Policies;
  
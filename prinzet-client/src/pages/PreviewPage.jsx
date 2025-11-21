import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const PreviewPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const orderDetails = state?.orderDetails;
  const [printOption, setPrintOption] = useState("black-white");

  if (!orderDetails || !orderDetails.files?.length) {
    return (
      <div className="p-6 text-center text-red-600">
        No documents to preview. Please upload again.
      </div>
    );
  }

  const handleContinue = () => {
    const updatedDetails = {
      ...orderDetails,
      printOption,
    };
    navigate("/checkout", { state: { orderDetails: updatedDetails } });
  };

  const isImage = (file) => file.type.startsWith("image/");

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 flex justify-center">
      <div className="w-full h-full max-w-4xl bg-white shadow-md rounded-lg p-4 space-y-6">
        {/* Header */}
        <h2 className="text-2xl font-bold text-center">
          📄 Document Preview & Print Options
        </h2>

        {/* Print Options */}
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">🖨️ Preview Print Option</h3>
          <div className="inline-flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="printOption"
                value="black-white"
                checked={printOption === "black-white"}
                onChange={() => setPrintOption("black-white")}
              />
              <span className="px-2 py-1 rounded bg-gray-200 text-sm">B/W</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="printOption"
                value="color"
                checked={printOption === "color"}
                onChange={() => setPrintOption("color")}
              />
              <span className="flex items-center gap-2 px-2 py-1 rounded bg-blue-100 text-sm">
                <span className="w-3 h-3 rounded-full bg-blue-500" />
                Color
              </span>
            </label>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="space-y-6">
          {orderDetails.files.map((file, idx) => {
            const fileUrl = URL.createObjectURL(file);
            const commonImageClasses = `w-full h-auto rounded max-h-[300px] object-contain ${
              printOption === "black-white" ? "filter grayscale" : ""
            }`;

            return (
              <div
                key={idx}
                className="border border-gray-200 p-4 rounded shadow-sm bg-gray-50"
              >
                <p className="font-medium mb-2">{file.name}</p>

                {isImage(file) ? (
                  <img
                    src={fileUrl}
                    alt={`preview-${idx}`}
                    className={commonImageClasses}
                  />
                ) : (
                  <iframe
                    src={fileUrl}
                    title={`preview-${idx}`}
                    className={`w-full min-h-[350px] rounded border ${
                      printOption === "black-white" ? "grayscale" : ""
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition-all"
        >
          Continue to Checkout
        </button>
      </div>
    </div>
  );
};

export default PreviewPage;

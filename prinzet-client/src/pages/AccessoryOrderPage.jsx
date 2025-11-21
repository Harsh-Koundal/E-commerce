import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate, useLocation } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import axios from "axios";
import BreadcrumbNavigation from "@/components/Breadcrumb-Navigation/BreadcrumbNavigation";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useCart } from "@/context/CartContext";
import { testValueType } from "framer-motion";

const AccessoryPrintingData = {
  "custom-polo-t-shirts": {
    material: ["Cotton", "Polyester", "Cotton Blend"],
    sizeOptions: ["S", "M", "L", "XL", "XXL"],
    colorOptions: ["Red", "Blue", "White", "Black", "Navy"],
    customizationOptions: {
      "Logo Placement": ["Left Chest", "Right Chest", "Back", "Sleeve"],
      "Text Input": true,
      "Embroidery": ["Yes", "No"],
      "Print Type": ["Screen Print", "DTG", "Vinyl"],
    },
    baseCost: 20,
    customizationCosts: {
      "Logo Placement": 5,
      "Text Input": 3,
      "Embroidery": 8,
      "Print Type": 6,
    },
    availableSizes: ["S", "M", "L"],
    availableColors: ["Red", "Blue"],
    additionalTextInputLabel: "Additional Text",
  },
  "office-shirts": {
    material: ["Cotton Blend", "Oxford Cloth", "Poplin"],
    sizeOptions: ["S", "M", "L", "XL"],
    colorOptions: ["White", "Light Blue", "Gray"],
    customizationOptions: {
      "Logo Embroidery": ["Yes", "No"],
      "Monogram": ["Yes", "No"],
    },
    baseCost: 25,
    customizationCosts: { "Logo Embroidery": 8, "Monogram": 5 },
    availableSizes: ["M", "L", "XL"],
    availableColors: ["White"],
    threadColorInputLabel: "Thread Color",
  },
  "custom-t-shirts": {
    material: ["Cotton", "Organic Cotton", "Performance Fabric"],
    sizeOptions: ["S", "M", "L", "XL", "XXL", "Youth Sizes"],
    colorOptions: ["Black", "White", "Gray", "Navy", "Gradient"],
    customizationOptions: {
      "Full Print": ["Yes", "No"],
      "Front Print": ["Yes", "No"],
      "Back Print": ["Yes", "No"],
      "Specialty Print": ["Glow-in-the-Dark", "Metallic", "None"],
    },
    baseCost: 18,
    customizationCosts: { "Full Print": 10, "Front Print": 5, "Back Print": 5, "Specialty Print": 7 },
    availableSizes: ["S", "M", "L", "XL", "XXL"],
    availableColors: ["Black", "White", "Gray"],
    printAreaSizeInputLabel: "Print Area Size",
  },
  "custom-stamps-ink": {
    material: ["Plastic", "Rubber", "Self-Inking"],
    customizationOptions: {
      "Text Input": true,
      "Logo Upload": ["Yes", "No"],
      "Ink Color": ["Black", "Red", "Blue", "Green"],
    },
    baseCost: 15,
    customizationCosts: { "Logo Upload": 7 },
    stampSizeInputLabel: "Stamp Size",
  },
  "photo-gifts": {
    material: ["Mugs", "Frames", "Phone Cases"],
    customizationOptions: {
      "Photo Upload": ["Yes", "No"],
      "Text Input": true,
      "Photo Layout": ["Collage", "Single Photo"],
      "Filter": ["None", "Sepia", "Black & White"],
    },
    baseCost: 22,
    customizationCosts: { "Photo Upload": 6, "Text Input": 3 },
    captionInputLabel: "Caption",
  },
  "custom-caps": {
    material: ["Cotton", "Polyester", "Snapback", "Fitted", "Trucker"],
    colorOptions: ["Black", "White", "Red", "Blue", "Two-Tone"],
    customizationOptions: {
      "Embroidery": ["Yes", "No"],
      "Print": ["Yes", "No"],
      "Patch": ["Yes", "No"],
    },
    baseCost: 17,
    customizationCosts: { Embroidery: 8, Print: 5, Patch: 7 },
    availableColors: ["Black", "White", "Red"],
    threadColorInputLabel: "Thread Color",
  },
  "custom-drinkware": {
    material: ["Ceramic", "Stainless Steel", "Travel Mugs", "Water Bottles", "Tumblers"],
    customizationOptions: {
      "Photo Upload": ["Yes", "No"],
      "Text Input": true,
      "Engraving": ["Yes", "No"],
    },
    baseCost: 19,
    customizationCosts: { "Photo Upload": 6, "Text Input": 3, Engraving: 5 },
    engravingTextInputLabel: "Engraving Text",
  },
  "custom-bags": {
    material: ["Canvas", "Cotton", "Polyester", "Tote Bags", "Backpacks", "Drawstring Bags"],
    sizeOptions: ["Small", "Medium", "Large"],
    colorOptions: ["Natural", "Black", "Navy", "Trim Colors"],
    customizationOptions: {
      "Print": ["Yes", "No"],
      "Embroidery": ["Yes", "No"],
      "Pocket Prints": ["Yes", "No"],
      "Zipper Colors": ["Yes", "No"],
    },
    baseCost: 21,
    customizationCosts: { Print: 5, Embroidery: 7, "Pocket Prints": 6, "Zipper Colors": 4 },
    availableSizes: ["Small", "Medium"],
    availableColors: ["Natural", "Black"],
    handleLengthInputLabel: "Handle Length",
  },
};

const AccessoryOrderPage = () => {
  const [files, setFiles] = useState([]);
  const [numCopies, setNumCopies] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const subcategoryParam = searchParams.get("subcategory")?.toLowerCase() || "";
  const subcategoryData = AccessoryPrintingData[subcategoryParam];
  const [selectedMaterial, setSelectedMaterial] = useState(subcategoryData?.material?.[0] || "");
  const [selectedSize, setSelectedSize] = useState(subcategoryData?.sizeOptions?.[0] || "");
  const [selectedColor, setSelectedColor] = useState(subcategoryData?.colorOptions?.[0] || "");
  const [selectedCustomization, setSelectedCustomization] = useState({});
  const [additionalFields, setAdditionalFields] = useState({});
  const { addToCart } = useCart()
  useEffect(() => {
    setLoading(false);
  }, []);

  const onDrop = async (acceptedFiles) => {
    if (!subcategoryData) {
      const errorMessage = "Invalid subcategory selection!";
      console.error(errorMessage);
      setError(errorMessage);
      return;
    }
    setError(null);
    setUploading(true);

    const formData = new FormData();
    acceptedFiles.forEach((file) => formData.append("files", file));

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/accessory-orders/upload-files`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );

      setFiles((prev) => [...prev, ...acceptedFiles]);
    } catch (error) {
      const message = error.response?.data?.data?.message || "An unexpected error occurred";
      console.error("Error uploading files:", message, error.response?.data.data || error);
      setError(message);
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const calculateEstimatedCost = () => {
    if (!subcategoryData) return 0;
    let cost = subcategoryData.baseCost;

    Object.keys(selectedCustomization).forEach((key) => {
      if (subcategoryData.customizationCosts && subcategoryData.customizationCosts[key]) {
        cost += selectedCustomization[key] ? subcategoryData.customizationCosts[key] : 0;
      }
    });

    cost *= numCopies;
    return cost;
  };

  const handleOptionChange = (optionType, value) => {
    if (optionType === "material") setSelectedMaterial(value);
    if (optionType === "size") setSelectedSize(value);
    if (optionType === "color") setSelectedColor(value);
    if (optionType.startsWith("customization")) {
      setSelectedCustomization({ ...selectedCustomization, [optionType.split("-")[1]]: value });
    }
    setEstimatedCost(calculateEstimatedCost());

    if (subcategoryData[optionType]) {
      setAdditionalFields({ ...additionalFields, [optionType]: value });
    }
  };

  const handleAdditionalFieldChange = (fieldName, value) => {
    setAdditionalFields({ ...additionalFields, [fieldName]: value });
  };

  useEffect(() => {
    setEstimatedCost(calculateEstimatedCost());
  }, [numCopies, selectedMaterial, selectedSize, selectedColor, selectedCustomization, subcategoryParam]);

  const placeOrder = async () => {
    if (files.length === 0) {
      setError("Please upload files to proceed.");
      return;
    }
    setLoadingCheckout(true);

    const orderDetails = {
      subCategory: subcategoryParam,
      numCopies: numCopies,
      material: selectedMaterial,
      size: selectedSize,
      color: selectedColor,
      estimatedCost: estimatedCost,
      customization: selectedCustomization ? JSON.stringify(selectedCustomization) : undefined,
      additionalFields: additionalFields ? JSON.stringify(additionalFields) : undefined,
      files: files, // Pass the entire array of file objects
    };
    navigate("/accessory-checkout", { state: { orderDetails } });
  };
  const handleAddToCart = async () => {
    const payload = {
      "categoryType": "accessory",
      "categoryId": "66f12a56789abc1234567891",
      "name": "Ball Pen",
      "description": "Blue ink smooth writing pen",
      "image": "https://res.cloudinary.com/di3caz3zz/image/upload/v1742808006/printEcom/accesory-print_peuj1p.jpg",
      "unitCost": 100,
      "size": "Medium",
      "color": "Blue",
      "customizations": "Your Custom Text",
      "files": [
      ]
    }

    try {
      await addToCart(payload);
      console.log("Accessory added to cart:");
    } catch (err) {
      console.error("Failed to add accessory to cart:", err);
      setError("Failed to add accessory to cart. Please try again.");
    }
  };



  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (!subcategoryData) return <div className="text-center py-4 text-red-500">Error loading subcategory data.</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg p-8">
        <div className="mb-6">
          <BreadcrumbNavigation />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div {...getRootProps()} className={`border-dashed border-2 border-gray-300 p-6 rounded-lg flex flex-col items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
            <input {...getInputProps()} />
            {uploading ? <p>Uploading...</p> : <p className="text-gray-600">Drag & drop files here, or click to select files</p>}
            {files.length > 0 && (
              <ul className="mt-4 w-full">
                {files.map((file, index) => (
                  <li key={index} className="flex justify-between items-center p-2 bg-gray-100 rounded-lg mt-2">
                    <span className="text-gray-800">{file.name}</span>
                    <button onClick={() => removeFile(index)} className="bg-red-500 text-white px-2 py-1 rounded-lg text-sm hover:bg-red-600 transition">✖</button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white shadow-md p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-2">{subcategoryParam.replace(/-/g, ' ').toUpperCase()}</h2>

            <h2 className="text-xl font-bold mb-4 text-gray-800">Order Details</h2>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <div className="space-y-4">
              {subcategoryData.material && (
                <div className="mb-3">
                  <label className="block text-sm font-medium">Material</label>
                  <select className="w-full border p-2 rounded mt-1" onChange={(e) => handleOptionChange("material", e.target.value)} value={selectedMaterial}>
                    {subcategoryData.material.map((mat) => (
                      <option key={mat} value={mat}>{mat}</option>
                    ))}
                  </select>
                </div>
              )}
              {subcategoryData.sizeOptions && (
                <div className="mb-3">
                  <label className="block text-sm font-medium">Size</label>
                  <select className="w-full border p-2 rounded mt-1" onChange={(e) => handleOptionChange("size", e.target.value)} value={selectedSize}>
                    {subcategoryData.sizeOptions.map((size) => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>
              )}
              {subcategoryData.colorOptions && (
                <div className="mb-3">
                  <label className="block text-sm font-medium">Color</label>
                  <select className="w-full border p-2 rounded mt-1" onChange={(e) => handleOptionChange("color", e.target.value)} value={selectedColor}>
                    {subcategoryData.colorOptions.map((color) => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                </div>
              )}
              {subcategoryData.customizationOptions &&
                Object.entries(subcategoryData.customizationOptions).map(([optionKey, optionValues]) => (
                  <div key={optionKey} className="mb-3">
                    <label className="block text-sm font-medium">{optionKey}</label>
                    {typeof optionValues === "boolean" ? (
                      <input
                        type="text"
                        className="w-full border p-2 rounded mt-1"
                        onChange={(e) => handleOptionChange(`customization-${optionKey}`, e.target.value)}
                        value={selectedCustomization[optionKey] || ""}
                      />
                    ) : (
                      <select
                        className="w-full border p-2 rounded mt-1"
                        onChange={(e) => handleOptionChange(`customization-${optionKey}`, e.target.value)}
                        value={selectedCustomization[optionKey] || ""}
                      >
                        <option value="">Select {optionKey}</option>
                        {optionValues.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                ))}

              {Object.keys(subcategoryData)
                .filter(
                  (key) =>
                    !["material", "sizeOptions", "colorOptions", "customizationOptions", "baseCost", "customizationCosts", "availableSizes", "availableColors"].includes(key) && typeof subcategoryData[key] !== 'object' && !key.endsWith("InputLabel")
                )
                .map((key) => (
                  <div key={key} className="mb-3">
                    <label className="block text-sm font-medium">{subcategoryData[`${key}InputLabel`] || key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")}</label>
                    {Array.isArray(subcategoryData[key]) ? (
                      <select
                        className="w-full border p-2 rounded mt-1"
                        onChange={(e) => handleAdditionalFieldChange(key, e.target.value)}
                        value={additionalFields[key] || ""}
                      >
                        <option value="">Select {subcategoryData[`${key}InputLabel`] || key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")}</option>
                        {subcategoryData[key].map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        className="w-full border p-2 rounded mt-1"
                        onChange={(e) => handleAdditionalFieldChange(key, e.target.value)}
                        value={additionalFields[key] || ""}
                      />
                    )}
                  </div>
                ))}

              <div className="mb-3">
                <label className="block text-sm font-medium">Number of Quantiy</label>
                <input type="number" min="1" value={numCopies} onChange={(e) => setNumCopies(parseInt(e.target.value, 10))} className="w-full border p-2 rounded mt-1" />
              </div>
            </div>
            <p className="mt-2 text-lg font-bold text-blue-600">Total Cost: ₹{estimatedCost.toFixed(2)}</p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 w-full">
              <button
                className={`flex-1 bg-blue-600 text-white py-3 sm:py-4 rounded-lg hover:bg-blue-700 transition flex items-center justify-center text-base sm:text-lg font-medium ${loadingCheckout ? "opacity-70 cursor-wait" : ""
                  }`}
                onClick={placeOrder}
                disabled={loadingCheckout}
              >
                {loadingCheckout ? (
                  <BeatLoader color="white" size={8} />
                ) : (
                  "Proceed to Checkout"
                )}
              </button>

              {/* Add to Cart button */}
              <button
                className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white rounded-full transition px-5 sm:px-6 py-3 sm:py-4 w-full sm:w-auto"
                title="Add to Cart"
                onClick={handleAddToCart}
              >
                <AiOutlineShoppingCart className="text-xl sm:text-2xl" />
              </button>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessoryOrderPage;
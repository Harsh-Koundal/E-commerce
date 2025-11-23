import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import BreadcrumbNavigation from "@/components/Breadcrumb-Navigation/BreadcrumbNavigation";
import PreviewPage from "./PreviewPage";
import { getPdfPageCount } from "@/utils/pdfPageCounter";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useCart } from "@/context/CartContext";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";

const MAX_FILE_SIZE = 50 * 1024 * 1024;

const priceData = {
  "document-printing": {
    "75GSM - Normal Paper": {
      blackWhite: { singleSide: 0.99, backToBack: 0.89 },
      color: { singleSide: 5.75, backToBack: 5.25 },
    },
    "100GSM - Duo Paper": {
      blackWhite: { singleSide: 2.5, backToBack: 2 },
      color: { singleSide: 7, backToBack: 7 },
    },
  },
  "letterhead-printing": {
    "75GSM - Normal Paper": { color: { singleSide: 5.75 } },
    "100GSM - Duo Paper": { color: { singleSide: 6.66 } },
  },
  "certificates-printing": {
    "250GSM - Matte Paper": { blackWhite: { singleSide: 14 }, color: { singleSide: 21 } },
    "250GSM - Glossy Paper": { blackWhite: { singleSide: 14 }, color: { singleSide: 21 } },
    "300GSM - Matte Paper": { blackWhite: { singleSide: 15 }, color: { singleSide: 23 } },
    "300GSM - Glossy Paper": { blackWhite: { singleSide: 15 }, color: { singleSide: 22.5 } },
  },
  "visiting-printing": {
    "75GSM - Normal Paper": {
      blackWhite: { singleSide: 5.75, backToBack: 5.25 },
      color: { singleSide: 5.75, backToBack: 5.25 },
    },
    "100GSM - Duo Paper": {
      blackWhite: { singleSide: 7, backToBack: 7 },
      color: { singleSide: 7, backToBack: 7 },
    },
  },
  "poster-printing": {
    "250GSM - Matte Paper": { blackWhite: { singleSide: 23 }, color: { singleSide: 37.5 } },
    "250GSM - Glossy Paper": { blackWhite: { singleSide: 23 }, color: { singleSide: 37.5 } },
    "300GSM - Matte Paper": { blackWhite: { singleSide: 25 }, color: { singleSide: 45 } },
    "300GSM - Glossy Paper": { blackWhite: { singleSide: 25 }, color: { singleSide: 45 } },
  },
  "leaflet-flyers-pamphlet-printing": {
    "130GSM - Matte Paper": {
      blackWhite: { singleSide: 11, backToBack: 9 },
      color: { singleSide: 15, backToBack: 13.5 },
    },
    "130GSM - Glossy Paper": {
      blackWhite: { singleSide: 11, backToBack: 9 },
      color: { singleSide: 15, backToBack: 13.5 },
    },
    "170GSM - Matte Paper": {
      blackWhite: { singleSide: 12.5, backToBack: 10 },
      color: { singleSide: 15, backToBack: 13.5 },
    },
    "170GSM - Glossy Paper": {
      blackWhite: { singleSide: 12.5, backToBack: 10 },
      color: { singleSide: 18, backToBack: 16.2 },
    },
  },
  "notebook-printing": {
    "75GSM - Normal Paper": {
      blackWhite: { singleSide: 0.99, backToBack: 0.89 },
      color: { singleSide: 5.75, backToBack: 5.25 },
    },
    "100GSM - Duo Paper": {
      blackWhite: { singleSide: 2.5, backToBack: 2 },
      color: { singleSide: 7, backToBack: 7 },
    },
  },
  "brochure-printing": {
    "75GSM - Normal Paper": {
      blackWhite: { singleSide: 5.75, backToBack: 5.25 },
      color: { singleSide: 5.75, backToBack: 5.25 },
    },
    "100GSM - Duo Paper": {
      blackWhite: { singleSide: 7, backToBack: 7 },
      color: { singleSide: 7, backToBack: 7 },
    },
  },
  "photo-album-printing": {
    "130GSM - Matte Paper": { color: { singleSide: 15, backToBack: 13.5 } },
    "130GSM - Glossy Paper": { color: { singleSide: 15, backToBack: 13.5 } },
    "170GSM - Matte Paper": { color: { singleSide: 15, backToBack: 13.5 } },
    "170GSM - Glossy Paper": { color: { singleSide: 18, backToBack: 16.2 } },
    "220GSM - Matte Paper": { color: { singleSide: 21, backToBack: 18.9 } },
    "250GSM - Matte Paper": { color: { singleSide: 21, backToBack: 18.9 } },
    "250GSM - Glossy Paper": { color: { singleSide: 21, backToBack: 18.9 } },
    "300GSM - Matte Paper": { color: { singleSide: 23, backToBack: 20.7 } },
    "300GSM - Glossy Paper": { color: { singleSide: 22.5, backToBack: 20.25 } },
  },
};

const bindingOptions = { "No Binding": 0, "Spiral Binding": 10, "Hard Binding": 25, "Soft Binding": 15 };
const laminationOptions = { None: 0, Glossy: 5, Matte: 5 };
const colorTypes = { blackWhite: "blackWhite", color: "color" };
const printedSidesOptions = { SingleSide: "singleSide", BacktoBack: "backToBack" };

const OrderPage = () => {
  const [files, setFiles] = useState([]);
  const [numCopies, setNumCopies] = useState(1);
  const [colorType, setColorType] = useState("blackWhite");
  const [totalPages, setTotalPages] = useState(0);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [paperType, setPaperType] = useState("75GSM - Normal Paper");
  const [binding, setBinding] = useState("No Binding");
  const [lamination, setLamination] = useState("None");
  const [printedSides, setPrintedSides] = useState("SingleSide");
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [estimatedCost, setEstimatedCost] = useState(0);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const subcategoryParam = searchParams.get("subcategory")?.toLowerCase() || "";
  const [showColor, setShowColor] = useState(true);
  const [showPrintedSide, setShowPrintedSide] = useState(true);
  const [colorOnly, setColorOnly] = useState(false);
  const token = localStorage.getItem("token");
  const vendorToken = localStorage.getItem("vendorToken");
  const { addToCart } = useCart();
  const [processing, setProcessing] = useState(false);
  const {user}=useAuth();
  useEffect(() => {
    if (!categoryId) return;
    const fetchCategory = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/accessorycategories/${categoryId}`
        );
        setCategory(res.data.data);
      } catch (error) {
        console.error("Error fetching category:", error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [categoryId, navigate]);

  const validSubcategories = category?.subcategories || [];
  const subcategory =
    validSubcategories.find((sub) => sub.id.toLowerCase() === subcategoryParam) || null;

  useEffect(() => {
    if (subcategoryParam === "letterhead-printing" || subcategoryParam === "photo-album-printing") {
      setShowColor(true);
      setShowPrintedSide(true);
      setColorType("color");
      setColorOnly(true);
    } else {
      setShowColor(true);
      setShowPrintedSide(true);
      setColorOnly(false);
    }
  }, [subcategoryParam]);

  useEffect(() => {
    if (
      subcategoryParam === "certificates-printing" ||
      subcategoryParam === "poster-printing" ||
      subcategoryParam === "leaflet-flyers-pamphlet-printing" ||
      subcategoryParam === "notebook-printing" ||
      subcategoryParam === "photo-album-printing"
    ) {
      setPaperType("130GSM - Matte Paper");
    } else {
      setPaperType("75GSM - Normal Paper");
    }
  }, [subcategoryParam]);

  // const onDrop = async (acceptedFiles) => {
  //   if (!category || !subcategory) {
  //     const errorMessage = "Invalid category or subcategory selection!";
  //     console.error(errorMessage);
  //     setError(errorMessage);
  //     return;
  //   }
  //   setError(null);
  //   setUploading(true);
  //   const formData = new FormData();
  //   acceptedFiles.forEach((file) => formData.append("files", file));
  //   const filesize = acceptedFiles.reduce((total, file) => total + file.size, 0);
  //   if (filesize > MAX_FILE_SIZE) {
  //     setError("File size exceeds the maximum limit of 50MB.");
  //     setUploading(false);
  //     return;
  //   }
  //   try {
  //     let newFiles = [];
  //     for (const file of acceptedFiles) {
  //       let count = 1;
  //       if (file.type === "application/pdf") {
  //         count = await getPdfPageCount(file);
  //       }
  //       newFiles.push({ file, pageCount: count });
  //     }
  //     let res = await axios.post(
  //       `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/orders/upload-files-legacy`,
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //           Authorization: `Bearer ${token || vendorToken}`,
  //         },
  //         withCredentials: true,
  //       }
  //     );
  //     console.log(res.data.data.files)
  //     const uploadedFiles = res.data.data.files.map((f, idx) => ({
  //       ...newFiles[idx],
  //       name: f.name || newFiles[idx].file.name,
  //       url: f.url, // Cloudinary URL
  //     }));

  //     setFiles((prev) => {
  //       const updatedFiles = [...prev, ...uploadedFiles];
  //       const totalPagesCount = updatedFiles.reduce(
  //         (sum, f) => sum + (f.pageCount || 1),
  //         0
  //       );
  //       setTotalPages(totalPagesCount);
  //       return updatedFiles;
  //     });
  //   } catch (error) {
  //     const message = error?.response?.data?.data?.message || "An unexpected error occurred";
  //     console.error("Error uploading files:", message, error.response?.data?.data || error);
  //     setError(message);
  //   } finally {
  //     setUploading(false);
  //   }
  // };
  const onDrop = async (acceptedFiles) => {
    if(!user) {
      toast.error("Please first login before uploading any pdf document")
      return;
    }
    const newFiles = await Promise.all(
      acceptedFiles.map(async (file) => {
        let pageCount = 1;
        if (file.type === "application/pdf") {
          pageCount = await getPdfPageCount(file);
        }
        return { file, pageCount, name: file.name, url: null }; // url stays null until upload
      })
    );
  
    setFiles((prev) => {
      const updatedFiles = [...prev, ...newFiles];
      setTotalPages(updatedFiles.reduce((sum, f) => sum + (f.pageCount || 1), 0));
      return updatedFiles;
    });
  };
  const uploadFiles = async () => {
    if (files.length === 0) return [];
  
    const formData = new FormData();
    files.forEach((fileObj) => formData.append("files", fileObj.file));
  
    const filesize = files.reduce((total, f) => total + f.file.size, 0);
    if (filesize > MAX_FILE_SIZE) {
      throw new Error("File size exceeds the maximum limit of 50MB.");
    }
  
    const res = await axios.post(
      `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/orders/upload-files`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token || vendorToken}`,
        },
        withCredentials: true,
      }
    );
  
    const uploadedFiles = res.data.data.files.map((f, idx) => ({
      ...files[idx],
      name: f.name || files[idx].file.name,
      url: f.url, // Cloudinary URL
    }));
  
    setFiles(uploadedFiles);
    setProcessing(false);
    setUploading(false);
    return uploadedFiles;
  };
  

  const removeFile = (index) => {
    setFiles((prevFiles) => {
      const updatedFiles = prevFiles.filter((_, i) => i !== index);
      const newTotalPages = updatedFiles.reduce(
        (sum, f) => sum + (f.pageCount || 1),
        0
      );
      setTotalPages(newTotalPages);
      return updatedFiles;
    });
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const calculateEstimatedCost = () => {
    if (!category || !subcategory) return 0;
    const paperCost = priceData[subcategoryParam] && priceData[subcategoryParam][paperType];
    const colorKey = colorTypes[colorType];
    const sideKey = printedSidesOptions[printedSides];

    let cost = 0;
    if (paperCost && paperCost[colorKey] && paperCost[colorKey][sideKey]) {
      cost = totalPages * paperCost[colorKey][sideKey];
    } else if (paperCost && paperCost.color && paperCost.color.singleSide) {
      cost = totalPages * paperCost.color.singleSide;
    }

    cost += bindingOptions[binding] || 0;
    cost += laminationOptions[lamination] || 0;
    cost *= numCopies;
    return cost;
  };

  const handleOptionChange = (optionType, value) => {
    if (optionType === "colorType") setColorType(value);
    if (optionType === "paperType") setPaperType(value);
    if (optionType === "binding") setBinding(value);
    if (optionType === "lamination") setLamination(value);
    if (optionType === "printedSides") setPrintedSides(value);
    setEstimatedCost(calculateEstimatedCost());
  };

  useEffect(() => {
    setEstimatedCost(calculateEstimatedCost());
  }, [numCopies, colorType, paperType, binding, lamination, printedSides, totalPages, subcategoryParam]);

  // const handlePlaceOrder = async () => {
  //   setError(null);
  //   setUploading(true);
  //   if (!category || !category._id || files.length === 0) {
  //     setError("Please upload files to proceed to checkout.");
  //     return;
  //   }
  //   const orderDetails = {
  //     categoryId: category._id,
  //     subCategory: subcategory.id,
  //     numCopies,
  //     colorType,
  //     paperType,
  //     binding,
  //     lamination,
  //     printedSides,
  //     totalPages,
  //     estimatedCost,
  //     files,
  //   };
  //   navigate("/checkout", { state: { orderDetails } });
  // };
  const handlePlaceOrder = async () => {
    if(!user) {
      return toast.error("Please first login to proceed!")
    }
    if(processing) return; // prevent double clicks
    setProcessing(true);
    setError(null);
    setUploading(true);
    try {
      const uploadedFiles = await uploadFiles();
      if (!category || !category._id || uploadedFiles.length === 0) {
        setError("Please upload files to proceed to checkout.");
        return;
      }
      const orderDetails = {
        categoryId: category._id,
        subCategory: subcategory.id,
        numCopies,
        colorType,
        paperType,
        binding,
        lamination,
        printedSides,
        totalPages,
        estimatedCost,
        files: uploadedFiles,
      };
      let orders=[];
      orders.push(orderDetails);
      navigate("/checkout", { state: { orders } });
    } catch (error) {
      setError(error.message || "Failed to upload files.");
      console.error("Error",error.message);
    } finally {
      setUploading(false);
    }
  };
  
  // const handleAddToCart = async () => {
  //   if (!category || !category._id || files.length === 0) {
  //     setError("Please upload files to add to cart.");
  //     toast.error("Please upload file to proceed")
  //     return;
  //   }
  //   console.log(files)
  //   const payload = {
  //     categoryType: "document",
  //     categoryId: category._id,
  //     name: category.name,
  //     description: subcategory?.name || "Document Printing",
  //     image: category.image,
  //     unitCost: estimatedCost / (numCopies * totalPages || 1),
  //     numCopies,
  //     paperType,
  //     binding,
  //     lamination,
  //     printedSides,
  //     totalPages: totalPages > 0 ? totalPages : 1,
  //     files: files.map((fileObj) => ({
  //       name: fileObj.name,
  //       url: fileObj.url,   // <-- Cloudinary URL
  //       pageCount: fileObj.pageCount || 1,
  //     })),
  //   };

  //   try {
  //     console.log("item that is added to cart:", payload);
  //     await addToCart(payload);
  //     console.log("item added to cart")
  //   } catch (err) {
  //     console.error("Failed to add to cart:", err);
  //     setError("Failed to add item to cart. Please try again.");
  //   }
  // };
  const handleAddToCart = async () => {
    if(!user) {
      return toast.error("Please first login to proceed!")
    }
    if (processing) return; // prevent double clicks
    setProcessing(true);
    setError(null);
    try {
      const uploadedFiles = await uploadFiles();
      if (!category || !category._id || uploadedFiles.length === 0) {
        setError("Please upload files to add to cart.");
        toast.error("Please upload file to proceed");
        return;
      }
  
      const payload = {
        categoryType: "document",
        categoryId: category._id,
        name: category.name,
        description: subcategory?.name || "Document Printing",
        image: category.image,
        unitCost: estimatedCost / (numCopies * totalPages || 1),
        numCopies,
        paperType,
        binding,
        lamination,
        printedSides,
        totalPages: totalPages > 0 ? totalPages : 1,
        files: uploadedFiles.map((fileObj) => ({
          originalname: fileObj.name,
          url: fileObj.url,
          pageCount: fileObj.pageCount || 1,
        })),
      };
  
      await addToCart(payload);
      setProcessing(false);
      setUploading(false);
    } catch (err) {
      setError(err.message || "Failed to add item to cart.");
    }
  };
  
  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (!category) return <div className="text-center py-4 text-red-500">Error loading category data.</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg p-8">

        {/* Breadcrumb inside the card, top-left corner */}
        <div className="mb-6">
          <BreadcrumbNavigation />
        </div>

        {/* 2-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* File Upload Section */}
          <div
            {...getRootProps()}
            className={`p-10 rounded-lg flex flex-col items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition min-h-[300px] ${uploading ? "opacity-50 pointer-events-none" : ""
              }`}
          >
            <input {...getInputProps()} />
            {uploading ? (
              <p className="text-lg font-medium text-gray-700">Uploading...</p>
            ) : files.length === 0 ? (
              <p className="text-gray-600 text-center text-lg">
                Drag & drop files here, or click to select files
              </p>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                {files.map((fileObj, index) => {
                  const file = fileObj.file || fileObj;
                  const fileType = file?.type || "";
                  return (
                    <div
                      key={index}
                      className="relative w-full h-80 p-4 rounded flex items-center justify-center bg-gray-100"
                    >
                      {fileType.startsWith("image/") ? (
                        <img
                          src={fileObj.url || URL.createObjectURL(file)}
                          alt={file.name || fileObj.name}
                          className="w-full h-full object-contain rounded"
                        />
                      ) : fileType === "application/pdf" ? (
                        <iframe
                          src={fileObj.url || URL.createObjectURL(file)}
                          title={file.name || fileObj.name}
                          className="w-full h-full rounded"
                          allow="fullscreen"
                        />
                      ) : (
                        <span className="text-lg font-medium text-gray-700 text-center">
                          {file.name || fileObj.name}
                        </span>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(index);
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        ✖
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>



          {/* Order Details Section */}
          <div className="bg-white shadow-md p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-2">{category.name}</h2>
            {subcategory && (
              <h3 className="text-lg mb-4 text-gray-700">
                Sub-Category: <span className="font-semibold">{subcategory.name}</span>
              </h3>
            )}

            <h2 className="text-xl font-bold mb-4 text-gray-800">Order Details</h2>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <div className="space-y-4">
              {showColor && (
                <div className="mb-3">
                  <label className="block text-sm font-medium">Color Type</label>
                  <select
                    className="w-full border p-2 rounded mt-1"
                    onChange={(e) => handleOptionChange("colorType", e.target.value)}
                    value={colorType}
                  >
                    <option value="blackWhite">Black & White</option>
                    <option value="color">Color</option>
                  </select>
                  {colorOnly && (
                    <p className="text-sm text-red-500">
                      Only color printing is available for this category.
                    </p>
                  )}
                </div>
              )}

              <div className="mb-3">
                <label className="block text-sm font-medium">Paper Type</label>
                <select
                  className="w-full border p-2 rounded mt-1"
                  onChange={(e) => handleOptionChange("paperType", e.target.value)}
                  value={paperType}
                >
                  {Object.keys(priceData[subcategoryParam] || {}).map((paper) => (
                    <option key={paper} value={paper}>
                      {paper}
                    </option>
                  ))}
                </select>
              </div>

              {showPrintedSide && (
                <div className="mb-3">
                  <label className="block text-sm font-medium">Printed Sides</label>
                  <select
                    className="w-full border p-2 rounded mt-1"
                    onChange={(e) => handleOptionChange("printedSides", e.target.value)}
                    value={printedSides}
                  >
                    <option value="SingleSide">Single Side</option>
                    <option value="BacktoBack">Back to Back</option>
                  </select>
                </div>
              )}

              <div className="mb-3">
                <label className="block text-sm font-medium">Binding</label>
                <select
                  className="w-full border p-2 rounded mt-1"
                  onChange={(e) => handleOptionChange("binding", e.target.value)}
                  value={binding}
                >
                  <option value="No Binding">No Binding</option>
                  <option value="Spiral Binding">Spiral Binding</option>
                  <option value="Hard Binding">Hard Binding</option>
                  <option value="Soft Binding">Soft Binding</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium">Lamination</label>
                <select
                  className="w-full border p-2 rounded mt-1"
                  onChange={(e) => handleOptionChange("lamination", e.target.value)}
                  value={lamination}
                >
                  <option value="None">None</option>
                  <option value="Glossy">Glossy</option>
                  <option value="Matte">Matte</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium">Number of Copies</label>
                <input
                  type="number"
                  min="1"
                  value={numCopies}
                  onChange={(e) => setNumCopies(parseInt(e.target.value, 10) || 1)}
                  className="w-full border p-2 rounded mt-1"
                />
              </div>
            </div>

            <p className="mt-4 text-sm font-medium">Total Pages: {totalPages}</p>
            <p className="mt-2 text-lg font-bold text-blue-600">
              Total Cost: ₹{estimatedCost.toFixed(2)}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mt-6 w-full">
              <button
                className="flex-1 bg-blue-600 text-white py-3 sm:py-4 px-6 rounded-lg hover:bg-blue-700 transition text-base sm:text-sm font-medium disabled:opacity-70 disabled:cursor-wait"
                onClick={handlePlaceOrder}
                disabled={uploading || processing}
              >
                {uploading ? "Placing Order..." : "Proceed to Checkout"}
              </button>
              <button
                className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white rounded-full transition px-5 sm:px-6 py-3 sm:py-4 w-full sm:w-auto disabled:opacity-70 disabled:cursor-wait"
                title="Add to Cart"
                onClick={handleAddToCart}
                disabled={uploading || processing}
              >
                <AiOutlineShoppingCart className="text-xl sm:text-2xl" />
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderPage;

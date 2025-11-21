import { useState, useEffect } from "react";
import "../assets/styling/pricecalc.css";
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
    "250GSM - Matte Paper": {
      blackWhite: { singleSide: 14 },
      color: { singleSide: 21 },
    },
    "250GSM - Glossy Paper": {
      blackWhite: { singleSide: 14 },
      color: { singleSide: 21 },
    },
    "300GSM - Matte Paper": {
      blackWhite: { singleSide: 15 },
      color: { singleSide: 23 },
    },
    "300GSM - Glossy Paper": {
      blackWhite: { singleSide: 15 },
      color: { singleSide: 22.5 },
    },
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
    "250GSM - Matte Paper": {
      blackWhite: { singleSide: 23 },
      color: { singleSide: 37.5 },
    },
    "250GSM - Glossy Paper": {
      blackWhite: { singleSide: 23 },
      color: { singleSide: 37.5 },
    },
    "300GSM - Matte Paper": {
      blackWhite: { singleSide: 25 },
      color: { singleSide: 45 },
    },
    "300GSM - Glossy Paper": {
      blackWhite: { singleSide: 25 },
      color: { singleSide: 45 },
    },
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

const bindingOptions = {
  None: 0,
  "Spiral Binding": 10,
  "Hard Binding": 25,
  "Soft Binding": 15,
};
const laminationOptions = { None: 0, Glossy: 5, Matte: 5 };
const pageOrientations = { Portrait: 0, Landscape: 2 };
const coverPages = { None: 0, Transparent: 5, Cardstock: 10 };
const colorTypes = { "Black & White": "blackWhite", Color: "color" };
const printedSides = {
  "Single Side": "singleSide",
  "Back to Back": "backToBack",
};
const shippingMethods = { Standard: 0, Express: 20, Pickup: 0 };

export default function PriceCalculator() {
  const [category, setCategory] = useState("document-printing");
  const [paperType, setPaperType] = useState("75GSM - Normal Paper");
  const [colorType, setColorType] = useState("Black & White");
  const [printedSide, setPrintedSide] = useState("Single Side");
  const [pageCount, setPageCount] = useState(1);
  const [binding, setBinding] = useState("None");
  const [lamination, setLamination] = useState("None");
  const [orientation, setOrientation] = useState("Portrait");
  const [cover, setCover] = useState("None");
  const [shipping, setShipping] = useState("Standard");
  const [totalPrice, setTotalPrice] = useState(0);
  const [deliveryEstimate, setDeliveryEstimate] = useState(1);

  useEffect(() => {
    if (
      category === "letterhead-printing" ||
      category === "photo-album-printing"
    ) {
      setColorType("Color");
    }
  }, [category]);

  useEffect(() => {
    if (["certificates-printing", "poster-printing"].includes(category)) {
      setPaperType("250GSM - Matte Paper");
    } else {
      setPaperType("75GSM - Normal Paper");
    }
  }, [category]);

  const calculatePrice = () => {
    const basePrice =
      priceData[category]?.[paperType]?.[colorTypes[colorType]]?.[
        printedSides[printedSide]
      ] || 0;
    const bindingCost = bindingOptions[binding] || 0;
    const laminationCost = laminationOptions[lamination] || 0;
    const orientationCost = pageOrientations[orientation] || 0;
    const coverCost = coverPages[cover] || 0;
    const shippingCost = shippingMethods[shipping] || 0;

    let total =
      pageCount * basePrice +
      bindingCost +
      laminationCost +
      orientationCost +
      coverCost +
      shippingCost;

    // Apply bulk discount
    if (pageCount >= 100 && pageCount < 500) total *= 0.95;
    if (pageCount >= 500) total *= 0.9;

    setTotalPrice(total);

    // Estimate delivery based on shipping
    let estimate = 1;
    if (shipping === "Express") estimate = 1;
    else if (shipping === "Standard") estimate = 3;
    else estimate = 0; // Pickup same day
    setDeliveryEstimate(estimate);
  };

  return (
    <div className="w-full max-w-fit sm:max-w-md md:max-w-3xl xl:max-w-4xl: 2xl:max-w-6xl mx-auto mt-6 mb-8 px-8 sm:px-6 md:px-8 py-4 bg-white rounded-2xl shadow-[0_20px_80px_10px_rgba(82,0,65,0.08)]">
      <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-center text-black tracking-tight">
        Price Calculator
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-base font-medium text-gray-800">
          Category
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 px-3 py-2 rounded-lg text-base font-medium border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            {Object.keys(priceData).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-base font-medium text-gray-800">
          Paper Type
          <select
            value={paperType}
            onChange={(e) => setPaperType(e.target.value)}
            className="mt-1 px-3 py-2 text-base font-medium rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            {Object.keys(priceData[category] || {}).map((paper) => (
              <option key={paper} value={paper}>
                {paper}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-base font-medium text-gray-800">
          Color Type
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <input
              type="text"
              readOnly
              value={colorType || "Select"}
              className="flex-1 py-1 text-base font-medium focus:outline-none pl-2"
            />

            {/* Black & White button */}
            <button
              type="button"
              onClick={() => {
                setColorType("Black & White");
                setTextAreaStyle({
                  filter: "grayscale(100%)",
                });
              }}
              className={`w-12 h-12 rounded-full flex items-center justify-center my-1 border ${
                colorType === "Black & White" ? "ring-2 ring-black" : ""
              }`}
            >
              <div
                className="w-10 h-10 rounded-full"
                style={{
                  background: "linear-gradient(135deg,black 50%,white 50%)",
                  border: "1px solid black",
                }}
              ></div>
            </button>

            {/* Color button */}
            <button
              type="button"
              onClick={() => {
                setColorType("Color");
                setTextAreaStyle({
                  filter: "none",
                });
              }}
              className={`w-12 h-12 rounded-full flex items-center justify-center m-0.5 border ${
                colorType === "Color" ? "ring-2 ring-green-600" : ""
              }`}
            >
              <div
                className="w-10 h-10 rounded-full"
                style={{
                  background:
                    "conic-gradient(red, orange, yellow, green, blue, indigo, violet, red)",
                  border: "1px solid black",
                }}
              ></div>
            </button>
          </div>
        </label>

        <label className="flex flex-col gap-1 text-base font-medium text-gray-800">
          Printed Side
          <select
            value={printedSide}
            onChange={(e) => setPrintedSide(e.target.value)}
            className="mt-1 px-3 py-2 text-base font-medium rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            {Object.keys(printedSides).map((side) => (
              <option key={side} value={side}>
                {side}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-base font-medium  text-gray-800">
          Number of Pages
          <div className="flex items-center mt-1 border border-gray-300 rounded-lg overflow-hidden w-90">
            {/* Minus button */}
            <button
              type="button"
              onClick={() => setPageCount(Math.max(1, pageCount - 1))}
              className="bg-gray-200 hover:bg-gray-300 px-3 py-2 text-xl font-bold"
            >
              −
            </button>

            {/* Input box */}
            <input
              type="number"
              value={pageCount}
              onChange={(e) => setPageCount(Number(e.target.value))}
              min={1}
              className="w-full text-center py-2 text-lg focus:outline-none"
            />

            {/* Plus button */}
            <button
              type="button"
              onClick={() => setPageCount(pageCount + 1)}
              className="bg-gray-200 hover:bg-gray-300 px-3 py-2 text-xl font-bold"
            >
              +
            </button>
          </div>
        </label>

        <label className="flex flex-col gap-1 text-base font-medium text-gray-800">
          Binding
          <select
            value={binding}
            onChange={(e) => setBinding(e.target.value)}
            className="mt-1 px-3 py-2 text-base font-medium rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            {Object.keys(bindingOptions).map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-base font-medium text-gray-800">
          Lamination
          <select
            value={lamination}
            onChange={(e) => setLamination(e.target.value)}
            className="mt-1 px-3 py-2 text-base font-medium rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            {Object.keys(laminationOptions).map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-base font-medium text-gray-800">
          Page Orientation
          <select
            value={orientation}
            onChange={(e) => setOrientation(e.target.value)}
            className="mt-1 px-3 py-2 text-base font-medium rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="vertical">▯ (Portrait)</option>
            <option value="horizontal">▬ (Landscape)</option>
          </select>
        </label>

        <label className="flex flex-col gap-1 text-base font-medium text-gray-800">
          Cover Page
          <select
            value={cover}
            onChange={(e) => setCover(e.target.value)}
            className="mt-1 px-3 py-2 text-base font-medium rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            {Object.keys(coverPages).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-base font-medium text-gray-800">
          Shipping Method
          <select
            value={shipping}
            onChange={(e) => setShipping(e.target.value)}
            className="mt-1 px-3 py-2 text-base font-medium rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            {Object.keys(shippingMethods).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        <button
          onClick={calculatePrice}
          className="col-span-1 md:col-span-2 mt-2 w-full py-2 rounded-lg bg-blue-700 text-white font-semibold hover:bg-blue-800 shadow transition-all"
        >
          Calculate Price
        </button>

        <div className="col-span-1 md:col-span-2 mt-8 text-center">
          <p className="text-xl font-bold">
            Total Price:{" "}
            <span className="text-blue-700">₹{totalPrice.toFixed(2)}</span>
          </p>
          <div className="mt-3 flex justify-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-50 text-green-700 font-semibold shadow-sm border border-green-100 text-base">
              <svg
                className="w-5 h-5 text-green-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 17v-6h13M9 5v6h13M3 5h.01M3 11h.01M3 17h.01"
                />
              </svg>
              Estimated Delivery:{" "}
              <span className="text-green-700 font-bold">
                {deliveryEstimate}
              </span>{" "}
              day(s)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

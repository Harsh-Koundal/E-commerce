import React from "react";
import { useLocation, Link } from "react-router-dom";

const pathNameMap = {
  "document-printing": {
    label: "Document Printing",
    link: "/category/document-printing",
  },
  "accessory-printing": {
    label: "Accessory Printing",
    link: "/accessory-category-details",
  },
  "3d-printing": {
    label: "3D Printing",
    link: "/category/3d-printing",
  },
  "3d-infra-design": {
    label: "3D Infra Design",
    link: "/category/3d-infra-design",
  },
  "stationery-printing": {
    label: "Stationery Printing",
    link: "/stationery",
  },
  "stamps-printing": {
    label: "Stamps & Inks",
    link: "/stationery",
  },
  "poster-printing": {
    label: "Posters, Signs & Mousepads",
    link: "/posters",
  },
  "labels-printing": {
    label: "Labels, Stickers & Packaging",
    link: "/packaging",
  },
  "clothing-printing": {
    label: "Clothing, Caps & Bags",
    link: "/clothing",
  },
  "mugs-printing": {
    label: "Mugs, Albums & Gifts",
    link: "/acessories",
  },
  "drinkware-printing": {
    label: "Custom Drinkware",
    link: "/drinkware",
  },
};

const formatSegment = (segment) =>
  segment?.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

const BreadcrumbNavigation = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const subcategory = searchParams.get("subcategory");

  let segments = location.pathname.split("/").filter(Boolean);

  const orderIdx = segments.indexOf("order-page");
  const serviceKeys = Object.keys(pathNameMap);
  const serviceIdx = segments.findIndex((seg) => serviceKeys.includes(seg));

  if (orderIdx > -1 && serviceIdx > -1 && orderIdx < serviceIdx) {
    const reordered = [...segments];
    const [service] = reordered.splice(serviceIdx, 1);
    reordered.splice(orderIdx, 0, service);
    segments = reordered.filter((seg, i, arr) => arr.indexOf(seg) === i);
  }

  segments = segments.filter((seg) => seg !== "order-page" && seg !== "category");

  if (subcategory) segments.push(subcategory);

  return (
    <nav className="text-sm mb-4" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1 md:space-x-2">
        <li>
          <Link to="/" className="text-blue-600 hover:underline font-medium cursor-pointer">
            Home
          </Link>
        </li>

        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1;
          const config = pathNameMap[segment];
          const label = config?.label || formatSegment(segment);
          const link = config?.link;

          return (
            <li key={index} className="flex items-center space-x-1">
              <span className="text-gray-400 mx-1">{">"}</span>
              {!isLast && link ? (
                <Link to={link} className="text-blue-600 hover:underline cursor-pointer">
                  {label}
                </Link>
              ) : (
                <span className="text-gray-600 font-semibold">{label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default BreadcrumbNavigation;

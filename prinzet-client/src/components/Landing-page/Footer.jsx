import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  const documentsLinks = [
    { name: "Document Printing", path: "/category/document-printing" },
    { name: "Letterhead Printing", path: "/category/document-printing" },
    { name: "Certificates Printing", path: "/category/document-printing" },
    { name: "Visiting Card Printing", path: "/category/document-printing" },
    { name: "Poster Printing", path: "/category/document-printing" },
    {
      name: "Leaflet/Flyers/Pamphlet Printing",
      path: "/category/document-printing",
    },
    { name: "Notebook Printing", path: "/category/document-printing" },
    { name: "Brochure Printing", path: "/category/document-printing" },
    { name: "Photo Album Printing", path: "/category/document-printing" },
  ];

  const categoryLinks = [
    { name: "Accessory Printing", path: "/accessory-category-details" },
    { name: "3D Printing", path: "/category/3d-printing" },
    { name: "3D Infra Design", path: "/category/3d-infra-design" },
  ];

  const accessoryLinks = [
    { name: "Accessory Printing", path: "/accessory-category-details" },
    { name: "Custom Polo T-shirts", path: "/accessory-category-details" },
    { name: "Office Shirts", path: "/accessory-category-details" },
    { name: "Custom T-shirts", path: "/accessory-category-details" },
    { name: "Custom Stamps & Ink", path: "/accessory-category-details" },
    { name: "Photo Gifts", path: "/accessory-category-details" },
    { name: "Custom Caps", path: "/accessory-category-details" },
    { name: "Custom Drinkware", path: "/accessory-category-details" },
    { name: "Custom Bags", path: "/accessory-category-details" },
  ];

  return (
    <footer className="bg-gray-900 text-white py-4 px-6 md:px-12 lg:px-24">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Our Services</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <ul className="space-y-1 text-gray-400 text-xs">
                {documentsLinks.map((service) => (
                  <li key={service.path}>
                    <Link to={service.path} className="hover:text-white">
                      {service.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <ul className="space-y-1 text-gray-400 text-xs">
                {accessoryLinks.map((accessory) => (
                  <li key={accessory.name}>
                    <Link to={accessory.path} className="hover:text-white">
                      {accessory.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Categories</h3>
          <ul className="space-y-1 text-gray-400 text-xs">
            {categoryLinks.map((category) => (
              <li key={category.path}>
                <Link to={category.path} className="hover:text-white">
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-1 text-gray-400 text-xs">
            <li>
              <Link to="/about" className="hover:text-white">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/faqs" className="hover:text-white">
                FAQs
              </Link>
            </li>
            <li>
              <Link to="/blog" className="hover:text-white">
                Blog
              </Link>
            </li>
            <li>
              <Link to="/policies" className="hover:text-white">
                Policies
              </Link>
            </li>
            <li>
              <Link
                to="/career"
                className="hover:text-white"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                Careers
              </Link>
            </li>
            <li>
              <Link to="/support" className="hover:text-white">
                Support
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Contact Us</h3>

          <p className="text-gray-400 text-xs mb-1">
            📍 IIT Bhubaneswar Research and Entrepreneurship Park, Gajapati
            Nagar, Bhubaneswar, Odisha 751013
          </p>
          <p className="text-gray-400 text-xs mb-1">
            📞{" "}
            <a href="tel:+919395947730" className="hover:text-white">
              +91 9395947730
            </a>
          </p>
          <p className="text-gray-400 text-xs mb-1">
            📧{" "}
            <a href="mailto:ceo@printzet.com" className="hover:text-white">
              ceo@printzet.com
            </a>
          </p>
          <p className="text-gray-400 text-xs">
            📧{" "}
            <a href="mailto:info@printzet.com" className="hover:text-white">
              info@printzet.com
            </a>
          </p>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-3 text-center">Follow Us</h3>
        <div className="flex space-x-4 justify-center mb-4">
          <a
            href="https://www.facebook.com"
            className="text-gray-400 hover:text-white"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebook size={20} />
          </a>
          <a
            href="https://www.instagram.com/printzet.labs/"
            className="text-gray-400 hover:text-white"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram size={20} />
          </a>
          <a
            href="https://twitter.com"
            className="text-gray-400 hover:text-white"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTwitter size={20} />
          </a>
          <a
            href="https://www.linkedin.com/company/printzet-technologies-private-limited/"
            className="text-gray-400 hover:text-white transition-colors duration-300 ease-in-out"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin size={20} />
          </a>
        </div>

        <h3 className="text-lg font-semibold mb-3 text-center">We Accept</h3>
        <p className="text-gray-400 text-xs text-center">
          Visa | MasterCard | PayPal | UPI | Net Banking
        </p>
      </div>

      <div className="mt-6 text-center border-t border-gray-700 pt-3">
        <p className="text-gray-500 text-xs">
          © {new Date().getFullYear()} Printzet. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

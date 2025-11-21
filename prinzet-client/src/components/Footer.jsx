import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  const documentsLinks = [
    { name: "Document Printing", path: "/document-printing" },
    { name: "Letterhead Printing", path: "/document-printing" }, // if static page not created, keep dynamic
    { name: "Certificates Printing", path: "/document-printing" },
    { name: "Visiting Card Printing", path: "/contact-cards" },
    { name: "Poster Printing", path: "/posters" },
    { name: "Leaflet/Flyers/Pamphlet Printing", path: "/posters" },
    { name: "Notebook Printing", path: "/stationery" },
    { name: "Brochure Printing", path: "/packaging" },
    { name: "Photo Album Printing", path: "/acessories" },
  ];

  const categoryLinks = [
    { name: "Accessory Printing", path: "/accessory-category-details" },
    { name: "3D Printing", path: "/category/3d-printing" },
    { name: "3D Infra Design", path: "/category/3d-infra-design" },
  ];

  const accessoryLinks = [
    { name: "Accessory Printing", path: "/accessory-category-details" },
    { name: "Custom Polo T-shirts", path: "/clothing" },
    { name: "Office Shirts", path: "/clothing" },
    { name: "Custom T-shirts", path: "/clothing" },
    { name: "Custom Stamps & Ink", path: "/stamp-inks" },
    { name: "Photo Gifts", path: "/acessories" },
    { name: "Custom Caps", path: "/clothing" },
    { name: "Custom Drinkware", path: "/drinkware" },
    { name: "Custom Bags", path: "/clothing" },

  ];

  return (
    <footer className="bg-[#6f6ce0] text-white py-10 px-6 md:px-12 lg:px-24">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-10">
        {/* Our Services */}
        <div>
          <h3 className="text-xl font-medium mb-4">Our Services</h3>
          <div className="grid grid-cols-2 gap-2">
            <ul className="space-y-1 text-sm text-gray-200">
              {documentsLinks.map((service) => (
                <li key={`${service.path}-${service.name}`}>
                  <Link
                    to={service.path}
                    className="hover:text-white transition-colors"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="space-y-1 text-sm text-gray-200">
              {accessoryLinks.map((accessory) => (
                <li key={accessory.name}>
                  <Link
                    to={accessory.path}
                    className="hover:text-white transition-colors"
                  >
                    {accessory.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-medium mb-4">Quick Links</h3>
          <ul className="space-y-1 text-sm text-gray-200">
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
              <Link to="/career" className="hover:text-white">
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

        {/* Contact */}
        <div>
          <h3 className="text-xl font-medium mb-4">Contact Us</h3>
          <p className="text-sm text-gray-200 mb-2">
            IIT Bhubaneswar Research and Entrepreneurship Park, Gajapati Nagar,
            Bhubaneswar, Odisha 751013
          </p>
          <p className="text-sm text-gray-200 mb-1">
            📞{" "}
            <a href="tel:+918778253200" className="hover:text-white">
              +91 9395947730
            </a>
          </p>
          <p className="text-sm text-gray-200 mb-1">
            📧{" "}
            <a href="mailto:ceo@printzet.com" className="hover:text-white">
              ceo@printzet.com
            </a>
          </p>
          <p className="text-sm text-gray-200">
            📧{" "}
            <a href="mailto:info@printzet.com" className="hover:text-white">
              info@printzet.com
            </a>
          </p>
        </div>
      </div>

      {/* Social & Payments */}
      <div className="mt-10 text-center">
        <h3 className="text-lg font-medium mb-3">Follow Us</h3>
        <div className="flex justify-center space-x-4 mb-6">
          {[
            { Icon: FaFacebook, href: "https://www.facebook.com" },
            {
              Icon: FaInstagram,
              href: "https://www.instagram.com/printzet.labs/",
            },
            {
              Icon: FaLinkedin,
              href: "https://www.linkedin.com/company/printzet-technologies-private-limited/",
            },
            { Icon: FaTwitter, href: "https://twitter.com" },
          ].map(({ Icon, href }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-white text-[#6f6ce0] hover:bg-gray-200 transition"
            >
              <Icon size={18} />
            </a>
          ))}
        </div>

        <h3 className="text-lg font-medium mb-2">We Accept</h3>
        <p className="text-sm text-gray-200">
          Visa | MasterCard | PayPal | UPI | Net Banking
        </p>
      </div>

      {/* Divider & Copyright */}
      <div className="mt-8 border-t border-white/20 pt-3 text-center">
        <p className="text-xs text-gray-200">
          © {new Date().getFullYear()} Printzet Labs. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

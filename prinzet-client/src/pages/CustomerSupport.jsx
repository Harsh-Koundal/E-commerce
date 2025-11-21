import React, { useState, useEffect, useRef } from "react";
import { postData } from "@/lib/api";

const SupportPage = () => {
  const BASE =
    (import.meta.env.VITE_REACT_APP_BACKEND_BASEURL || "").replace(/\/$/, "") ||
    "";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "Technical Issue",
    message: "",
  });

  const [contactInfo, setContactInfo] = useState({
    email: "",
    phone: "",
    officeHours: "",
  });

  const [toast, setToast] = useState(null);
  const [openFAQIndex, setOpenFAQIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef(null);

  const showToast = (type, message, ms = 3500) => {
    setToast({ type, message });
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setToast(null), ms);
  };

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.message) {
      showToast("error", "Please fill in all required fields.");
      return;
    }
    if (!validateEmail(formData.email)) {
      showToast("error", "Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      // const res = await api.post("/support/contact", formData);
      const res = postData("/support/contact", formData);

      showToast("success", res?.message || "Message sent successfully!");
      setFormData({
        // name: "",
        // email: "",
        // category: "Technical Issue",
        message: "",
      });
    } catch (err) {
      console.error("Error submitting support message:", err);
      const message =
        err.response?.data?.data?.message ||
        err.message ||
        "Failed to send message";
      showToast("error", message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const faqs = [
    {
      question: "How do I track my order?",
      answer:
        "You can track your order by logging into your account and visiting the 'Orders' section.",
    },
    {
      question: "What is your return policy?",
      answer:
        "We offer a 30-day return policy for unused items in their original packaging.",
    },
    {
      question: "How can I contact support?",
      answer:
        "You can reach us via the support form above, email, or phone during our office hours.",
    },
  ];

  return (
    <>
      {/* Support Form */}
      <section className="py-12 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-3xl font-semibold text-center mb-8"
            id="support-form"
          >
            Support Form
          </h2>

          <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              >
                <option>Technical Issue</option>
                <option>Order Inquiry</option>
                <option>Feedback</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-3 ${
                loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
              } text-white p-2 rounded-md`}
              aria-busy={loading}
            >
              {loading ? (
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
              ) : null}
              {loading ? "Sending..." : "Submit"}
            </button>
          </form>

          {/* Toast */}
          {toast && (
            <div
              role="alert"
              className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-md text-white shadow-lg ${
                toast.type === "success" ? "bg-green-600" : "bg-red-600"
              }`}
            >
              {toast.message}
            </div>
          )}
        </div>
      </section>

      {/* FAQs */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-semibold text-center mb-8" id="faqs">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-gray-200">
                <button
                  className="w-full text-left py-3 px-2 flex justify-between items-center"
                  onClick={() => setOpenFAQIndex(openFAQIndex === i ? null : i)}
                  aria-expanded={openFAQIndex === i}
                >
                  <span className="text-lg font-medium">{faq.question}</span>
                  <svg
                    className={`w-5 h-5 transform ${
                      openFAQIndex === i ? "rotate-180" : ""
                    }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {openFAQIndex === i && (
                  <div className="pb-4 px-2 text-gray-600">{faq.answer}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-12 bg-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-3xl font-semibold text-center mb-8"
            id="contact-info"
          >
            Support Contact Information
          </h2>
          <div className="text-center sm:text-left space-y-4 sm:space-y-6">
            <p>
              <strong>Email:</strong>{" "}
              <a
                href={`mailto:${
                  contactInfo.email || "support@printzetlabs.com"
                }`}
                className="text-blue-600 hover:underline"
              >
                {contactInfo.email || "support@printzetlabs.com"}
              </a>
            </p>
            <p>
              <strong>Phone:</strong>{" "}
              <a
                href={`tel:${contactInfo.phone || "+91-8778253200"}`}
                className="text-blue-600 hover:underline"
              >
                {contactInfo.phone || "+91-8778253200"}
              </a>
            </p>
            <p>
              <strong>Office Hours:</strong>{" "}
              {contactInfo.officeHours || "Mon-Fri, 9:00 AM - 5:00 PM"}
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default SupportPage;

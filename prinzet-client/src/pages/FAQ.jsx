import { useState } from "react";

const faqs = [
  {
    question: "What types of printing services do you offer?",
    answer: "We provide document printing, book printing, visiting cards, posters, certificates, and more.",
  },
  {
    question: "How long does it take to process an order?",
    answer: "Orders are typically processed within 24-48 hours, depending on the type and quantity of prints.",
  },
  {
    question: "Do you offer bulk order discounts?",
    answer: "Yes, we provide discounts for bulk orders. Contact us for a custom quote.",
  },
];

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-gray-50 py-16 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>
        <p className="text-gray-600 text-lg">Find answers to common questions below.</p>
      </div>

      <div className="max-w-3xl mx-auto mt-10 space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border border-gray-300 rounded-lg p-5 bg-white shadow-md">
            <button
              className="w-full flex justify-between items-center text-left text-lg font-semibold"
              onClick={() => toggleFAQ(index)}
            >
              {faq.question}
              <span>{openIndex === index ? "▲" : "▼"}</span>
            </button>
            {openIndex === index && <p className="text-gray-600 mt-2">{faq.answer}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQs;

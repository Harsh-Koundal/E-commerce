// Contact Page
const Contact = () => {
    return (
      <div className="bg-gray-50 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">Get in Touch</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Have a question or need a custom quote? Fill out the form below or reach out to us directly.
          </p>
        </div>
        <div className="max-w-4xl mx-auto mt-12 bg-white shadow-lg rounded-lg p-8">
          <form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input type="text" placeholder="Your Name" className="w-full p-3 border rounded-lg" required />
              <input type="email" placeholder="Your Email" className="w-full p-3 border rounded-lg" required />
            </div>
            <textarea
              placeholder="Your Message"
              className="w-full p-3 border rounded-lg mt-6"
              rows="5"
              required
            ></textarea>
            <button className="mt-6 w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition">
              Send Inquiry
            </button>
          </form>
        </div>
        <div className="max-w-4xl mx-auto mt-12 text-center">
          <h3 className="text-2xl font-semibold text-gray-800">Contact Us Directly</h3>
          <p className="text-gray-600 mt-4 text-lg">📞 Phone: <a href="tel:+918778253200" className="text-blue-600">+91 9395947730</a></p>
          <p className="text-gray-600 text-lg">📧 Email: <a href="mailto:info@printzet.com" className="text-blue-600">info@printzet.com</a></p>
        </div>
      </div>
    );
  };
  
  export default Contact;
  
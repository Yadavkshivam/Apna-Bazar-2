import { useState } from "react";
import { motion } from "framer-motion";
import emailjs from "emailjs-com";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "Shivam Yadav",
    email: "shivamyadavxiimaths@gmail.com",
    message: ""
  });

  const [status, setStatus] = useState(null);
  const [isSuccess, setIsSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, message: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await emailjs.send(
        "service_4lc11kc",
        "template_nmv38eb",
        {
          name: formData.name,
          email: formData.email,
          message: formData.message,
          title: "New Message"
        },
        "zgH_aKjK58x-ztVZ4"
      );
      setIsSuccess(true);
      setStatus("Message sent successfully!");
      setFormData({ ...formData, message: "" });
    } catch (error) {
      console.log(error);
      setIsSuccess(false);
      setStatus("Failed to send message. Try again later.");
    }

    setIsLoading(false);
    setTimeout(() => setStatus(null), 4000);
  };

  return (
    <motion.section
      id="contact"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen flex items-center justify-center px-4 py-20 bg-black text-white"
    >
      <div className="w-full max-w-xl bg-gradient-to-br from-blue-800/30 to-green-700/10 p-8 rounded-2xl shadow-xl border border-white/10 backdrop-blur">
        <h2 className="text-3xl font-bold text-blue-400 mb-2 text-center">Get in Touch</h2>
        <p className="text-gray-400 text-sm mb-6 text-center">
          I&apos;d love to hear from you. Send me a message!
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold mb-1">Name</label>
            <input
              id="name"
              name="name"
              value={formData.name}
              readOnly
              className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-700 cursor-not-allowed"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold mb-1">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              readOnly
              className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-700 cursor-not-allowed"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-semibold mb-1">Message</label>
            <textarea
              id="message"
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your message here..."
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold py-3 rounded-xl transition duration-300 shadow-lg hover:shadow-cyan-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading && (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            )}
            {isLoading ? "Sending..." : "Send Message"}
          </button>
        </form>

        {status && (
          <div
            className={`mt-4 text-center text-sm font-medium px-4 py-2 rounded-lg transition duration-300 ${
              isSuccess ? "text-green-300 bg-green-800/20" : "text-red-300 bg-red-800/20"
            }`}
          >
            {status}
          </div>
        )}
      </div>
    </motion.section>
  );
}

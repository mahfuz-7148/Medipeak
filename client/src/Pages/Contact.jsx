import React from 'react';

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-[60vh]">
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
        <header>
          <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-white">Contact Us</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl">
            Questions, feedback, or partnership inquiries? Send us a message and we’ll get back to you.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="p-5 rounded-xl border dark:border-neutral-700 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-1">Address</h3>
              <p className="text-gray-600 dark:text-gray-300">123 Health Ave, Wellness City</p>
            </div>
            <div className="p-5 rounded-xl border dark:border-neutral-700 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-1">Support</h3>
              <p className="text-gray-600 dark:text-gray-300">support@medipeak.app</p>
            </div>
            <div className="p-5 rounded-xl border dark:border-neutral-700 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-1">Working Hours</h3>
              <p className="text-gray-600 dark:text-gray-300">Mon - Fri: 9:00 AM - 6:00 PM</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 rounded-xl border dark:border-neutral-700 shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
              <input type="text" required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input type="email" required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="john@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
              <textarea rows="5" required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Write your message here..."></textarea>
            </div>
            <button type="submit" className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold hover:from-blue-600 hover:to-blue-800 transition-colors">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;

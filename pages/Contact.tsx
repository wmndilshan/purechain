
import React, { useState } from 'react';
import { api } from '../services/googleSheetAPI';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError(null);
      setSuccess(false);

      // Submit to Google Sheets
      await api.submitContact({
        email: formData.email,
        message: `Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone || 'Not provided'}\n\nMessage:\n${formData.message}`
      });

      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });

      // Auto-hide success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      setError(err.message || 'Failed to send message. Please try again.');
      console.error('Error submitting contact form:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#fcf8ff] min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-24">
          <h1 className="text-5xl font-bold nature-green mb-4">Contact</h1>
          <p className="text-gray-500">We'd love to hear from you. Whether you have a question about our farming practices or our products.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-24">
          {/* Reach Us */}
          <div>
            <h2 className="text-3xl font-bold nature-green mb-10">Reach Us</h2>
            <div className="bg-white rounded-3xl p-2 mb-10 shadow-xl overflow-hidden grayscale contrast-125 border border-gray-100">
              {/* Map Placeholder */}
              <div className="h-80 bg-gray-200 flex items-center justify-center relative">
                <img src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=600" alt="Map Placeholder" className="w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white px-4 py-2 rounded-full shadow-lg font-bold text-green-700">Havelock City, Colombo 05</div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <div>
                  <h4 className="font-bold nature-green mb-1">Our Location</h4>
                  <p className="text-gray-600">450, Havelock City Mall, Colombo 05</p>
                </div>
              </div>
              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                </div>
                <div>
                  <h4 className="font-bold nature-green mb-1">Phone</h4>
                  <p className="text-gray-600">+94 11 255 6897</p>
                </div>
              </div>
              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <div>
                  <h4 className="font-bold nature-green mb-1">Email</h4>
                  <p className="text-gray-600">info@purechain.lk</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white p-12 rounded-[40px] shadow-2xl border border-gray-50">
            <h2 className="text-3xl font-bold nature-green mb-8">Send Us a Message</h2>

            {/* Success Message */}
            {success && (
              <div className="mb-6 bg-green-50 border-2 border-green-200 rounded-xl p-4 flex items-center space-x-3">
                <svg className="w-6 h-6 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-green-800 font-semibold">Thank you! Your message has been sent successfully.</span>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-center space-x-3">
                <svg className="w-6 h-6 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-800">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Your Name</label>
                <input
                  type="text"
                  required
                  disabled={submitting}
                  className="w-full bg-gray-50 border-0 rounded-xl px-4 py-4 focus:ring-2 focus:ring-green-500 transition-all disabled:opacity-50"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Your Email</label>
                <input
                  type="email"
                  required
                  disabled={submitting}
                  className="w-full bg-gray-50 border-0 rounded-xl px-4 py-4 focus:ring-2 focus:ring-green-500 transition-all disabled:opacity-50"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  disabled={submitting}
                  className="w-full bg-gray-50 border-0 rounded-xl px-4 py-4 focus:ring-2 focus:ring-green-500 transition-all disabled:opacity-50"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                <textarea
                  rows={4}
                  required
                  disabled={submitting}
                  className="w-full bg-gray-50 border-0 rounded-xl px-4 py-4 focus:ring-2 focus:ring-green-500 transition-all disabled:opacity-50"
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-yellow-400 text-gray-900 py-4 rounded-xl font-bold text-lg hover:bg-yellow-500 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Sending...</span>
                  </>
                ) : (
                  <span>Send Message</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

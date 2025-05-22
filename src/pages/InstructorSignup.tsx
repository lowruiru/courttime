import React, { useState } from "react";
import { Link } from "react-router-dom";

const InstructorSignup: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow mt-10">
      <h2 className="text-2xl font-semibold text-center text-tennis-green mb-4">Instructor Sign Up</h2>
      {!submitted ? (
        <form id="instructor-signup-form" onSubmit={handleSubmit}>
          <label htmlFor="name" className="block mt-4 text-tennis-green text-sm">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            autoComplete="name"
            className="w-full border border-tennis-green rounded px-3 py-2 mt-1 text-sm"
          />

          <label htmlFor="email" className="block mt-4 text-tennis-green text-sm">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            autoComplete="email"
            className="w-full border border-tennis-green rounded px-3 py-2 mt-1 text-sm"
          />

          <button
            type="submit"
            className="mt-6 w-full py-2 bg-tennis-green text-white rounded hover:bg-green-700 text-base"
          >
            Sign Up
          </button>
        <div className="mt-4 w-full">
            <Link
              to="/"
              className="block text-center px-4 py-2 border border-tennis-green text-tennis-green rounded hover:bg-tennis-green hover:text-white transition"
            >
              Back to Homepage
            </Link>
          </div>
        </form>
      ) : (
        <div className="text-tennis-green text-center mt-6">
          Thank you for signing up! We will contact you soon.
          <div className="mt-6">
            <Link
              to="/"
              className="inline-block px-4 py-2 border border-tennis-green text-tennis-green rounded hover:bg-tennis-green hover:text-white transition"
            >
              Back to Homepage
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorSignup;
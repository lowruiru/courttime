
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import React, { useState } from "react";

// Modal component for instructor sign up
const InstructorSignupModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-tennis-green text-xl"
          aria-label="Close"
        >
          &times;
        </button>
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
          </form>
        ) : (
          <div className="text-tennis-green text-center mt-6">
            Thank you for signing up! We will contact you soon.
          </div>
        )}
      </div>
    </div>
  );
};

const Header = () => {
  const [showSignup, setShowSignup] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm py-2">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-1">
          <div className="h-6 w-6 flex items-center justify-center rounded-full bg-tennis-yellow">
            <span className="text-black font-bold text-xs">T</span>
          </div>
          <span className="text-sm font-bold text-tennis-green">Court Time</span>
        </Link>
        <Button
          variant="outline"
          size="sm"
          className="border-tennis-green text-tennis-green hover:bg-tennis-green hover:text-white text-xs h-7 relative z-50"
          onClick={() => setShowSignup(true)}
        >
          List your classes with us
        </Button>
        <InstructorSignupModal open={showSignup} onClose={() => setShowSignup(false)} />
      </div>
    </header>
  );
};

export default Header;

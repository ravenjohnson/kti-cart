import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../CartContext';

export default function Layout({ children }) {
  const location = useLocation();
  const { cartCount } = useCart();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-gray-900">
              Iceland Travel Checkout
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                to="/tours"
                className={`text-sm font-medium transition-colors ${
                  isActive('/tours')
                    ? 'text-blue-600'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                Tours & Packages
              </Link>
              <Link
                to="/activities"
                className={`text-sm font-medium transition-colors ${
                  isActive('/activities')
                    ? 'text-blue-600'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                Activities
              </Link>
              <Link
                to="/hotels"
                className={`text-sm font-medium transition-colors ${
                  isActive('/hotels')
                    ? 'text-blue-600'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                Hotels
              </Link>
              <Link
                to="/car-rentals"
                className={`text-sm font-medium transition-colors ${
                  isActive('/car-rentals')
                    ? 'text-blue-600'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                Car Rentals
              </Link>
            </nav>

            {/* Cart Icon */}
            <Link
              to="/checkout"
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <svg
                className="h-5 w-5 mr-2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Cart
              {cartCount > 0 && (
                <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-600 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Navigation */}
          <nav className="md:hidden flex items-center space-x-4 mt-4">
            <Link
              to="/tours"
              className={`text-sm font-medium transition-colors ${
                isActive('/tours') ? 'text-blue-600' : 'text-gray-700'
              }`}
            >
              Tours
            </Link>
            <Link
              to="/activities"
              className={`text-sm font-medium transition-colors ${
                isActive('/activities') ? 'text-blue-600' : 'text-gray-700'
              }`}
            >
              Activities
            </Link>
            <Link
              to="/hotels"
              className={`text-sm font-medium transition-colors ${
                isActive('/hotels') ? 'text-blue-600' : 'text-gray-700'
              }`}
            >
              Hotels
            </Link>
            <Link
              to="/car-rentals"
              className={`text-sm font-medium transition-colors ${
                isActive('/car-rentals') ? 'text-blue-600' : 'text-gray-700'
              }`}
            >
              Car Rentals
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
}

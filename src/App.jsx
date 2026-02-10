import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './CartContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Hotels from './pages/Hotels';
import Activities from './pages/Activities';
import Tours from './pages/Tours';
import TourDetail from './pages/TourDetail';
import CarRentals from './pages/CarRentals';
import CarRentalDetail from './pages/CarRentalDetail';
import ActivityDetail from './pages/ActivityDetail';
import Checkout from './pages/Checkout';

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes with Layout */}
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />
          <Route
            path="/hotels"
            element={
              <Layout>
                <Hotels />
              </Layout>
            }
          />
          <Route
            path="/activities"
            element={
              <Layout>
                <Activities />
              </Layout>
            }
          />
          <Route
            path="/tours"
            element={
              <Layout>
                <Tours />
              </Layout>
            }
          />
          {/* Activity detail - full screen, custom header */}
          <Route path="/activities/:activityId" element={<ActivityDetail />} />

          {/* Tour detail - full screen, custom header */}
          <Route path="/tours/:tourId" element={<TourDetail />} />

          <Route
            path="/car-rentals"
            element={
              <Layout>
                <CarRentals />
              </Layout>
            }
          />

          {/* Car rental detail - full screen, custom header */}
          <Route path="/car-rentals/:carId" element={<CarRentalDetail />} />

          {/* Checkout route - full screen, no layout wrapper */}
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

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
          <Route
            path="/activities/:activityId"
            element={
              <Layout>
                <ActivityDetail />
              </Layout>
            }
          />
          <Route
            path="/tours/:tourId"
            element={
              <Layout>
                <TourDetail />
              </Layout>
            }
          />
          <Route
            path="/car-rentals"
            element={
              <Layout>
                <CarRentals />
              </Layout>
            }
          />
          <Route
            path="/car-rentals/:carId"
            element={
              <Layout>
                <CarRentalDetail />
              </Layout>
            }
          />

          {/* Checkout route - full screen, no layout wrapper */}
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

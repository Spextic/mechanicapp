'use client';

import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button"

function formatCart(cart: string) {
  try {
    const parsedCart = JSON.parse(cart);

    const performance = parsedCart.performance
      ? Object.entries(parsedCart.performance)
          .map(([key, value]: [string, any]) => `${key}: ${value.desc} (${value.price})`)
          .join(', ')
      : 'N/A';

    const respray = parsedCart.respray
      ? Object.entries(parsedCart.respray)
          .map(([key, value]: [string, any]) => `${key}: ${value.price}`)
          .join(', ')
      : 'N/A';

    return (
      <>
        <p><strong>Performance:</strong> {performance}</p>
        <p><strong>Respray:</strong> {respray}</p>
      </>
    );
  } catch (error) {
    console.error('Error parsing cart JSON:', error);
    return 'Invalid cart data';
  }
}


function formatInstallationProgress(progress: string) {
  try {
    const parsedProgress = JSON.parse(progress);

    const completedSections = Object.entries(parsedProgress)
      .filter(([key, value]) => value === true)
      .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1))
      .join(', ');

    return (
      <p>{completedSections || 'No installations completed'}</p>
    );
  } catch (error) {
    console.error('Error parsing installation progress JSON:', error);
    return 'Invalid installation progress data';
  }
}

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    // Fetch all orders
    fetch('/api/orders')
      .then((response) => response.json())
      .then((data) => {
        setOrders(data);
        setFilteredOrders(data);
      })
      .catch((error) => console.error('Error fetching orders:', error));
  }, []);

  useEffect(() => {
    // Filter orders based on search input
    const filtered = orders.filter((order) =>
      order.plate.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredOrders(filtered);
  }, [search, orders]);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">All Mechanic Orders</h1>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by plate"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>

        {/* Orders Table */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
          <table className="table-auto w-full text-left border-collapse border border-gray-200">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
              <tr>
                <th className="px-4 py-2 border border-gray-200">Client Name</th>
                <th className="px-4 py-2 border border-gray-200">Plate</th>
                <th className="px-4 py-2 border border-gray-200">Amount Paid</th>
                <th className="px-4 py-2 border border-gray-200">Cart</th>
                <th className="px-4 py-2 border border-gray-200">Installation Progress</th>
                <th className="px-4 py-2 border border-gray-200">Fulfilled</th>
                <th className="px-4 py-2 border border-gray-200">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="px-4 py-2 border border-gray-200">{order.full_name}</td>
                  <td className="px-4 py-2 border border-gray-200">{order.plate}</td>
                  <td className="px-4 py-2 border border-gray-200">${order.amount_paid.toLocaleString()}</td>
                  <td className="px-4 py-2 border border-gray-200">
                    {/* Tooltip for Cart */}
                    <div className="relative group">
                      <Button>Hover</Button>
                      <div className="absolute z-10 hidden w-64 p-4 bg-white border border-gray-300 rounded shadow-lg dark:bg-gray-700 dark:border-gray-600 group-hover:block">
                        {formatCart(order.cart)}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2 border border-gray-200">
                    {/* Tooltip for Installation Progress */}
                    <div className="relative group">
                    <Button>Hover</Button>
                      <div className="absolute z-10 hidden w-64 p-4 bg-white border border-gray-300 rounded shadow-lg dark:bg-gray-700 dark:border-gray-600 group-hover:block">
                        {formatInstallationProgress(order.installation_progress)}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2 border border-gray-200">{order.fulfilled ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-2 border border-gray-200">
                    {new Date(order.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;

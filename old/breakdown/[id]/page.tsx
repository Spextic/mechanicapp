'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const Home = () => {
  const [data, setData] = useState([]);
  const router = useRouter(); // Initialize the router

  useEffect(() => {
    fetch('/api/data')
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      {/* Header */}
      <header className="bg-blue-600 text-white py-4 shadow-md">
        <div className="container mx-auto flex items-center justify-between px-4">
          <h1 className="text-xl font-bold">Mechanic Payments Dashboard</h1>
          <p className="text-sm">Welcome to the admin panel</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Mechanic Payment Records</h2>
          </div>
          <Table>
            <TableCaption>A list of mechanic payment records.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Firstname</TableHead>
                <TableHead>Lastname</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={row.identifier || index}>
                  <TableCell>{row.firstname}</TableCell>
                  <TableCell>{row.lastname}</TableCell>
                  <TableCell>${row.money.toLocaleString()}</TableCell>
                  <TableCell>
                    <button
                      className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
                      onClick={() => router.push(`/breakdown/${row.identifier}`)}
                    >
                      View Breakdown
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
};

export default Home;

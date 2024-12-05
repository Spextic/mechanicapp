'use client';

import React, { useEffect, useState } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Layout from '@/components/Layout';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

function formatCart(cart: string) {
    try {
        const parsedCart = JSON.parse(cart);

        // Function to format nested items
        const formatNestedItems = (obj: any) =>
            Object.entries(obj)
                .map(([key, value]: [string, any]) =>
                    value.desc && value.price
                        ? `${key}: ${value.desc} (${value.price})`
                        : value.price
                            ? `${key}: ${value.price}`
                            : `${key}: N/A`
                )
                .join(', ');

        const result = Object.entries(parsedCart)
            .map(([category, items]: [string, any]) => {
                if (typeof items === "object" && items !== null) {
                    const formattedItems = formatNestedItems(items);
                    return `<p><strong>${category}:</strong> ${formattedItems}</p>`;
                }
                return `<p><strong>${category}:</strong> Invalid data</p>`;
            })
            .join('');

        return <div dangerouslySetInnerHTML={{ __html: result }} />;
    } catch (error) {
        console.error('Error parsing cart JSON:', error);
        return <p>Invalid cart data</p>;
    }
}



function formatInstallationProgress(progress: string | null | undefined) {
    // Handle null or undefined progress
    if (!progress) {
        return <p>No installation progress available</p>;
    }

    try {
        const parsedProgress = JSON.parse(progress);

        const completedSections = Object.entries(parsedProgress)
            .filter(([key, value]) => value === true) // Check if the value is `true`
            .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1)) // Capitalize keys
            .join(', ');

        return (
            <p>{completedSections || 'No installations completed'}</p>
        );
    } catch (error) {
        console.error('Error parsing installation progress JSON:', error);
        return <p>Invalid installation progress data</p>;
    }
}


const worksOrderPage = () => {
    const [orders, setOrders] = useState([]); // All orders
    const [search, setSearch] = useState(''); // Search input
    const [filteredOrders, setFilteredOrders] = useState([]); // Filtered orders

    useEffect(() => {
        // Fetch all orders
        fetch('/api/orders')
            .then((response) => response.json())
            .then((data) => {
                setOrders(data);
                setFilteredOrders(data); // Initially set filteredOrders to all orders
            })
            .catch((error) => console.error('Error fetching orders:', error));
    }, []);

    useEffect(() => {
        // Filter orders whenever `search` changes
        if (!search.trim()) {
            setFilteredOrders(orders); // Reset to all orders if search is empty
        } else {
            const filtered = orders.filter(order =>
                order.plate.toLowerCase().includes(search.toLowerCase()) || // Match by plate
                order.customer_name.toLowerCase().includes(search.toLowerCase()) // Match by client name
            );
            setFilteredOrders(filtered);
        }
    }, [search, orders]);

    return (
        <Layout>
            <h1>Welcome to the Home Page</h1>
            {/* Search Bar */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search by plate or client name"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
                />
            </div>

            {/* Orders Table */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Client Name</TableHead>
                            <TableHead>Plate</TableHead>
                            <TableHead>Amount Paid</TableHead>
                            <TableHead>Cart</TableHead>
                            <TableHead>Installation Progress</TableHead>
                            <TableHead>Fulfilled</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Done By</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredOrders.map((order, index) => (
                            <TableRow key={index}>
                                <TableCell>{order.customer_name}</TableCell>
                                <TableCell>{order.plate}</TableCell>
                                <TableCell>${order.amount_paid.toLocaleString()}</TableCell>
                                <TableCell>
                                    <div className="relative group">
                                        <Popover>
                                            <PopoverTrigger>Open</PopoverTrigger>
                                            <PopoverContent>{formatCart(order.cart)}</PopoverContent>
                                        </Popover>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="relative group">
                                        <Popover>
                                            <PopoverTrigger>Open</PopoverTrigger>
                                            <PopoverContent>{formatInstallationProgress(order.installation_progress)}</PopoverContent>
                                        </Popover>
                                    </div>
                                </TableCell>
                                <TableCell>{order.fulfilled ? "Yes" : "No"}</TableCell>
                                <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                                <TableCell>{order.done_by_name}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </Layout>
    );
};

export default worksOrderPage;

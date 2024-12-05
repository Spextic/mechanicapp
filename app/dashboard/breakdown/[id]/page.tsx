"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

function formatCart(cart: string) {
  try {
    const parsedCart = JSON.parse(cart);

    const performance = parsedCart.performance
      ? Object.entries(parsedCart.performance)
          .map(([key, value]: [string, any]) => `${key}: ${value.desc}`)
          .join(", ")
      : "N/A";

    const respray = parsedCart.respray
      ? Object.entries(parsedCart.respray)
          .map(([key, value]: [string, any]) => `${key}`)
          .join(", ")
      : "N/A";

    return (
      <>
        <p>
          <strong>Performance:</strong> {performance}
        </p>
        <p>
          <strong>Respray:</strong> {respray}
        </p>
      </>
    );
  } catch (error) {
    console.error("Error parsing cart JSON:", error);
    return "Invalid cart data";
  }
}

const BreakdownPage = () => {
  const params = useParams();
  const id = decodeURIComponent(params.id); // Decode URL-encoded id (e.g., `%3A` -> `:`)
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/employee/${encodeURIComponent(id)}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchData();
  }, [id]);

  if (error) {
    return (
      <Layout>
        <p className="text-red-500">Error: {error}</p>
      </Layout>
    );
  }

  if (!data) {
    return (
      <Layout>
        <p>Loading...</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1>Mechanic Order Details</h1>

      <Table>
        <TableCaption>A list of mechanic payment records.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead width="30%">Name</TableHead>
            <TableHead width="30%">Plate</TableHead>
            <TableHead width="15%">Amount</TableHead>
            <TableHead width="10%">Mods Applied</TableHead>
            <TableHead width="15%">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.isArray(data) && data.length > 0 ? (
            data.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.done_by_name}</TableCell>
                <TableCell>{row.plate}</TableCell>
                <TableCell>{row.amount_paid}</TableCell>
                <TableCell>
                  <div className="relative group">
                    <Button>Hover</Button>
                    <div className="absolute z-10 hidden w-64 p-4 bg-white border border-gray-300 rounded shadow-lg group-hover:block">
                      {formatCart(row.cart)}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{row.date}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No records found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Layout>
  );
};

export default BreakdownPage;

"use client";

import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { useRouter } from "next/navigation";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

ChartJS.register(ArcElement, Tooltip, Legend);

const HomePage = () => {
    const [data, setData] = useState([]); // For the rows
    const [totals, setTotals] = useState({}); // For the totals
    const [dataPie, setDataPie] = useState({
        labels: [],
        datasets: [
            {
                label: "Money Distribution",
                data: [],
                backgroundColor: [],
                hoverOffset: 4,
            },
        ],
    });
    const router = useRouter();

    useEffect(() => {
        fetch("/api/data")
            .then((response) => response.json())
            .then(({ rows, totals }) => {
                console.log("Data fetched:", rows);
                console.log("Totals fetched:", totals);

                setData(rows);
                setTotals(totals);

                console.log(totals);

                // Generate dataPie from the fetched rows
                const labels = rows.map((row) => `${row.firstname} ${row.lastname}`);
                const chartData = rows.map((row) => row.money);

                const backgroundColor = rows.map(
                    (_, index) => `hsl(${(index / rows.length) * 360}, 70%, 50%)` // Generate distinct colors
                );

                setDataPie({
                    labels,
                    datasets: [
                        {
                            label: "Money Distribution",
                            data: chartData,
                            backgroundColor,
                            hoverOffset: 4,
                        },
                    ],
                });
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    return (
        <Layout>
            <h1>Welcome to the Employees Page</h1>

            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-4 flex justify-center items-center">
                    <Pie data={dataPie} />
                </div>
                <div className="col-span-4 flex justify-center items-center">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Business Info</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>Total Sales</TableCell>
                                <TableCell>${totals[0] ? Number(totals[0].totalSales).toLocaleString() : "N/A"}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Total Pays</TableCell>
                                <TableCell>${totals[0] ? Number(totals[0].totalPays).toLocaleString() : "N/A"}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Total COGs</TableCell>
                                <TableCell>${totals[0] ? Number(totals[0].totalCOGs).toLocaleString() : "N/A"}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Total EBT</TableCell>
                                <TableCell>
                                    ${
                                        totals[0]
                                            ? (
                                                Number(totals[0].totalSales) -
                                                (Number(totals[0].totalPays) + Number(totals[0].totalCOGs))
                                            ).toLocaleString()
                                            : "N/A"
                                    }
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Total Tax Bill</TableCell>
                                <TableCell>
                                    ${
                                        totals[0]
                                            ? (
                                                0.4 *
                                                (
                                                    Number(totals[0].totalSales) -
                                                    (Number(totals[0].totalPays) + Number(totals[0].totalCOGs))
                                                )
                                            ).toLocaleString()
                                            : "N/A"
                                    }
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Net Profit</TableCell>
                                <TableCell>
                                    ${
                                        totals[0]
                                            ? (
                                                (Number(totals[0].totalSales) -
                                                    (Number(totals[0].totalPays) + Number(totals[0].totalCOGs))) -
                                                0.4 *
                                                (Number(totals[0].totalSales) -
                                                    (Number(totals[0].totalPays) + Number(totals[0].totalCOGs)))
                                            ).toLocaleString()
                                            : "N/A"
                                    }
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
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
                                    onClick={() => router.push(`/breakdown/breakdown/${row.identifier}`)}
                                >
                                    View Breakdown
                                </button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Layout>
    );
};

export default HomePage;

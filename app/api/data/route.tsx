import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET() {
    const db = await mysql.createConnection({
        host: process.env.DB_HOST,       // Use environment variables
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });
    

    try {
        const [rows] = await db.execute(`
            SELECT
                mechanic.identifier,
                mechanic.money,
                u.firstname,
                u.lastname
            FROM
                mechanic_pays AS mechanic
            JOIN
                users AS u
            ON
                mechanic.identifier = u.identifier
            ORDER BY 
                mechanic.money DESC;
        `);

        const [totals] = await db.execute(`
            SELECT
                (SELECT SUM(amount_paid) FROM mechanic_orders) AS totalSales,
                (SELECT SUM(money) FROM mechanic_pays) AS totalPays,
                (SELECT SUM(amount_paid) / 2 FROM mechanic_orders) AS totalCOGs;
        `);
        return NextResponse.json({ rows, totals });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        await db.end();
    }
}

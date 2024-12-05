import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET(request: Request, context: { params: { id: string } }) {
  const params = await context.params; // Await params to resolve the Promise
  const id = params.id; // Now safely access id

  const db = await mysql.createConnection({
    host: process.env.DB_HOST,       // Use environment variables
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    const [rows] = await db.execute(
      `SELECT
        o.*,
        CONCAT(u.firstname, ' ', u.lastname) AS done_by_name
      FROM 
        mechanic_orders AS o
      LEFT JOIN 
        users AS u
      ON 
        o.done_by = u.identifier
      WHERE 
        o.done_by = ?;`,
      [id]
    );
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await db.end();
  }
}
import mysql from 'mysql2/promise';

export async function GET(req: Request) {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST,       // Use environment variables
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    const [orders] = await db.execute(`
    SELECT 
        o.identifier AS customer_identifier,
        CONCAT(u.firstname, ' ', u.lastname) AS customer_name, -- Name of the customer
        o.plate,
        o.amount_paid,
        o.cart,
        o.installation_progress,
        o.fulfilled,
        o.date,
        o.done_by,
        CONCAT(d.firstname, ' ', d.lastname) AS done_by_name -- Name of the person who completed the task
    FROM 
        mechanic_orders AS o
    JOIN 
        users AS u
    ON 
        o.identifier = u.identifier -- Join to get customer details
    LEFT JOIN 
        users AS d
    ON 
        o.done_by = d.identifier; -- Join to get done_by details
`);

    return new Response(JSON.stringify(orders), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  } finally {
    await db.end();
  }
}

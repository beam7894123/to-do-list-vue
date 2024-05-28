const fs = require('fs');
const path = require('path');
const pool = require('./db.js');

async function createTable() {
  let connection;
  try {
    // Read SQL file
    const sql = fs.readFileSync(path.join(__dirname, 'table.sql'), 'utf8');

    // Establish a database connection
    connection = await pool.getConnection();

    // Split SQL into separate statements
    const queries = sql.split(/;\s*$/m);

    // Loop execute each query in the SQL file
    for (const query of queries) {
      if (query.trim()) {
        await connection.query(query);
      }
    }

    console.log('Database and tables created successfully!');
  } catch (err) {
    console.error('Error creating tables:', err);
  } finally {
    if (connection) connection.release();
    process.exit(0)
  }
}


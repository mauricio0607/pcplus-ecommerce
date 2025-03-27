import bcrypt from 'bcryptjs';
import pg from 'pg';
const { Client } = pg;

async function createUsers() {
  // Connect to the database using the environment variables
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('Connected to the database');

    // Create admin user if it doesn't exist
    const checkAdminResult = await client.query(
      'SELECT * FROM users WHERE email = $1',
      ['admin@pcplus.com.br']
    );

    if (checkAdminResult.rows.length === 0) {
      // Generate hashed password
      const adminSalt = await bcrypt.genSalt(10);
      const adminHashedPassword = await bcrypt.hash('admin123', adminSalt);

      // Insert admin user
      const insertAdminResult = await client.query(
        'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4) RETURNING id',
        ['admin@pcplus.com.br', adminHashedPassword, 'Administrador', 'admin']
      );

      console.log(`Admin user created with ID: ${insertAdminResult.rows[0].id}`);
    } else {
      console.log('Admin user already exists');
    }

    // Create customer user if it doesn't exist
    const checkCustomerResult = await client.query(
      'SELECT * FROM users WHERE email = $1',
      ['cliente@exemplo.com.br']
    );

    if (checkCustomerResult.rows.length === 0) {
      // Generate hashed password
      const customerSalt = await bcrypt.genSalt(10);
      const customerHashedPassword = await bcrypt.hash('cliente123', customerSalt);

      // Insert customer user
      const insertCustomerResult = await client.query(
        'INSERT INTO users (email, password, name, phone, document, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
        ['cliente@exemplo.com.br', customerHashedPassword, 'Cliente Teste', '(62) 99999-8888', '123.456.789-10', 'customer']
      );

      console.log(`Customer user created with ID: ${insertCustomerResult.rows[0].id}`);
    } else {
      console.log('Customer user already exists');
    }
  } catch (error) {
    console.error('Error creating users:', error);
  } finally {
    await client.end();
    console.log('Database connection closed');
  }
}

createUsers();
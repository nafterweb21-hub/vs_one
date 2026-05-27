const { Client } = require('pg');

async function testConnection(password) {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: password,
    database: 'postgres'
  });
  
  try {
    await client.connect();
    console.log(`SUCCESS with password: ${password}`);
    
    // Check if vision_one_erp exists
    const res = await client.query("SELECT datname FROM pg_database WHERE datname = 'vision_one_erp'");
    if (res.rows.length === 0) {
        console.log("Database vision_one_erp does not exist, creating it...");
        await client.query('CREATE DATABASE vision_one_erp');
        console.log("Database created.");
    } else {
        console.log("Database vision_one_erp already exists.");
    }
    
    await client.end();
    return true;
  } catch (err) {
    console.log(`Failed with password: ${password} - ${err.message}`);
    return false;
  }
}

async function run() {
  const passwords = ['', 'postgres', 'password', 'root', '123456', 'mysecretpassword'];
  for (const pw of passwords) {
    const success = await testConnection(pw);
    if (success) {
      console.log(`Please use this DATABASE_URL: postgresql://postgres:${pw}@localhost:5432/vision_one_erp?schema=public`);
      return;
    }
  }
  console.log("Could not guess the PostgreSQL password.");
}

run();

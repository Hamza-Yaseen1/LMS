import mysql, { Connection } from 'mysql2/promise';

let connection: Connection | null = null;

export const createConnection = async (): Promise<Connection> => {
  if (!connection) {
    connection = await mysql.createConnection({
      host: process.env.DATABASE_HOST as string,
      user: process.env.DATABASE_USER as string,
      password: process.env.DATABASE_PASSWORD as string,
      database: process.env.DATABASE_NAME as string,
    });
  }
  return connection;
};

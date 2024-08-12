import express from 'express';
import cors from 'cors';
import rootRouter from './routes/index';
import { PrismaClient } from '@prisma/client';


const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use('/api/v1', rootRouter);

async function startServer(): Promise<void> {
  try {
    // Example usage of Prisma client to ensure connection
    await prisma.$connect();
    console.log('Connected to Database');
    app.listen(5000, () => console.log('Listening on port 5000...'));
  } catch (error) {
    console.error('Error connecting to the database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

startServer();

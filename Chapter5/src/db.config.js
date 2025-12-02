// src\db.config.js
import { PrismaClient } from '@prisma/client';
import dotenv from "dotenv";

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

export const prisma = new PrismaClient({
    log: ["query"],
});
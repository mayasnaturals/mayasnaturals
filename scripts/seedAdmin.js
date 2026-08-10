import mongoose from "mongoose";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import crypto from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Manually parse .env
const envPath = resolve(__dirname, "../.env");
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, "utf-8").split("\n");
  for (const line of envConfig) {
    const [key, ...values] = line.split("=");
    if (key && values.length > 0) {
      process.env[key.trim()] = values.join("=").trim();
    }
  }
}

import AdminUser from "../models/AdminUser.js";
import { hashPassword } from "../lib/auth-utils.js";

async function seed() {
  const MONGO_URL = process.env.MONGO_URL;
  if (!MONGO_URL) {
    console.error("MONGO_URL not found in .env");
    process.exit(1);
  }

  await mongoose.connect(MONGO_URL);
  console.log("Connected to DB");

  const usersToSeed = [
    { username: "mackie123", password: "sobjantachodna" },
    { username: "sam679", password: "bunip679" }
  ];

  for (const user of usersToSeed) {
    const existing = await AdminUser.findOne({ username: user.username });
    if (!existing) {
      const hashed = hashPassword(user.password);
      await AdminUser.create({ username: user.username, password: hashed });
      console.log(`Created admin user: ${user.username}`);
    } else {
      console.log(`Admin user ${user.username} already exists`);
    }
  }

  console.log("Seeding done");
  process.exit(0);
}

seed();

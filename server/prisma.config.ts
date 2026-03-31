import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "./prisma/schema.prisma",

  migrations: {
    path: "./prisma/migrations",
  },

  // Neon ke liye migrations/db push ke liye DIRECT_URL best hai
  datasource: {
    url: env("DIRECT_URL"),
  },
});
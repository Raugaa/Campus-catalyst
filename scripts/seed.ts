// seed-expanded.ts
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

const CONVEX_URL = "https://veracious-sturgeon-615.convex.cloud";
const CONVEX_DEPLOY_KEY = "dev:veracious-sturgeon-615|eyJ2MiI6IjQ1MmQzMTU0Yzg1MTQ4ZTc5M2I3MjY4ODBmNWNkYWMxIn0=";

if (!CONVEX_URL) {
  console.error("❌ Missing CONVEX_URL environment variable");
  process.exit(1);
}

const client = new ConvexHttpClient(CONVEX_URL, {
  deployKey: CONVEX_DEPLOY_KEY,
} as any);

// Helper: convert YYYY-MM-DD to timestamp (ms)
function dateTS(date: string) {
  return new Date(date).getTime();
}

async function run() {
  console.log("🌱 Starting Convex data seeding...");

  try {
    console.log("👤 Creating admin...");
    const adminResult = await client.action(api.actions.createGlobalAdmin, {
      email: "global@global.com",
      password: "global123",
      name: "Qusai Sakerwala",
      phone: "9999999988",
    });
    console.log("✅ Admin created:", adminResult.userId);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  }
}

run()
  .then(() => {
    console.log("✅ Seeding completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Seeding failed:", error);
    process.exit(1);
  });
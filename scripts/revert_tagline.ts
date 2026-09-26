import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
async function main() {
  await db.project.update({
    where: { slug: "wind-quality-prediction" },
    data: { tagline: "ML-based wind quality forecasting" },
  });
  console.log("reverted");
}
main().finally(() => db.$disconnect());

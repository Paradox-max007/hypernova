import { getPortfolioData } from "@/lib/portfolio-data";
import { PortfolioApp } from "@/components/portfolio/portfolio-app";
import type { PortfolioData } from "@/lib/types";

export const dynamic = "force-dynamic";

const EMPTY: PortfolioData = {
  projects: [],
  technologies: [],
  experience: [],
  education: [],
  certifications: [],
  settings: {},
};

export default async function Page() {
  let data: PortfolioData;
  try {
    data = await getPortfolioData();
  } catch (e) {
    console.error("Failed to load portfolio data:", e);
    data = EMPTY;
  }
  return <PortfolioApp data={data} />;
}

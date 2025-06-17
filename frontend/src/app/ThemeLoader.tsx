import { useTheme } from "../components/ThemeProvider";
import dynamic from "next/dynamic";

// Dynamically import the pro-frontend main page
const ProFrontend = dynamic(() => import("./pro-frontend/src/app/page"), { ssr: false });
// Import the current fun frontend main page
import FunFrontend from "./page";

export default function ThemeLoader() {
  const { isProfessional } = useTheme();
  return isProfessional ? <ProFrontend /> : <FunFrontend />;
}

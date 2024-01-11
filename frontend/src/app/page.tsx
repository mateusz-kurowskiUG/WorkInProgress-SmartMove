import DisplayMap from "./components/DisplayMap";
import SearchBar from "./components/SearchBar";
import RouteContextProvider from "@/contexts/route-context";
import Settings from "./components/Settings";
import StepContextProvider from "@/contexts/step-context";

export default function Home() {
  return (
    <div>
      <RouteContextProvider>
        <SearchBar />
        <StepContextProvider>
          <Settings />
        </StepContextProvider>
        <DisplayMap />
      </RouteContextProvider>
    </div>
  );
}

import DisplayMap from "./DisplayMap";
import SearchBar from "./components/SearchBar";
import RouteContextProvider from "@/contexts/route-context";
import Settings from "./components/Settings";

export default function Home() {
  return (
    <div>
      <RouteContextProvider>
        <SearchBar />
        <Settings />
        <DisplayMap />
      </RouteContextProvider>
    </div>
  );
}

import DisplayMap from "./components/DisplayMap";
import SearchBar from "./components/SearchBar";
import RouteContextProvider from "@/contexts/route-context";

export default function Home() {
  return (
    <div>
      <RouteContextProvider>
        <SearchBar />
        <DisplayMap />
      </RouteContextProvider>
    </div>
  );
}

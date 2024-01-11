import DisplayMap from "./components/DisplayMap";
import SearchBar from "./components/SearchBar";
import RouteContextProvider from "@/contexts/route-context";
import Settings from "./components/Settings";
import StepContextProvider from "@/contexts/step-context";

export default function Home() {
  return (
    <div>
      <RouteContextProvider>
        <div className="bg-neutral absolute z-10 w-full">
          <SearchBar
            defaultSearchFields={[
              {
                name: "startPoint",
                value: "",
              },
              {
                name: "endPoint",
                value: "",
              },
            ]}
          />
          <StepContextProvider>
            <Settings />
          </StepContextProvider>
        </div>

        <DisplayMap />
      </RouteContextProvider>
    </div>
  );
}

// page components
import TopComponent from "./components/TopComponent";
import MiddleComponent from "./components/MiddleComponent";
import BottomComponent from "./components/BottomComponent";

export default function Home() {
    return (
        <div className="bg-white dark:bg-[#0B1A33] flex flex-col">
            {/* page components */}
            <TopComponent />
            <MiddleComponent />
            <BottomComponent />
        </div>
    );
}
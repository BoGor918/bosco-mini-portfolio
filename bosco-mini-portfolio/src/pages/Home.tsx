// page components
import TopComponent from "../components/home/components/TopComponent";
import MiddleComponent from "../components/home/components/MiddleComponent";
import BottomComponent from "../components/home/components/BottomComponent";

export default function Home() {
    // style list
    const parentContainerStyle = "bg-white dark:bg-[#0B1A33] flex flex-col";
    
    return (
        <div className={parentContainerStyle}>
            {/* page components */}
            <TopComponent />
            <MiddleComponent />
            <BottomComponent />
        </div>
    );
}
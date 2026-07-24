// react
import { useContext, useEffect } from 'react';
// page components
import TopComponent from "../components/home/main/TopComponent";
import MiddleComponent from "../components/home/main/MiddleComponent";
import BottomComponent from "../components/home/main/BottomComponent";
// context
import { MapperContext } from '../globalVariable/MapperContextProvider';

export default function Home() {
    // context
    const { loadPortfolioData } = useContext(MapperContext);

    // load portfolio data on component mount
    useEffect(() => {
        loadPortfolioData();
    }, [loadPortfolioData]);

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
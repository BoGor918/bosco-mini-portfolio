// others
import { lazy, Suspense, useContext, useState } from 'react'
// global components
import { MapperContext } from '../../../globalVariable/MapperContextProvider';
import { getLoaderColor } from '../../../globalVariable/GlobalVariable';
import { GridLoadingPlaceholder, gridStyles } from '../grids/util';
// mantine components
import { Loader } from '@mantine/core';
// icons
import { MdOutlineWorkOutline, MdOutlineSchool } from "react-icons/md";
import { BiBookContent, BiCalendarCheck } from "react-icons/bi";
// translation
import { translationKeys } from '../../../globalVariable/Translation';

// lazy load component
const CompanyGrid = lazy(() => import('../grids/CompanyGrid'));
const EduGrid = lazy(() => import('../grids/EduGrid'));
const ProjectGrid = lazy(() => import('../grids/ProjectGrid'));
const SkillGrid = lazy(() => import('../grids/SkillGrid'));

export default function BottomComponent() {
    // translation
    const { t, theme } = useContext(MapperContext)
    const [widget, setWidget] = useState<"1" | "2" | "3" | "4">("1");
    const loaderColor = getLoaderColor(theme);

    // set nav function
    const navClicked = (value: "1" | "2" | "3" | "4") => {
        setWidget(value);
    }

    // style variable
    const mainDivStyle = "self-center w-full max-w-[365px] sm:max-w-[355px] md:max-w-[355px] lg:max-w-[910px] flex flex-col items-center justify-center font-light mb-[5rem]";
        const navDivStyle = "py-[1rem] flex flex-col justify-between items-center sticky top-[-0.1px] z-10 bg-white dark:bg-dark-blue w-full max-w-[365px] sm:max-w-[355px] md:max-w-[355px] lg:max-w-[910px]";
    const navLineDivStyle = "overflow-hidden animate-fade-up animate-delay-200 animate-once flex flex-col justify-end items-end";
        const navLineStyle = "w-[355px] sm:w-[355px] md:w-[355px] lg:w-[900px] h-[1px] bg-dark-blue/35 dark:bg-white/35";
    const navButtonDivStyle = "flex animate-fade-up animate-delay-200 animate-once";
    const navButtonStyle = "flex flex-col items-center content-center mx-5 sm:mx-5 md:mx-5 lg:mx-12";
    const navIconDivStyle = "flex items-center mt-[8px] mr-[0rem] sm:mr-[0rem] md:mr-[0rem] lg:mr-[0.4rem]";
        const selectedStyle = "opacity-100 w-[50px] sm:w-[50px] md:w-[50px] lg:w-[125px] h-[2px] bg-slate-500 dark:bg-white mt-[-0.76px] rounded-full transition duration-500 ease-in-out";
        const unSelectedStyle = "opacity-0 w-[50px] sm:w-[50px] md:w-[50px] lg:w-[125px] h-[2px] bg-gray-500 dark:bg-slate-300 mt-[-0.76px] rounded-full transition duration-500 ease-in-out";
        const selected3Style = "opacity-100 w-[50px] sm:w-[50px] md:w-[50px] lg:w-[150px] h-[2px] bg-slate-500 dark:bg-white mt-[-0.76px] rounded-full transition duration-500 ease-in-out";
        const unSelected3Style = "opacity-0 w-[50px] sm:w-[50px] md:w-[50px] lg:w-[150px] h-[2px] bg-gray-500 dark:bg-slate-300 mt-[-0.76px] rounded-full transition duration-500 ease-in-out";
        const iconStyleSelected = "text-slate-500 dark:text-white";
        const iconStyleUnSelected = "text-gray-500 dark:text-slate-300";
        const textSytleSelected = "ml-1 mt-[0.3rem] hidden sm:hidden md:hidden lg:block text-slate-500 dark:text-white";
        const textSytleUnSelected = "ml-1 mt-[0.3rem] hidden sm:hidden md:hidden lg:block text-gray-500 dark:text-slate-300";
    const displayGridDivStyle = "flex flex-col justify-center items-center animate-fade-up animate-delay-300 animate-once w-full max-w-[355px] sm:max-w-[355px] md:max-w-[355px] lg:max-w-[910px]";

    return (
        <div className={mainDivStyle}>
            <nav className={navDivStyle}>
                {/* nav line */}
                <div className={navLineDivStyle}>
                    <div className={navLineStyle} />
                </div>
                {/* nav button */}
                <div className={navButtonDivStyle}>
                    {/* option 1 */}
                    <button type="button" onClick={() => navClicked("1")} className={navButtonStyle}>
                        <div className={widget === "1" || widget === null ? selectedStyle : unSelectedStyle} />
                        <div className={navIconDivStyle}>
                            <MdOutlineWorkOutline className={widget === "1" ? iconStyleSelected : iconStyleUnSelected} size={30} />
                            <span className={widget === "1" ? textSytleSelected : textSytleUnSelected}>{t(translationKeys.work)}</span>
                        </div>
                    </button>
                    {/* option 2 */}
                    <button type="button" onClick={() => navClicked("2")} className={navButtonStyle}>
                        <div className={widget === "2" ? selectedStyle : unSelectedStyle} />
                        <div className={navIconDivStyle}>
                            <MdOutlineSchool className={widget === "2" ? iconStyleSelected : iconStyleUnSelected} size={30} />
                            <span className={widget === "2" ? textSytleSelected : textSytleUnSelected}>{t(translationKeys.education)}</span>
                        </div>
                    </button>
                    {/* option 3 */}
                    <button type="button" onClick={() => navClicked("3")} className={navButtonStyle}>
                        <div className={widget === "3" ? selected3Style : unSelected3Style} />
                        <div className={navIconDivStyle}>
                            <BiBookContent className={widget === "3" ? iconStyleSelected : iconStyleUnSelected} size={30} />
                            <span className={widget === "3" ? textSytleSelected : textSytleUnSelected}>{t(translationKeys.project)}</span>
                        </div>
                    </button>
                    {/* option 4 */}
                    <button type="button" onClick={() => navClicked("4")} className={navButtonStyle}>
                        <div className={widget === "4" ? selectedStyle : unSelectedStyle} />
                        <div className={navIconDivStyle}>
                            <BiCalendarCheck className={widget === "4" ? iconStyleSelected : iconStyleUnSelected} size={30} />
                            <span className={widget === "4" ? textSytleSelected : textSytleUnSelected}>{t(translationKeys.skill)}</span>
                        </div>
                    </button>
                </div>
            </nav>
            {/* display grid */}
            <div className={displayGridDivStyle}>
                <Suspense
                    fallback={(
                        <div className={gridStyles.gridMainDivStyle}>
                            <div className={widget === "4" ? gridStyles.gridDivFiveColStyle : gridStyles.gridDivThreeColStyle}>
                                <GridLoadingPlaceholder loaderColor={loaderColor} small={widget === "4"} keyPrefix={`widget-${widget}`} />
                            </div>
                        </div>
                    )}
                >
                    {
                        widget === "1" ? <CompanyGrid /> : widget === "2" ? <EduGrid /> : widget === "3" ? <ProjectGrid /> : <SkillGrid />
                    }
                </Suspense>
            </div>
        </div>
    )
}

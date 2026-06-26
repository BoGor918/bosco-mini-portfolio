// others
import { lazy, Suspense, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
// global components
import { MapperContext } from '../../../globalVariable/MapperContextProvider';
// mantine components
import { Loader } from '@mantine/core';
// icons
import { BiGrid, BiObjectsVerticalBottom, BiBookContent, BiCalendarCheck } from "react-icons/bi";
// translation
import { translationKeys } from '../../../globalVariable/Translation';

// lazy load component
const CompanyGrid = lazy(() => {
    return new Promise<{ default: React.ComponentType<any> }>((resolve) => {
        resolve(import('../../grids/CompanyGrid'));
    });
});
const EduGrid = lazy(() => {
    return new Promise<{ default: React.ComponentType<any> }>((resolve) => {
        resolve(import('../../grids/EduGrid'));
    });
})
const ProjectGrid = lazy(() => {
    return new Promise<{ default: React.ComponentType<any> }>((resolve) => {
        resolve(import('../../grids/ProjectGrid'));
    });
})
const SkillGrid = lazy(() => {
    return new Promise<{ default: React.ComponentType<any> }>((resolve) => {
        resolve(import('../../grids/SkillGrid'));
    });
})

export default function BottomComponent() {
    // translation
    const { t } = useContext(MapperContext)
    // navigate hook
    const navigate = useNavigate();
    // url parameter
    const queryParameters = new URLSearchParams(window.location.search)
    const widget = queryParameters.get("w")

    // set nav function
    const navClicked = (e: any) => {
        navigate(`?w=${e}`)
    }

    // style variable
    const mainDivStyle = "self-center w-full max-w-[365px] sm:max-w-[355px] md:max-w-[355px] lg:max-w-[910px] flex flex-col items-center justify-center font-light mb-[5rem]";
    const navDivStyle = "py-[1rem] flex flex-col justify-between items-center sticky top-[-0.1px] z-10 bg-white dark:bg-[#0B1A33] w-full max-w-[365px] sm:max-w-[355px] md:max-w-[355px] lg:max-w-[910px]";
    const navLineDivStyle = "overflow-hidden animate-fade-up animate-delay-200 animate-once flex flex-col justify-end items-end";
    const navLineStyle = "w-[355px] sm:w-[355px] md:w-[355px] lg:w-[900px] h-[1px] bg-[#0B1A33]/35 dark:bg-white/35";
    const navButtonDivStyle = "flex animate-fade-up animate-delay-200 animate-once";
    const navButtonStyle = "flex flex-col items-center content-center mx-5 sm:mx-5 md:mx-5 lg:mx-12";
    const navIconDivStyle = "flex items-center mt-[8px] mr-[0rem] sm:mr-[0rem] md:mr-[0rem] lg:mr-[0.4rem]";
    const selectedStyle = "opacity-100 w-[50px] sm:w-[50px] md:w-[50px] lg:w-[125px] h-[2px] bg-[#334155] dark:bg-white mt-[-0.76px] rounded-full transition duration-500 ease-in-out";
    const unSelectedStyle = "opacity-0 w-[50px] sm:w-[50px] md:w-[50px] lg:w-[125px] h-[2px] bg-[#9A9A9A] dark:bg-[#94A3B8] mt-[-0.76px] rounded-full transition duration-500 ease-in-out";
    const selected3Style = "opacity-100 w-[50px] sm:w-[50px] md:w-[50px] lg:w-[150px] h-[2px] bg-[#334155] dark:bg-white mt-[-0.76px] rounded-full transition duration-500 ease-in-out";
    const unSelected3Style = "opacity-0 w-[50px] sm:w-[50px] md:w-[50px] lg:w-[150px] h-[2px] bg-[#9A9A9A] dark:bg-[#94A3B8] mt-[-0.76px] rounded-full transition duration-500 ease-in-out";
    const iconStyleSelected = "text-[#334155)] dark:text-white";
    const iconStyleUnSelected = "text-[#9A9A9A] dark:text-[#94A3B8]";
    const textSytleSelected = "ml-1 mt-[0.3rem] hidden sm:hidden md:hidden lg:block text-[#334155] dark:text-white";
    const textSytleUnSelected = "ml-1 mt-[0.3rem] hidden sm:hidden md:hidden lg:block text-[#9A9A9A] dark:text-[#94A3B8]";
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
                    <button onClick={() => navClicked("1")} className={navButtonStyle}>
                        <div className={widget === "1" || widget === null ? selectedStyle : unSelectedStyle} />
                        <div className={navIconDivStyle}>
                            <BiGrid className={widget === "1" ? iconStyleSelected : iconStyleUnSelected} size={30} />
                            <span className={widget === "1" ? textSytleSelected : textSytleUnSelected}>{t(translationKeys.work)}</span>
                        </div>
                    </button>
                    {/* option 2 */}
                    <button onClick={() => navClicked("2")} className={navButtonStyle}>
                        <div className={widget === "2" ? selectedStyle : unSelectedStyle} />
                        <div className={navIconDivStyle}>
                            <BiObjectsVerticalBottom className={widget === "2" ? iconStyleSelected : iconStyleUnSelected} size={30} />
                            <span className={widget === "2" ? textSytleSelected : textSytleUnSelected}>{t(translationKeys.education)}</span>
                        </div>
                    </button>
                    {/* option 3 */}
                    <button onClick={() => navClicked("3")} className={navButtonStyle}>
                        <div className={widget === "3" ? selected3Style : unSelected3Style} />
                        <div className={navIconDivStyle}>
                            <BiBookContent className={widget === "3" ? iconStyleSelected : iconStyleUnSelected} size={30} />
                            <span className={widget === "3" ? textSytleSelected : textSytleUnSelected}>{t(translationKeys.project)}</span>
                        </div>
                    </button>
                    {/* option 4 */}
                    <button onClick={() => navClicked("4")} className={navButtonStyle}>
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
                <Suspense fallback={<Loader className='my-[2rem]' />}>
                    {
                        widget === "1" || widget === null ? <CompanyGrid /> : widget === "2" ? <EduGrid /> : widget === "3" ? <ProjectGrid /> : widget === "4" ? <SkillGrid /> : <></>
                    }
                </Suspense>
            </div>
        </div>
    )
}

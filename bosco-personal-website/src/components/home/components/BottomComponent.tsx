// others
import { lazy, Suspense } from 'react'
import { useNavigate } from 'react-router-dom';
// global components
// mantine components
import { Loader } from '@mantine/core';
// icons
import { BiGrid, BiObjectsVerticalBottom, BiBookContent, BiCalendarCheck } from "react-icons/bi";
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
    const selectedStyle = "opacity-100 w-[50px] sm:w-[50px] md:w-[50px] lg:w-[125px] h-[2px] bg-[#9a9a9a] dark:bg-white mt-[-0.76px] rounded-full transition duration-500 ease-in-out"
    const unSelectedStyle = "opacity-0 w-[50px] sm:w-[50px] md:w-[50px] lg:w-[125px] h-[2px] bg-[#9a9a9a] dark:bg-[#94A3B8] mt-[-0.76px] rounded-full transition duration-500 ease-in-out"
    const selected3Style = "opacity-100 w-[50px] sm:w-[50px] md:w-[50px] lg:w-[150px] h-[2px] bg-[#9a9a9a] dark:bg-white mt-[-0.76px] rounded-full transition duration-500 ease-in-out"
    const unSelected3Style = "opacity-0 w-[50px] sm:w-[50px] md:w-[50px] lg:w-[150px] h-[2px] bg-[#9a9a9a] dark:bg-[#94A3B8] mt-[-0.76px] rounded-full transition duration-500 ease-in-out"
    const iconStyleSelected = "text-[#9A9A9A] dark:text-white"
    const iconStyleUnSelected = "text-[#9A9A9A] dark:text-[#94A3B8]"
    const textSytleSelected = "ml-1 mt-[0.3rem] hidden sm:hidden md:hidden lg:block text-[#9A9A9A] dark:text-white"
    const textSytleUnSelected = "ml-1 mt-[0.3rem] hidden sm:hidden md:hidden lg:block text-[#9A9A9A] dark:text-[#94A3B8]"

    return (
        <div className='self-center w-full max-w-[365px] sm:max-w-[355px] md:max-w-[355px] lg:max-w-[910px] flex flex-col items-center justify-center font-light mb-[5rem]'>
            <nav className='py-[1rem] flex flex-col justify-between items-center sticky top-[-0.1px] z-10 bg-white dark:bg-[#0B1A33] w-full max-w-[365px] sm:max-w-[355px] md:max-w-[355px] lg:max-w-[910px]'>
                {/* nav line */}
                <div className='overflow-hidden animate-fade-up animate-delay-200 animate-once flex flex-col justify-end items-end'>
                    <div className='w-[355px] sm:w-[355px] md:w-[355px] lg:w-[900px] h-[1px] bg-[#9a9a9a60] dark:bg-[#94A3B860]' />
                </div>
                {/* nav button */}
                <div className='flex animate-fade-up animate-delay-200 animate-once'>
                    {/* option 1 */}
                    <button onClick={() => navClicked("1")} className='flex flex-col items-center content-center mr-5 sm:mr-5 md:mr-5 lg:mr-12'>
                        <div className={widget === "1" || widget === null ? selectedStyle : unSelectedStyle} />
                        <div className='flex items-center mt-[8px] mr-[0rem] sm:mr-[0rem] md:mr-[0rem] lg:mr-[0.4rem]'>
                            <BiGrid className={widget === "1" ? iconStyleSelected : iconStyleUnSelected} size={30} />
                            <span className={widget === "1" ? textSytleSelected : textSytleUnSelected}>WORKS</span>
                        </div>
                    </button>
                    {/* option 2 */}
                    <button onClick={() => navClicked("2")} className='flex flex-col items-center content-center mx-5 sm:mx-5 md:mx-5 lg:mx-12'>
                        <div className={widget === "2" ? selectedStyle : unSelectedStyle} />
                        <div className='flex items-center mt-[8px] mr-[0rem] sm:mr-[0rem] md:mr-[0rem] lg:mr-[0.4rem]'>
                            <BiObjectsVerticalBottom className={widget === "2" ? iconStyleSelected : iconStyleUnSelected} size={30} />
                            <span className={widget === "2" ? textSytleSelected : textSytleUnSelected}>EDUS</span>
                        </div>
                    </button>
                    {/* option 3 */}
                    <button onClick={() => navClicked("3")} className='flex flex-col items-center content-center mx-5 sm:mx-5 md:mx-5 lg:mx-12'>
                        <div className={widget === "3" ? selected3Style : unSelected3Style} />
                        <div className='flex items-center mt-[8px] mr-[0rem] sm:mr-[0rem] md:mr-[0rem] lg:mr-[0.4rem]'>
                            <BiBookContent className={widget === "3" ? iconStyleSelected : iconStyleUnSelected} size={30} />
                            <span className={widget === "3" ? textSytleSelected : textSytleUnSelected}>PROJECTS</span>
                        </div>
                    </button>
                    {/* option 4 */}
                    <button onClick={() => navClicked("4")} className='flex flex-col items-center content-center ml-5 sm:ml-5 md:ml-5 lg:ml-12'>
                        <div className={widget === "4" ? selectedStyle : unSelectedStyle} />
                        <div className='flex items-center mt-[8px] mr-[0rem] sm:mr-[0rem] md:mr-[0rem] lg:mr-[0.5rem]'>
                            <BiCalendarCheck className={widget === "4" ? iconStyleSelected : iconStyleUnSelected} size={30} />
                            <span className={widget === "4" ? textSytleSelected : textSytleUnSelected}>SKILLS</span>
                        </div>
                    </button>
                </div>
            </nav>
            {/* display grid */}
            <div className='flex flex-col justify-center items-center animate-fade-up animate-delay-300 animate-once w-full max-w-[355px] sm:max-w-[355px] md:max-w-[355px] lg:max-w-[910px]'>
                <Suspense fallback={<Loader className='my-[2rem]' />}>
                    {
                        widget === "1" || widget === null ? <CompanyGrid /> : widget === "2" ? <EduGrid /> : widget === "3" ? <ProjectGrid /> : widget === "4" ? <SkillGrid /> : <></>
                    }
                </Suspense>
            </div>
        </div>
    )
}

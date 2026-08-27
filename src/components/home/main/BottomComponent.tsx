// others
import { lazy, Suspense, useContext, useState } from 'react'
// global components
import { MapperContext } from '../../../globalVariable/MapperContextProvider';
import { getLoaderColor } from '../../../globalVariable/GlobalVariable';
import { GridLoadingPlaceholder, gridStyles } from '../grids/util';
// icons
import { MdOutlineWorkOutline, MdOutlineSchool } from "react-icons/md";
import { BiBookContent, BiCalendarCheck } from "react-icons/bi";
// translation
import { translationKeys } from '../../../globalVariable/Translation';
// util
import { GridType, CompanyGridType, EducationGridType, ProjectGridType, SkillGridType } from '../../util';

// lazy load component
const CompanyGrid = lazy(() => import('../grids/CompanyGrid'));
const EduGrid = lazy(() => import('../grids/EduGrid'));
const ProjectGrid = lazy(() => import('../grids/ProjectGrid'));
const SkillGrid = lazy(() => import('../grids/SkillGrid'));

export default function BottomComponent() {
    // translation
    const { t, theme } = useContext(MapperContext)
    const [widget, setWidget] = useState<GridType>(CompanyGridType);
    const loaderColor = getLoaderColor(theme);

    // set nav function
    const navClicked = (value: GridType) => {
        setWidget(value);
    }

    // style variable
    const mainDivStyle = "self-center w-full max-w-[365px] sm:max-w-[355px] md:max-w-[355px] lg:max-w-[910px] flex flex-col items-center justify-center font-light mb-[5rem]";
    const navDivStyle = "py-[1rem] flex flex-col justify-between items-center sticky top-[-0.1px] z-10 bg-white dark:bg-dark-blue w-full max-w-[365px] sm:max-w-[355px] md:max-w-[355px] lg:max-w-[910px]";
    const navTextStyle = "mb-[5px] self-center text-lg text-slate-500 dark:text-slate-300 text-sm lg:hidden animate-fade-up animate-delay-200 animate-once";
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
                {/* nav text mobile */}
                <span className={navTextStyle}>
                    {widget === CompanyGridType || widget === null ? t(translationKeys.works) : widget === EducationGridType ? t(translationKeys.educations) : widget === ProjectGridType ? t(translationKeys.projects) : t(translationKeys.skills)}
                </span>
                {/* nav line */}
                <div className={navLineDivStyle}>
                    <div className={navLineStyle} />
                </div>
                {/* nav button */}
                <div className={navButtonDivStyle}>
                    {/* option 1 */}
                    <button type="button" onClick={() => navClicked(CompanyGridType)} className={navButtonStyle}>
                        <div className={widget === CompanyGridType || widget === null ? selectedStyle : unSelectedStyle} />
                        <div className={navIconDivStyle}>
                            <MdOutlineWorkOutline className={widget === CompanyGridType || widget === null ? iconStyleSelected : iconStyleUnSelected} size={30} />
                            <span className={widget === CompanyGridType || widget === null ? textSytleSelected : textSytleUnSelected}>{t(translationKeys.works)}</span>
                        </div>
                    </button>
                    {/* option 2 */}
                    <button type="button" onClick={() => navClicked(EducationGridType)} className={navButtonStyle}>
                        <div className={widget === EducationGridType ? selectedStyle : unSelectedStyle} />
                        <div className={navIconDivStyle}>
                            <MdOutlineSchool className={widget === EducationGridType ? iconStyleSelected : iconStyleUnSelected} size={30} />
                            <span className={widget === EducationGridType ? textSytleSelected : textSytleUnSelected}>{t(translationKeys.educations)}</span>
                        </div>
                    </button>
                    {/* option 3 */}
                    <button type="button" onClick={() => navClicked(ProjectGridType)} className={navButtonStyle}>
                        <div className={widget === ProjectGridType ? selected3Style : unSelected3Style} />
                        <div className={navIconDivStyle}>
                            <BiBookContent className={widget === ProjectGridType ? iconStyleSelected : iconStyleUnSelected} size={30} />
                            <span className={widget === ProjectGridType ? textSytleSelected : textSytleUnSelected}>{t(translationKeys.projects)}</span>
                        </div>
                    </button>
                    {/* option 4 */}
                    <button type="button" onClick={() => navClicked(SkillGridType)} className={navButtonStyle}>
                        <div className={widget === SkillGridType ? selectedStyle : unSelectedStyle} />
                        <div className={navIconDivStyle}>
                            <BiCalendarCheck className={widget === SkillGridType ? iconStyleSelected : iconStyleUnSelected} size={30} />
                            <span className={widget === SkillGridType ? textSytleSelected : textSytleUnSelected}>{t(translationKeys.skills)}</span>
                        </div>
                    </button>
                </div>
            </nav>
            {/* display grid */}
            <div className={displayGridDivStyle}>
                <Suspense
                    fallback={(
                        <div className={gridStyles.gridMainDivStyle}>
                            <div className={widget === SkillGridType ? gridStyles.gridDivFiveColStyle : gridStyles.gridDivThreeColStyle}>
                                <GridLoadingPlaceholder loaderColor={loaderColor} small={widget === SkillGridType} keyPrefix={`widget-${widget}`} />
                            </div>
                        </div>
                    )}
                >
                    {
                        widget === CompanyGridType ? <CompanyGrid /> : widget === EducationGridType ? <EduGrid /> : widget === ProjectGridType ? <ProjectGrid /> : <SkillGrid />
                    }
                </Suspense>
            </div>
        </div>
    )
}

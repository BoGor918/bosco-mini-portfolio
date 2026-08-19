// others
import { useRef, useEffect, useContext } from "react"
import CountUp from "react-countup";
// mantine
import { Button } from "@mantine/core";
// files
import CV from "../../../files/CV.pdf"
// icons
import { BiMoon, BiSolidMoon } from "react-icons/bi";
// global variable
import { colorTheme } from "../../../globalVariable/GlobalVariable";
import { languageSetting, translationKeys } from "../../../globalVariable/Translation";
import { MapperContext } from "../../../globalVariable/MapperContextProvider";
// component
import PersonalIconComponent from "../../icon/PersonalIconComponent";
import { useAppNavigate } from "../../../globalVariable/NavigationLoading";

const CVName = `CHEUNG_Tsz_Lai_Bosco_CV.pdf`;

export default function TopComponent() {
    // icon box
    const boxRef = useRef<HTMLDivElement>(null);
    // work date set up
    const workStartDate = new Date(2021, 5, 1);
    const currentDate = new Date();
    const totalYear = currentDate.getFullYear() - workStartDate.getFullYear();
    // global
    const { t, language, setLanguage, theme, setTheme, user } = useContext(MapperContext);
    // url param
    const navigate = useAppNavigate();
    // style list
    const mainDivPaddingXStyle = language === languageSetting.english ? `px-[4rem]` : `px-[6rem]`;
    const mainDivStyle = `flex flex-col sm:flex-col md:flex-col lg:flex-row justify-center lg:justify-between items-center mt-[5rem] ${mainDivPaddingXStyle} self-center w-full max-w-[365px] sm:max-w-[365px] md:max-w-[365px] lg:max-w-[910px] font-light`;
    const infoDivStyle = `animate-fade-up animate-delay-100 animate-once`;
    const labelAndLanguageSwitchDivStyle = `flex flex-col lg:flex-row items-center mb-4 gap-0 lg:gap-2`;
    const labelStyle = `flex mt-5 mb-4 lg:mb-0 lg:mt-0 mx-auto lg:mx-0 px-2.5 py-1 w-fit rounded-full border text-[10px] font-semibold tracking-[0.22em] uppercase` + (theme === colorTheme.dark ? ` border-cyan/60 bg-cyan/12 text-cyan` : ` border-dark-blue/60 bg-cyan/12 text-dark-blue`);
    const languageSwitchDivStyle = `flex items-center gap-2 ml-0 lg:ml-2 uppercase`;
    const languageSwitchButtonStyle = (isActive: boolean) =>
        `px-2 py-1 border rounded-md text-[11px] font-semibold transition ` + (theme === colorTheme.dark
            ? isActive
                ? `border-cyan bg-cyan text-dark-blue`
                : `border-white/45 text-white hover:bg-white/10`
            : isActive
                ? `border-dark-blue bg-dark-blue text-white`
                : `border-dark-blue/45 text-dark-blue hover:bg-dark-blue/10`);
    const loginTextStyle = `ml-0 lg:ml-2 font-bold text-sm cursor-pointer` + (theme === colorTheme.dark ? ` text-white hover:underline` : ` text-dark-blue hover:underline`);
    const columnOneStyle = `flex flex-col sm:flex-col md:flex-col lg:flex-row justify-center lg:justify-start items-center mb-4`;
    const nameStyle = `text-dark-blue dark:text-white text-[33px] sm:text-[33px] md:text-[33px] lg:text-[36px] font-extrabold`;
    const cvButtonDivStyle = `flex justify-center items-center lg:mb-0 my-3 lg:my-0`;
    const cvButtonStyle = `ml-0 lg:ml-5 mr-5 text-white rounded-md` + (theme === colorTheme.dark ? ` bg-light-blue hover:bg-light-blue/90` : ` bg-dark-blue hover:bg-dark-blue/90`);
    const themeSwitchButtonStyle = `p-1 border-[2px] rounded-full` + (theme === colorTheme.light ? ` border-dark-blue hover:bg-dark-blue/10` : ` border-white hover:bg-white/10`);
    const biMoonIconStyle = `text-[22px] sm:text-[22px] md:text-[22px] lg:text-[24px]`;
    const biSolidMoonIconStyle = `text-white text-[22px] sm:text-[22px] md:text-[22px] lg:text-[24px]`;
    const columnTwoDivStyle = `flex justify-center sm:justify-center md:justify-center lg:justify-start items-center mb-5 gap-3 lg:gap-5`;
    const expDivStyle = `p-5 rounded-3xl border min-w-[112px] uppercase ` + (theme === colorTheme.dark ? `border-white/35 bg-dark-blue/1` : `border-dark-blue/35 bg-dark-blue/6`);
    const expNumberStyle = `leading-none font-extrabold text-[24px] sm:text-[24px] md:text-[24px] lg:text-[24px] ` + (theme === colorTheme.dark ? `text-white` : `text-dark-blue`);
    const expTitleStyle = `text-[11px] tracking-[0.14em] font-medium ` + (theme === colorTheme.dark ? `text-slate-300` : `text-slate-500`);
    const columnThreeStyle = `flex flex-col lg:flex-row justify-start gap-3 lg:gap-5`;
    const focusContactDivStyle = `flex justify-center sm:justify-center md:justify-center lg:justify-start items-center`;
    const focusBoxStyle = `p-5 w-full max-w-[560px] rounded-3xl border ` + (theme === colorTheme.dark ? `border-white/35 bg-dark-blue/1` : `border-dark-blue/35 bg-dark-blue/6`);
    const focusTitleStyle = `mb-2 text-[12px] font-semibold uppercase tracking-[0.14em] ` + (theme === colorTheme.dark ? `text-slate-300` : `text-slate-500`);
    const focusContentDivStyle = `flex flex-col`;
    const focusItemStyle = `my-1 px-2 py-1 w-fit rounded-2xl border text-[13px] leading-[1.35] font-medium ` + (theme === colorTheme.dark ? `border-cyan/30 bg-cyan/10 text-cyan` : `border-dark-blue/20 bg-white text-slate-500`);

    // icon box animation
    useEffect(() => {
        const boxElement = boxRef.current;

        if (!boxElement) {
            return;
        }

        const updateAnimation = () => {
            const angle =
                (parseFloat(boxElement.style.getPropertyValue("--angle")) + 0.5) % 360;
            boxElement.style.setProperty("--angle", `${angle}deg`);
            requestAnimationFrame(updateAnimation);
        };

        requestAnimationFrame(updateAnimation);
    }, []);

    // handle click color theme switch function
    const handleThemeSwitch = () => {
        setTheme(theme === colorTheme.dark ? colorTheme.light : colorTheme.dark);
    };

    return (
        <div className={mainDivStyle}>
            {/* personal icon */}
            <PersonalIconComponent />
            {/* info */}
            <div className={infoDivStyle}>
                {/* label and language switch */}
                <div className={labelAndLanguageSwitchDivStyle}>
                    {/* bosco portfolio label */}
                    <div className={labelStyle}>
                        {t(translationKeys.boscoPortfolio)}
                    </div>
                    {/* language switch */}
                    <div className={languageSwitchDivStyle}>
                        <button
                            onClick={() => setLanguage(languageSetting.english)}
                            className={languageSwitchButtonStyle(language === languageSetting.english)}
                        >
                            {t(translationKeys.englishLanguage)}
                        </button>
                        <button
                            onClick={() => setLanguage(languageSetting.traditionalChinese)}
                            className={languageSwitchButtonStyle(language === languageSetting.traditionalChinese)}
                        >
                            {t(translationKeys.tranditionalChineseLanguage)}
                        </button>
                        <button
                            onClick={() => setLanguage(languageSetting.simplifiedChinese)}
                            className={languageSwitchButtonStyle(language === languageSetting.simplifiedChinese)}
                        >
                            {t(translationKeys.simplifiedChineseLanguage)}
                        </button>
                        {/* login and dashboard link */}
                        <span
                            className={loginTextStyle}
                            onClick={() => {
                                user ? navigate('/dashboard') : navigate('/login')
                            }}
                        >
                            {user ? t(translationKeys.dashboard) : t(translationKeys.login)}
                        </span>
                    </div>
                </div>
                {/* name cv with theme switch column */}
                <div className={columnOneStyle}>
                    <span className={nameStyle}>
                        {t(translationKeys.cheungTszLai)}
                    </span>
                    <div className={cvButtonDivStyle}>
                        <a href={CV} download={CVName}>
                            <Button className={cvButtonStyle}>
                                {t(translationKeys.downloadCv)}
                            </Button>
                        </a>
                        <button onClick={handleThemeSwitch} className={themeSwitchButtonStyle}>
                            {
                                theme === colorTheme.light ?
                                    <BiMoon className={biMoonIconStyle} /> :
                                    <BiSolidMoon className={biSolidMoonIconStyle} />
                            }
                        </button>
                    </div>
                </div>
                {/* exp projects and skills */}
                <div className={columnTwoDivStyle}>
                    <div className={expDivStyle}>
                        <div className={expNumberStyle}>
                            <CountUp start={100} end={totalYear} duration={3} />
                            <span>+</span>
                        </div>
                        <div className={expTitleStyle}>
                            {t(translationKeys.yearExperience)}
                        </div>
                    </div>
                    <div className={expDivStyle}>
                        <div className={expNumberStyle}>
                            <CountUp start={100} end={5} duration={3} />
                            <span>+</span>
                        </div>
                        <div className={expTitleStyle}>
                            {t(translationKeys.project)}
                        </div>
                    </div>
                    <div className={expDivStyle}>
                        <div className={expNumberStyle}>
                            <CountUp start={100} end={20} duration={3} />
                            <span>+</span>
                        </div>
                        <div className={expTitleStyle}>
                            {t(translationKeys.skill)}
                        </div>
                    </div>
                </div>
                {/* self description */}
                <div className={columnThreeStyle}>
                    {/* focus skills */}
                    <div className={focusContactDivStyle}>
                        <div className={focusBoxStyle}>
                            <div className={focusTitleStyle}>
                                {t(translationKeys.focus)}
                            </div>
                            <div className={focusContentDivStyle}>
                                <div className={focusItemStyle}>
                                    {t(translationKeys.fullStackDevelopment)}
                                </div>
                                <div className={focusItemStyle}>
                                    {t(translationKeys.webAppDesignDevelopment)}
                                </div>
                                <div className={focusItemStyle}>
                                    {t(translationKeys.photoVideoEditing)}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* contact */}
                    <div className={focusContactDivStyle}>
                        <div className={focusBoxStyle}>
                            <div className={focusTitleStyle}>
                                {t(translationKeys.contactBosco)}
                            </div>
                            <div className={focusContentDivStyle}>
                                <div className={focusItemStyle}>
                                    +852 6770 8560
                                </div>
                                <div className={focusItemStyle}>
                                    cheungtszlai0918@gmail.com
                                </div>
                                <div className={focusItemStyle}>
                                    tl.cheung1@ha.org.hk
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

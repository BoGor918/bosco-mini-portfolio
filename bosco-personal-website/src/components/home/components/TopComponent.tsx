// others
import { useRef, useEffect, useState, CSSProperties } from "react"
import CountUp from "react-countup";
// mantine
import { Button, Loader, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import packageJson from "../../../../package.json"
// files
import CV from "../../../files/CV.pdf"
// icons
import { BiMoon, BiSolidMoon } from "react-icons/bi";
// page component
import IntroductionModalComponent from "../../modal/introduction/IntroductionModalComponent";
// react lazy load image
import { LazyLoadImage } from "react-lazy-load-image-component";
// global variable
import { colorTheme } from "../../../globalVariable/GlobalVariable";

const PersonalIcon = `/images/personal_icon.png`;
const PersonalIconName = `personal_icon.png`;
const CVName = `CHEUNG_Tsz_Lai_Bosco_CV.pdf`;

export default function TopComponent() {
    // icon box
    const boxRef = useRef<HTMLDivElement>(null);
    // work date set up
    const workStartDate = new Date(2021, 5, 1);
    const currentDate = new Date();
    const totalYear = currentDate.getFullYear() - workStartDate.getFullYear();
    // color theme
    const [theme, setTheme] = useState(localStorage.getItem(colorTheme.theme) || colorTheme.light);
    // personal icon loading status
    const [isPersonalIconLoaded, setIsPersonalIconLoaded] = useState(false);
    const [isPersonalIconFailed, setIsPersonalIconFailed] = useState(false);
    // model hook
    const [opened, { open, close }] = useDisclosure(false);
    const modalTitle = `About This Website - ${packageJson.version}`;
    // style list
    const mainDivStyle = `flex flex-col sm:flex-col md:flex-col lg:flex-row justify-center lg:justify-between items-center mt-[5rem] px-[4rem] self-center w-full max-w-[365px] sm:max-w-[365px] md:max-w-[365px] lg:max-w-[910px] font-light`;
    const personalIconDivStyle = `flex flex-col items-center animate-fade-up animate-delay-0 animate-once`;
    const personalIconStyle = `relative flex justify-center items-center w-[198px] h-[198px] border-[3px] border-[#0000] rounded-full cursor-pointer overflow-hidden [background:padding-box_var(--bg-color),border-box_var(--border-color)]`
    const lazyLoadImageStyle = `w-full h-full object-cover p-[4px] rounded-full transition-opacity duration-300`;
    const personalIconLoaderStyle = `absolute inset-0 flex justify-center items-center`;
    const personalIconFallbackStyle = `w-full h-full flex justify-center items-center text-[42px] font-extrabold rounded-full ` + (theme === colorTheme.dark ? `text-[#21D4F7] bg-[#0F274A]` : `text-[#0B1A33] bg-[#E5E7EB]`);
    const viewInfoButtonStyle = `relative z-20 mt-[-2.2rem] px-7 py-1 rounded-full text-[10px] font-semibold tracking-[0.3em] hover:brightness-95 transition ` + (theme === colorTheme.dark ? `bg-[#21D4F7] text-[#0B1A33]` : `bg-[#000000] text-[#FFFFFF]`);
    const infoDivStyle = `animate-fade-up animate-delay-100 animate-once`;
    const labelStyle = `flex mt-5 lg:mt-0 mx-auto lg:mx-0 mb-4 px-2.5 py-1 w-fit rounded-full border text-[10px] font-semibold tracking-[0.22em] uppercase` + (theme === colorTheme.dark ? ` border-[#21D4F7]/60 bg-[#21D4F7]/12 text-[#21D4F7]` : ` border-[#0B1A33]/60 bg-[#21D4F7]/12 text-[#0B1A33]`);
    const columnOneStyle = `flex flex-col sm:flex-col md:flex-col lg:flex-row justify-center items-center mb-4`;
    const nameStyle = `text-[#000000] dark:text-[#FFFFFF] text-[33px] sm:text-[33px] md:text-[33px] lg:text-[36px] font-extrabold`;
    const cvButtonDivStyle = `flex justify-center items-center lg:mb-0 my-3 lg:my-0`;
    const cvButtonStyle = `ml-0 lg:ml-5 mr-5 text-[#FFFFFF] rounded-md` + (theme === colorTheme.dark ? ` bg-[#4094F4] hover:bg-[#4094F4]/90` : ` bg-[#0B1A33] hover:bg-[#0B1A33]/90`);
    const themeSwitchButtonStyle = `p-1 border-[2px] rounded-full` + (theme === colorTheme.light ? ` border-[#0B1A33] hover:bg-[#0B1A33]/10` : ` border-[#FFFFFF] hover:bg-[#FFFFFF]/10`);
    const biMoonIconStyle = `text-[22px] sm:text-[22px] md:text-[22px] lg:text-[24px]`;
    const biSolidMoonIconStyle = `text-[#FFFFFF] text-[22px] sm:text-[22px] md:text-[22px] lg:text-[24px]`;
    const columnTwoDivStyle = `flex justify-center sm:justify-center md:justify-center lg:justify-start items-center mb-5 gap-3 lg:gap-5`;
    const expDivStyle = `p-5 rounded-3xl border min-w-[112px] uppercase ` + (theme === colorTheme.dark ? `border-white/35 bg-[#0B1A33]/1` : `border-[#0B1A33]/35 bg-[#0B1A33]/6`);
    const expNumberStyle = `leading-none font-extrabold text-[24px] sm:text-[24px] md:text-[24px] lg:text-[24px] ` + (theme === colorTheme.dark ? `text-white` : `text-[#0B1A33]`);
    const expTitleStyle = `text-[11px] tracking-[0.14em] font-medium ` + (theme === colorTheme.dark ? `text-[#94A3B8]` : `text-[#334155]`);
    const columnThreeStyle = `flex flex-col lg:flex-row justify-start gap-3 lg:gap-5`;
    const focusContactDivStyle = `flex justify-center sm:justify-center md:justify-center lg:justify-start items-center`;
    const focusBoxStyle = `p-5 w-full max-w-[560px] rounded-3xl border ` + (theme === colorTheme.dark ? `border-white/35 bg-[#0B1A33]/1` : `border-[#0B1A33]/35 bg-[#0B1A33]/6`);
    const focusTitleStyle = `mb-2 text-[12px] font-semibold uppercase tracking-[0.14em] ` + (theme === colorTheme.dark ? `text-[#94A3B8]` : `text-[#334155]`);
    const focusContentDivStyle = `flex flex-col`;
    const focusItemStyle = `my-1 px-2 py-1 w-fit rounded-2xl border text-[13px] leading-[1.35] font-medium ` + (theme === colorTheme.dark ? `border-[#21D4F7]/30 bg-[#21D4F7]/10 text-[#21D4F7]` : `border-[#0B1A33]/20 bg-white text-[#334155]`);

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

    // color theme
    useEffect(() => {
        const storedTheme = localStorage.getItem(colorTheme.theme);
        const prefersDarkMode = window.matchMedia(`(prefers-color-scheme: ${colorTheme.dark})`).matches;

        if (storedTheme) {
            setTheme(storedTheme);
        } else if (prefersDarkMode) {
            setTheme(colorTheme.dark);
        } else {
            setTheme(colorTheme.light);
        }
    }, []);

    // color theme
    useEffect(() => {
        if (theme === colorTheme.dark) {
            document.documentElement.classList.add(colorTheme.dark);
            document.body.style.backgroundColor = `#0B1A33`;
            document.querySelector(`meta[name="theme-color"]`)?.setAttribute(`content`, `#0B1A33`)
        } else {
            document.documentElement.classList.remove(colorTheme.dark);
            document.body.style.backgroundColor = `#FFFFFF`;
            document.querySelector(`meta[name="theme-color"]`)?.setAttribute(`content`, `#FFFFFF`)
        }

        localStorage.setItem(colorTheme.theme, theme);
    }, [theme]);

    // handle click color theme switch function
    const handleThemeSwitch = () => {
        setTheme(theme === colorTheme.dark ? colorTheme.light : colorTheme.dark);
    };

    return (
        <div className={mainDivStyle}>
            {/* personal icon */}
            <div className={personalIconDivStyle}>
                <div
                    onClick={() => open()}
                    ref={boxRef}
                    style={
                        {
                            "--angle": "0deg",
                            "--border-color": theme === colorTheme.light
                                ? `linear-gradient(var(--angle), #000000, #A0A8B0)`
                                : "linear-gradient(var(--angle), #00A3FF, #21FAC6)",
                            "--bg-color": theme === colorTheme.light ? `linear-gradient(#FFFFFF, #FFFFFF)` : `linear-gradient(#0B1A33, #0B1A33)`,
                        } as CSSProperties
                    }
                    className={personalIconStyle}
                >
                    {!isPersonalIconFailed && (
                        <LazyLoadImage
                            src={PersonalIcon}
                            className={`${lazyLoadImageStyle} ${isPersonalIconLoaded ? `opacity-100` : `opacity-0`}`}
                            alt={PersonalIconName}
                            width={190}
                            height={190}
                            onLoad={() => setIsPersonalIconLoaded(true)}
                            onError={() => {
                                setIsPersonalIconFailed(true);
                                setIsPersonalIconLoaded(false);
                            }}
                        />
                    )}
                    {!isPersonalIconLoaded && !isPersonalIconFailed && (
                        <div className={personalIconLoaderStyle}>
                            <Loader type="bars" color="blue" />
                        </div>
                    )}
                    {isPersonalIconFailed && (
                        <div className={personalIconFallbackStyle}>
                            B
                        </div>
                    )}
                </div>
                {/* pasted image-style intro button under the personal icon */}
                <button
                    onClick={() => open()}
                    className={viewInfoButtonStyle}
                >
                    VIEW<br />INTRO
                </button>
            </div>
            {/* info */}
            <div className={infoDivStyle}>
                {/* bosco portfolio label */}
                <div className={labelStyle}>
                    Bosco Portfolio
                </div>
                {/* name cv with theme switch column */}
                <div className={columnOneStyle}>
                    <span className={nameStyle}>
                        CHEUNG Tsz Lai
                    </span>
                    <div className={cvButtonDivStyle}>
                        <a href={CV} download={CVName}>
                            <Button className={cvButtonStyle}>
                                Download CV
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
                            Yrs Exp
                        </div>
                    </div>
                    <div className={expDivStyle}>
                        <div className={expNumberStyle}>
                            <CountUp start={100} end={5} duration={3} />
                            <span>+</span>
                        </div>
                        <div className={expTitleStyle}>
                            Projects
                        </div>
                    </div>
                    <div className={expDivStyle}>
                        <div className={expNumberStyle}>
                            <CountUp start={100} end={20} duration={3} />
                            <span>+</span>
                        </div>
                        <div className={expTitleStyle}>
                            Skills
                        </div>
                    </div>
                </div>
                {/* self description */}
                <div className={columnThreeStyle}>
                    {/* focus skills */}
                    <div className={focusContactDivStyle}>
                        <div className={focusBoxStyle}>
                            <div className={focusTitleStyle}>
                                Focus
                            </div>
                            <div className={focusContentDivStyle}>
                                <div className={focusItemStyle}>
                                    Full Stack Development
                                </div>
                                <div className={focusItemStyle}>
                                    Web / App Design + Development
                                </div>
                                <div className={focusItemStyle}>
                                    Photo / Video Editing
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* contact */}
                    <div className={focusContactDivStyle}>
                        <div className={focusBoxStyle}>
                            <div className={focusTitleStyle}>
                                Contact - Bosco
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
            {/* modal components */}
            {
                theme === colorTheme.light ?
                    <Modal opened={opened} onClose={close} size="lg" title={modalTitle} centered>
                        <IntroductionModalComponent />
                    </Modal> :
                    <Modal opened={opened} onClose={close} size="lg" title={modalTitle} centered
                        styles={{
                            header: {
                                backgroundColor: "#0B1A33",
                            },
                            content: {
                                backgroundColor: "#0B1A33",
                            },
                            title: {
                                color: "#94A3B8",
                            }
                        }}
                    >
                        <IntroductionModalComponent />
                    </Modal>
            }
        </div>
    )
}

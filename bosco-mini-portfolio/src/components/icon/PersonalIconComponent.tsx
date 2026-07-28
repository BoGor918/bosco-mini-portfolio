// react
import { useContext, useRef, useState, CSSProperties, useEffect } from 'react'
// mantine
import { useDisclosure } from '@mantine/hooks';
import { Loader, Modal } from "@mantine/core";
// package json
import packageJson from "../../../package.json"
// global variable
import { MapperContext } from '../../globalVariable/MapperContextProvider';
import { colorTheme, getLoaderColor } from "../../globalVariable/GlobalVariable";
import { languageSetting, translationKeys } from '../../globalVariable/Translation';
// react lazy load image
import { LazyLoadImage } from "react-lazy-load-image-component";
// components
import IntroductionModalComponent from './modals/IntroductionModalComponent';

const PersonalIcon = `/images/personal_icon.png`;
const PersonalIconName = `personal_icon.png`;

export default function PersonalIconComponent() {
    // context
    const { t, language, theme } = useContext(MapperContext)
    // icon box
    const boxRef = useRef<HTMLDivElement>(null);
    // model hook
    const [opened, { open, close }] = useDisclosure(false);
    // modal title
    const modalTitle = `${t(translationKeys.aboutThisWebsite)} - ${packageJson.version}`;
    // personal icon loading status
    const [isPersonalIconLoaded, setIsPersonalIconLoaded] = useState(false);
    const [isPersonalIconFailed, setIsPersonalIconFailed] = useState(false);

    // style list
    const viewInfoButtonMarginTop = language === languageSetting.english ? `mt-[-2.2rem]` : `mt-[-1.4rem]`;
    const viewInfoButtonStyle = `relative z-20 ${viewInfoButtonMarginTop} px-7 py-1 rounded-full text-[10px] font-semibold tracking-[0.3em] hover:brightness-95 transition uppercase ` + (theme === colorTheme.dark ? `bg-[#21D4F7] text-[#0B1A33]` : `bg-[#0B1A33] text-[#FFFFFF]`);
    const parentContainerStyle = "bg-white dark:bg-[#0B1A33] flex flex-col";
    const personalIconDivStyle = `flex flex-col items-center animate-fade-up animate-delay-0 animate-once`;
    const personalIconStyle = `relative flex justify-center items-center w-[198px] h-[198px] border-[3px] border-[#0000] rounded-full cursor-pointer overflow-hidden [background:padding-box_var(--bg-color),border-box_var(--border-color)]`
    const lazyLoadImageStyle = `w-full h-full object-cover p-[4px] rounded-full transition-opacity duration-300`;
    const personalIconLoaderStyle = `absolute inset-0 flex justify-center items-center`;
    const personalIconFallbackStyle = `w-full h-full flex justify-center items-center text-[42px] font-extrabold rounded-full ` + (theme === colorTheme.dark ? `text-[#21D4F7] bg-[#0F274A]` : `text-[#0B1A33] bg-[#E5E7EB]`);

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

    const renderTextWithBreaks = (value: string) => {
        return value.split(/<br\s*\/?>/gi).map((text, index) => (
            <span key={`${text}-${index}`}>
                {index > 0 && <br />}
                {text}
            </span>
        ));
    };

    return (
        <div className={parentContainerStyle}>
            {/* personal icon */}
            <div className={personalIconDivStyle}>
                <div
                    onClick={() => open()}
                    ref={boxRef}
                    style={
                        {
                            "--angle": "0deg",
                            "--border-color": theme === colorTheme.light
                                ? `linear-gradient(var(--angle), #0B1A33, #A0A8B0)`
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
                            <Loader type="bars" color={getLoaderColor(theme)} />
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
                    {renderTextWithBreaks(t(translationKeys.viewIntro))}
                </button>
            </div>
            {/* modal components */}
            {
                theme === colorTheme.light ?
                    <Modal opened={opened} onClose={close} size="lg" title={modalTitle} centered>
                        <IntroductionModalComponent />
                    </Modal> :
                    <Modal opened={opened} onClose={close} size="lg" title={modalTitle} centered
                        closeButtonProps={{ className: 'intro-modal-close-btn' }}
                        styles={{
                            header: {
                                backgroundColor: "#0B1A33",
                            },
                            content: {
                                backgroundColor: "#0B1A33",
                            },
                            title: {
                                color: "#94A3B8",
                            },
                        }}
                    >
                        <IntroductionModalComponent />
                    </Modal>
            }
        </div>
    )
}

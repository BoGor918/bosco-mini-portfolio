// other
import { useContext } from "react";
// icons
import { BsInstagram, BsLinkedin, BsGithub, BsWhatsapp, BsEnvelope } from "react-icons/bs";
// global variable
import { MapperContext } from "../../../globalVariable/MapperContextProvider";
import { translationKeys } from "../../../globalVariable/Translation";


export default function MiddleComponent() {
    // translation
    const { t } = useContext(MapperContext)
    // style variable
    const parentStyle = "self-center w-full max-w-[415px] sm:max-w-[415px] md:max-w-[415px] lg:max-w-[910px] animate-fade-up animate-delay-150 animate-once ml-[0px] sm:md:ml-[0px] md:ml-[0px] lg:ml-[30px] mt-[2rem] sm:mt-[2rem] md:mt-[2rem] lg:mt-[4rem] mb-[1.5rem] sm:mb-[1.5rem] md:mb-[1.5rem] lg:mb-[3rem]"
    const subParentStyle = "flex overflow-x-scroll scroll-smooth no-scrollbar"
    const buttonStyle = "border-[1.5px] border-[#0B1A33]/35 dark:border-white/35 rounded-full p-[2px]"
    const textStyle = "text-[#334155] dark:text-[#94A3B8] self-center mt-[0.5rem] text-[12px] sm:text-[12px] md:text-[12px] lg:text-[14px]"
    const iconStyle = "text-[#334155] dark:text-[#94A3B8] p-[20px] text-[67px] sm:text-[67px] md:text-[67px] lg:text-[75px]"
    const iconBoxStyle = "flex flex-col mx-[1.1rem] sm:mx-[1.1rem] md:mx-[1.1rem] lg:mx-[2rem]"

    return (
        <div className={parentStyle}>
            <div className={subParentStyle}>
                {/* instragm box */}
                <div className={iconBoxStyle} style={{ flexBasis: "auto", flexGrow: 0, flexShrink: 0 }}>
                    <button type="button" title="Instagram" onClick={() => window.open("https://www.instagram.com/cheungtszlai/", "_blank")} className={buttonStyle}>
                        <BsInstagram className={iconStyle} />
                    </button>
                    <span className={textStyle}>Instagram</span>
                </div>
                {/* linkedin box */}
                <div className={iconBoxStyle} style={{ flexBasis: "auto", flexGrow: 0, flexShrink: 0 }}>
                    <button type="button" title="LinkedIn" onClick={() => window.open("https://www.linkedin.com/in/tsz-lai-bosco-cheung-2476791b2/", "_blank")} className={buttonStyle}>
                        <BsLinkedin className={iconStyle} />
                    </button>
                    <span className={textStyle}>LinkedIn</span>
                </div>
                {/* github box */}
                <div className={iconBoxStyle} style={{ flexBasis: "auto", flexGrow: 0, flexShrink: 0 }}>
                    <button type="button" title="GitHub" onClick={() => window.open("https://github.com/BoGor918", "_blank")} className={buttonStyle}>
                        <BsGithub className={iconStyle} />
                    </button>
                    <span className={textStyle}>GitHub</span>
                </div>
                {/* whatsapp box */}
                <div className={iconBoxStyle} style={{ flexBasis: "auto", flexGrow: 0, flexShrink: 0 }}>
                    <button type="button" title="WhatsApp" onClick={() => window.open("https://wa.link/8zfh0o", "_blank")} className={buttonStyle}>
                        <BsWhatsapp className={iconStyle} />
                    </button>
                    <span className={textStyle}>WhatsApp</span>
                </div>
                {/* email box */}
                <div className={iconBoxStyle} style={{ flexBasis: "auto", flexGrow: 0, flexShrink: 0 }}>
                    <button type="button" title="Email" onClick={() => window.open("mailto:cheungtszlai@gmail.com", "_blank")} className={buttonStyle}>
                        <BsEnvelope className={iconStyle} />
                    </button>
                    <span className={textStyle}>{t(translationKeys.email)}</span>
                </div>
            </div>
        </div>
    );
}
// others
import { useRef, useEffect, useState, CSSProperties } from 'react'
import CountUp from 'react-countup';
// mantine
import { Button, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
// files
import CV from '../../../files/CV.pdf'
// icons
import { BiMoon, BiSolidMoon } from "react-icons/bi";
// page component
import IntroductionModalComponent from '../../modal/introduction/IntroductionModalComponent';
// react lazy load image
import { LazyLoadImage } from 'react-lazy-load-image-component';

const PersonalIcon = '/images/personal_icon.png';


export default function TopComponent() {
    // icon box
    const boxRef = useRef<HTMLDivElement>(null);
    // work date set up
    const workStartDate = new Date(2021, 5, 1);
    const currentDate = new Date();
    const totalYear = currentDate.getFullYear() - workStartDate.getFullYear();
    // color theme
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    // model hook
    const [opened, { open, close }] = useDisclosure(false);

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
        const storedTheme = localStorage.getItem('theme');
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (storedTheme) {
            setTheme(storedTheme);
        } else if (prefersDarkMode) {
            setTheme('dark');
        } else {
            setTheme('light');
        }
    }, []);

    // color theme
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            document.body.style.backgroundColor = '#0B1A33';
            document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#0B1A33')
        } else {
            document.documentElement.classList.remove('dark');
            document.body.style.backgroundColor = '#FFFFFF';
            document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#FFFFFF')
        }
        
        localStorage.setItem('theme', theme);
    }, [theme]);

    // handle click color theme switch function
    const handleThemeSwitch = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    return (
        <div className='self-center w-full max-w-[365px] sm:max-w-[365px] md:max-w-[365px] lg:max-w-[910px] flex flex-col sm:flex-col md:flex-col lg:flex-row justify-center items-center font-light mt-[5rem]'>
            {/* personal icon */}
            {
                theme === "light" ?
                    <div
                        onClick={() => open()}
                        ref={boxRef}
                        style={
                            {
                                "--angle": "0deg",
                                "--border-color": "linear-gradient(var(--angle), #00A3FF, #21FAC6)",

                                "--bg-color": "linear-gradient(#FFFFFF, #FFFFFF)",
                            } as CSSProperties
                        }
                        className="cursor-pointer animate-fade-up animate-delay-0 animate-once flex mx-0 sm:mx-0 md:mx-0 lg:mx-10 rounded-full border-[3px] border-[#0000] [background:padding-box_var(--bg-color),border-box_var(--border-color)] mr-0 sm:mr-0 md:mr-0 lg:mr-4"
                    >
                        <LazyLoadImage src={PersonalIcon} className='rounded-full p-[4px]' alt='Personal Icon' width={190} />
                    </div> :
                    <div
                        onClick={() => open()}
                        ref={boxRef}
                        style={
                            {
                                "--angle": "0deg",
                                "--border-color": "linear-gradient(var(--angle), #00A3FF, #21FAC6)",
                                "--bg-color": "linear-gradient(#0B1A33, #0B1A33)",
                            } as CSSProperties
                        }
                        className="cursor-pointer animate-fade-up animate-delay-0 animate-once flex mx-0 sm:mx-0 md:mx-0 lg:mx-10 rounded-full border-[3px] border-[#0000] [background:padding-box_var(--bg-color),border-box_var(--border-color)] mr-0 sm:mr-0 md:mr-0 lg:mr-4"
                    >
                        <LazyLoadImage src={PersonalIcon} className='rounded-full p-[4px]' alt='Personal Icon' width={190} />
                    </div>
            }
            {/* info */}
            <div className='animate-fade-up animate-delay-100 animate-once mx-10'>
                {/* col-1 */}
                <div className='flex flex-col sm:flex-col md:flex-col lg:flex-row justify-center items-center ml-[-0.15rem]'>
                    <span className='text-black dark:text-white mr-0 sm:mr-0 md:mr-0 lg:mr-5 my-4 sm:my-4 md:my-4 lg:my-0 text-[24px] sm:text-[24px] md:text-[24px] lg:text-[27px]'>CHEUNG Tsz Lai</span>
                    <div className='flex justify-center items-center mb-2 sm:mb-2 md:mb-2 lg:mb-0'>
                        <a href={CV} download='CHEUNG_Tsz_Lai_Bosco_CV'>
                            <Button className='mx-1 sm:mx-1 md:mx-1 lg:mx-5 bg-[#4094F4] text-white rounded-md px-[15px] sm:px-[15px] md:px-[15px] lg:px-[20px] py-[5px] text-[12px] sm:text-[12px] md:text-[12px] lg:text-[14px] ml-0 sm:ml-0 md:ml-0 lg:ml-4'>
                                Download CV
                            </Button>
                        </a>
                        <button onClick={handleThemeSwitch} className='ml-3 sm:ml-3 md:ml-3 lg:ml-2'>
                            {
                                theme === 'light' ?
                                    <BiMoon className='text-[22px] sm:text-[22px] md:text-[22px] lg:text-[24px]' /> :
                                    <BiSolidMoon className='text-white text-[22px] sm:text-[22px] md:text-[22px] lg:text-[24px]' />
                            }
                        </button>
                    </div>
                </div>
                {/* col-2 */}
                <div className='flex justify-center sm:justify-center md:justify-center lg:justify-start items-center text-[14px] sm:text-[14px] md:text-[14px] lg:text-[16px] my-4'>
                    <span className='text-black dark:text-white mr-4'><CountUp className='text-black dark:text-white font-bold' start={100} end={totalYear} duration={3} /><span className='text-black dark:text-white font-bold'>+</span> Yrs Exp</span>
                    <span className='text-black dark:text-white mx-4'><CountUp className='text-black dark:text-white font-bold' start={100} end={5} duration={3} /><span className='text-black dark:text-white font-bold'>+</span> Projects</span>
                    <span className='text-black dark:text-white ml-4'><CountUp className='text-black dark:text-white font-bold' start={100} end={20} duration={3} /><span className='text-black dark:text-white font-bold'>+</span> Skills</span>
                </div>
                {/* col-3 pc */}
                <div className='hidden sm:hidden md:hidden lg:flex flex-col text-center sm:text-center md:text-center lg:text-start text-[14px] sm:text-[14px] md:text-[14px] lg:text-[16px]'>
                    <span className='text-black dark:text-white font-bold'>Bosco</span>
                    <span className='text-[#9A9A9A] dark:text-[#94A3B8]'>Full Stack Developer</span>
                    <span className='text-[#9A9A9A] dark:text-[#94A3B8]'>Web / App Design + Development, Photo / Video Editing</span>
                    <span className='text-[#9A9A9A] dark:text-[#94A3B8]'>Email: cheungtszlai0918@gmail.com</span>
                    <span className='text-[#9A9A9A] dark:text-[#94A3B8]'>Phone: +852 6770 8560</span>
                </div>
                {/* col-3 mobile */}
                <div className='flex sm:flex md:flex lg:hidden flex-col text-center sm:text-center md:text-center lg:text-start text-[14px] sm:text-[14px] md:text-[14px] lg:text-[16px]'>
                    <span className='text-black dark:text-white font-bold'>Bosco</span>
                    <span className='text-[#9A9A9A] dark:text-[#94A3B8]'>Full Stack Developer</span>
                    <span className='text-[#9A9A9A] dark:text-[#94A3B8]'>Web / App Design + Development</span>
                    <span className='text-[#9A9A9A] dark:text-[#94A3B8]'>Photo / Video Editing</span>
                    <span className='text-[#9A9A9A] dark:text-[#94A3B8]'>Email: cheungtszlai0918@gmail.com</span>
                    <span className='text-[#9A9A9A] dark:text-[#94A3B8]'>Phone: +852 6770 8560</span>
                </div>
            </div>
            {/* modal components */}
            {
                theme === "light" ?
                    <Modal opened={opened} onClose={close} size="lg" title="About This Website" centered>
                        <IntroductionModalComponent />
                    </Modal> :
                    <Modal opened={opened} onClose={close} size="lg" title="About This Website" centered
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

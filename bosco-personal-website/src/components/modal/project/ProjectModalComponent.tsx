// others
import { useState, useEffect } from "react";
// Mantine
import { useDisclosure } from "@mantine/hooks";
import { LoadingOverlay, Box } from "@mantine/core";
// react lazy load image
import { LazyLoadImage } from 'react-lazy-load-image-component';

export default function ProjectModalComponent({
  projectName,
  description,
  techStack,
  link,
  logo }: {
    projectName: string,
    description: string,
    techStack: [],
    link: [],
    logo: string,
  }) {
  // tech stack list
  const [techStackList, setTechStackList] = useState('')
  // loading overlay hook
  const [visible] = useDisclosure(false);

  // tech stack function
  useEffect(() => {
    var tempTechStackList = ''

    for (let i = 0; i < techStack.length; i++) {
      if (i === techStack.length - 1) {
        tempTechStackList += techStack[i]
      } else {
        tempTechStackList += techStack[i] + ' / '
      }
    }

    setTechStackList(tempTechStackList)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // style variable
  const textStyle = 'text-[14px] sm:text-[14px] md:text-[14px] lg:text-[16px] text-[#9A9A9A] dark:text-[#94A3B8]'

  return (
    <Box pos="relative">
      <div className='flex flex-col font-light p-3'>
        {/* loading overlay */}
        {
          localStorage.getItem("theme") === "light" ?
            <LoadingOverlay visible={visible} overlayBlur={2} /> :
            <LoadingOverlay visible={visible} overlayBlur={2} overlayColor="#0B1A33" />
        }
        {/* project logo */}
        <div className='flex justify-center items-center bg-[#9a9a9a17] p-[2rem] rounded-lg'>
          <LazyLoadImage src={logo} alt={projectName} />
        </div>
        {/* project name */}
        <span className='text-black dark:text-white text-[20px] sm:text-[20px] md:text-[20px] lg:text-[25px] font-medium mt-5 mb-1'>{projectName}</span>
        {/* description */}
        <span className={textStyle}><span className='font-medium'>Description: </span>{description}</span>
        {/* tech stack */}
        <span className={textStyle}><span className='font-medium'>Tech Stack(s): </span>{techStackList}</span>
        {/* link */}
        <span className={textStyle}><span className='font-medium'>Link(s):<br /></span>
          <span>
            {
              link.map((link: any, i: number) => {
                return (
                  <span key={i}>
                    <a href={link} target='_blank' rel='noreferrer' className='text-[#9A9A9A] dark:text-[#94A3B8] hover:underline'>{link}<br /></a>
                  </span>
                )
              })
            }
          </span>
        </span>
      </div>
    </Box>
  )
}

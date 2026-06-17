export default function IntroductionModalComponent() {
  // style variable
  const textStyle = 'mt-[0.5rem] text-justify text-[14px] sm:text-[14px] md:text-[14px] lg:text-[16px] text-[#9A9A9A] dark:text-[#94A3B8]'

  return (
    <div className='flex flex-col font-light p-3'>
      {/* headline */}
      <span className='text-center font-medium text-black dark:text-white text-[20px] sm:text-[20px] md:text-[20px] lg:text-[25px]'>
        Welcome To My Mini Portfolio Website
      </span>
      {/* description */}
      <span className={textStyle}>
        This Mini Portfolio Website is a dynamic and efficient web application built using a powerful stack consisting of <b>Node</b>, <b>React</b>, <b>TypeScript</b>, <b>Tailwind CSS</b>, and <b>Mantine</b>. This combination of cutting-edge technologies forms a solid foundation for showcasing my information in an effective way. With its responsive design, the website presents my work experience, education, projects, and skills visually engaging and user-friendly, ensuring visitors have an enjoyable and informative experience while exploring my portfolio.
      </span>
    </div>
  )
}

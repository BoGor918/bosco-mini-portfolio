// mantine
import { useDisclosure } from "@mantine/hooks";
import { LoadingOverlay, Box } from "@mantine/core";
// react lazy load image
import { LazyLoadImage } from 'react-lazy-load-image-component';

export default function SkillModalComponent({
  skillName,
  logo,
}: {
  skillName: string,
  logo: string,
}) {
  // loading overlay hook
  const [visible] = useDisclosure(false);

  return (
    <Box pos="relative">
      <div className='flex flex-col font-light p-3'>
        {/* loading overlay */}
        {
          localStorage.getItem("theme") === "light" ?
            <LoadingOverlay visible={visible} overlayBlur={2} /> :
            <LoadingOverlay visible={visible} overlayBlur={2} overlayColor="#0B1A33" />
        }
        {/* skill logo */}
        <div className='flex justify-center items-center bg-[#9a9a9a17] p-[2rem] rounded-lg'>
          <LazyLoadImage src={logo} alt={skillName} width={150} />
        </div>
        {/* skill name */}
        <span className='text-black dark:text-white text-[20px] sm:text-[20px] md:text-[20px] lg:text-[25px] font-medium mt-5 mb-1'>{skillName}</span>
      </div>
    </Box>
  )
}
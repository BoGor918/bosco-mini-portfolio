// mantine
import { useDisclosure } from "@mantine/hooks";
import { LoadingOverlay, Box } from "@mantine/core";
// react lazy load image
import { LazyLoadImage } from 'react-lazy-load-image-component';
// util
import { modalStyles } from '../util';
// global variable
import { colorTheme } from "../../../globalVariable/GlobalVariable";

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
      <div className={modalStyles.modalMainDiv}>
        {/* loading overlay */}
        {
          localStorage.getItem(colorTheme.theme) === colorTheme.light ?
            <LoadingOverlay visible={visible} overlayProps={{ blur: 2 }} /> :
            <LoadingOverlay visible={visible} overlayProps={{ blur: 2, color: '#0B1A33' }} />
        }
        {/* skill logo */}
        <div className={modalStyles.modalLogoStyle}>
          <LazyLoadImage src={logo} alt={skillName} width={150} />
        </div>
        {/* skill name */}
        <span className={modalStyles.modalNameStyle}>{skillName}</span>
      </div>
    </Box>
  )
}
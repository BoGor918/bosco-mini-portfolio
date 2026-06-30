// others
import { useContext } from "react";
// Mantine
import { useDisclosure } from "@mantine/hooks";
import { LoadingOverlay, Box } from "@mantine/core";
// react lazy load image
import { LazyLoadImage } from 'react-lazy-load-image-component';
// util
import { getDetailStyles, modalStyles } from '../util';
// global variable
import { colorTheme } from "../../../globalVariable/GlobalVariable";
import { MapperContext } from "../../../globalVariable/MapperContextProvider";
// translation
import { translationKeys } from "../../../globalVariable/Translation"

export default function ProjectModalComponent({
  projectName,
  description,
  techStack,
  link,
  logo }: {
    projectName: string,
    description: string,
    techStack: string[],
    link: string[],
    logo: string,
  }) {
  // translation
  const { t } = useContext(MapperContext)
  // loading overlay hook
  const [visible] = useDisclosure(false);
  // theme
  const isDarkTheme = localStorage.getItem(colorTheme.theme) === colorTheme.dark;
  // styles
  const {
    detailGridStyle,
    detailCardStyle,
    detailLabelStyle,
    detailValueStyle,
    durationPillLowerCaseStyle,
  } = getDetailStyles(isDarkTheme);
  const linkStyle = "block max-w-full break-all leading-[1.45] text-[#9A9A9A] dark:text-[#94A3B8] hover:underline";
  const linkPillStyle = durationPillLowerCaseStyle + ' w-full sm:w-fit max-w-full';
  const techStackList = techStack.join(' / ');

  const getLinkLabel = (projectLink: string) => {
    return projectLink.includes('github.com') ? t(translationKeys.sourceCode) : t(translationKeys.liveDemo);
  };

  return (
    <Box pos="relative">
      <div className={modalStyles.modalMainDiv}>
        {/* loading overlay */}
        {
          localStorage.getItem(colorTheme.theme) === colorTheme.light ?
            <LoadingOverlay visible={visible} overlayProps={{ blur: 2 }} /> :
            <LoadingOverlay visible={visible} overlayProps={{ blur: 2, color: '#0B1A33' }} />
        }
        {/* project logo */}
        <div className={modalStyles.modalLogoStyle}>
          <LazyLoadImage src={logo} alt={projectName} />
        </div>
        {/* project name */}
        <span className={modalStyles.modalNameStyle}>{projectName}</span>
        {/* detail */}
        <div className={detailGridStyle}>
          <div className={detailCardStyle}>
            <div className={detailLabelStyle}>{t(translationKeys.description)}</div>
            <div className={detailValueStyle}>{description}</div>
          </div>
          <div className={detailCardStyle}>
            <div className={detailLabelStyle}>{t(translationKeys.techStack)}</div>
            <div className={detailValueStyle}>{techStackList}</div>
          </div>
          <div className={detailCardStyle + ' sm:col-span-2'}>
            <div className={detailLabelStyle}>{t(translationKeys.link)}</div>
            <div className='mt-1 flex flex-col items-stretch gap-2'>
              {
                link.map((projectLink: string, i: number) => {
                  return (
                    <span key={i} className={linkPillStyle}>
                      <a href={projectLink} target='_blank' rel='noreferrer' className={linkStyle}>
                        {getLinkLabel(projectLink)}: {projectLink}
                      </a>
                    </span>
                  )
                })
              }
            </div>
          </div>
        </div>
      </div>
    </Box>
  )
}

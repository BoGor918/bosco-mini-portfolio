// others
import { useState, useEffect, useContext } from "react";
// Mantine
import { useDisclosure } from '@mantine/hooks';
import { LoadingOverlay, Box } from "@mantine/core";
// icons
// react lazy load image
import { LazyLoadImage } from 'react-lazy-load-image-component';
// util
import { modalStyles, getDetailStyles, calculateDuration } from '../util';
// global variable
import { colorTheme } from "../../../globalVariable/GlobalVariable";
import { MapperContext } from "../../../globalVariable/MapperContextProvider";
// translation
import { translationKeys } from "../../../globalVariable/Translation";

export default function CompanyModalComponent({
  companyName,
  team,
  position,
  jobDuties,
  projects,
  skillSets,
  startDate,
  endDate,
  present,
  logo }: {
    docID: number;
    companyName: string;
    team: string;
    position: string;
    jobDuties: string;
    projects: string;
    skillSets: string[];
    startDate: any;
    endDate: any;
    present: boolean;
    logo: string;
    createDate: {
      seconds: number,
      nanoseconds: number
    };
  }) {
  // translation
  const { t } = useContext(MapperContext)
  // tech stack list
  const [techStackList, setTechStackList] = useState('')
  // date variable
  const [toStartDate, setToStartDate] = useState('')
  const [toEndDate, setToEndDate] = useState('')
  const [resultDate, setResultDate] = useState('')
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
    durationPillStyle,
    durationDivStyle,
  } = getDetailStyles(isDarkTheme);

  // date function
  useEffect(() => {
    const duration = calculateDuration({
      startDate,
      endDate,
      present,
      t,
      translationKeys,
    });

    setToStartDate(duration.toStartDate);
    setToEndDate(duration.toEndDate);
    setResultDate(duration.resultDate);
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [])

  // tech stack list function
  useEffect(() => {
    var tempTechStackList = ''

    for (let i = 0; i < skillSets.length; i++) {
      if (i === skillSets.length - 1) {
        tempTechStackList += skillSets[i]
      } else {
        tempTechStackList += skillSets[i] + ' / '
      }
    }

    setTechStackList(tempTechStackList)
  }, [])

  return (
    <Box pos="relative">
      <div className={modalStyles.modalMainDiv}>
        {/* loading overlay */}
        {
          !isDarkTheme ?
            <LoadingOverlay visible={visible} overlayProps={{ blur: 2 }} /> :
            <LoadingOverlay visible={visible} overlayProps={{ blur: 2, color: '#0B1A33' }} />
        }
        {/* company logo */}
        <div className={modalStyles.modalLogoStyle}>
          <LazyLoadImage src={logo} alt={companyName} />
        </div>
        {/* company name */}
        <span className={modalStyles.modalNameStyle}>{companyName}</span>
        {/* detail */}
        <div className={detailGridStyle}>
          <div className={detailCardStyle}>
            <div className={detailLabelStyle}>{t(translationKeys.team)}</div>
            <div className={detailValueStyle}>{team}</div>
          </div>
          <div className={detailCardStyle}>
            <div className={detailLabelStyle}>{t(translationKeys.position)}</div>
            <div className={detailValueStyle}>{position}</div>
          </div>
          <div className={detailCardStyle + ' sm:col-span-2'}>
            <div className={detailLabelStyle}>{t(translationKeys.jobDutie)}</div>
            <div className={detailValueStyle}>{jobDuties}</div>
          </div>
          <div className={detailCardStyle + ' sm:col-span-2'}>
            <div className={detailLabelStyle}>{t(translationKeys.project)}</div>
            <div className={detailValueStyle}>{projects}</div>
          </div>
          <div className={detailCardStyle + ' sm:col-span-2'}>
            <div className={detailLabelStyle}>{t(translationKeys.techStack)}</div>
            <div className={detailValueStyle}>{techStackList}</div>
          </div>
          <div className={detailCardStyle + ' sm:col-span-2'}>
            <div className={detailLabelStyle}>{t(translationKeys.period)}</div>
            <div className={durationDivStyle}>
              <span className={durationPillStyle}>{resultDate}</span>
              <span className={detailValueStyle + ' mt-0'}>{toStartDate} - {toEndDate}</span>
            </div>
          </div>
        </div>
      </div>
    </Box>
  )
}

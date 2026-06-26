// others
import { useState, useEffect, useContext } from "react";
// Mantine
import { useDisclosure } from '@mantine/hooks';
import { LoadingOverlay, Box } from "@mantine/core";
// react lazy load image
import { LazyLoadImage } from 'react-lazy-load-image-component';
// util
import { getDetailStyles, modalStyles, calculateDuration } from '../util';
// global variable
import { colorTheme } from "../../../globalVariable/GlobalVariable";
import { MapperContext } from "../../../globalVariable/MapperContextProvider";
// translation
import { translationKeys } from "../../../globalVariable/Translation";

export default function EducationModalComponent({
  schoolName,
  type,
  title,
  gpa,
  startDate,
  endDate,
  present,
  logo }: {
    docID: number;
    schoolName: string;
    type: string;
    title: string;
    gpa: number;
    startDate: any;
    endDate: any;
    present: boolean;
    logo: string;
  }) {
  // translation
  const { t } = useContext(MapperContext)
  // date variable
  const [toStartDate, setToStartDate] = useState('')
  const [toEndDate, setToEndDate] = useState('')
  const [resultDate, setResultDate] = useState('')
  // loading overlay hook
  const [visible] = useDisclosure(false);
  // theme
  const isDarkTheme = localStorage.getItem(colorTheme.theme) === colorTheme.dark;
  // styles
  // styles
  const {
    detailGridStyle,
    detailCardStyle,
    detailLabelStyle,
    detailValueStyle,
    durationPillStyle,
    durationDivStyle
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        {/* school logo */}
        <div className={modalStyles.modalLogoStyle}>
          <LazyLoadImage src={logo} alt={schoolName} />
        </div>
        {/* school name */}
        <span className={modalStyles.modalNameStyle}>{schoolName}</span>
        {/* detail */}
        <div className={detailGridStyle}>
          <div className={detailCardStyle}>
            <div className={detailLabelStyle}>{t(translationKeys.type)}</div>
            <div className={detailValueStyle}>{type}</div>
          </div>
          <div className={detailCardStyle}>
            <div className={detailLabelStyle}>{t(translationKeys.education)}</div>
            <div className={detailValueStyle}>{title}</div>
          </div>
          <div className={detailCardStyle + ' sm:col-span-2'}>
            <div className={detailLabelStyle}>{t(translationKeys.score)}</div>
            <div className={detailValueStyle}>{gpa}</div>
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

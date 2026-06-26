// others
import { useState, useEffect, useContext } from "react";
// Mantine
import { useDisclosure } from '@mantine/hooks';
import { LoadingOverlay, Box } from "@mantine/core";
// icons
// react lazy load image
import { LazyLoadImage } from 'react-lazy-load-image-component';
// util
import { modalStyles, getDetailStyles } from '../util';
// global variable
import { colorTheme } from "../../../globalVariable/GlobalVariable";
import { MapperContext } from "../../../globalVariable/MapperContextProvider";
// translation
import { translationKeys } from "../../../globalVariable/Translation";

const toDateValue = (value: any) => {
  if (!value) {
    return '';
  }

  if (value instanceof Date) {
    return value;
  }

  if (typeof value.toDate === 'function') {
    return value.toDate();
  }

  if (typeof value.seconds === 'number') {
    return new Date(value.seconds * 1000);
  }

  return new Date(value);
};

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
    if (present === true) {
      setToStartDate(new Date(startDate.seconds * 1000).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }))
      setToEndDate(t(translationKeys.present))
      // New date instances
      const dt_date1 = new Date(toDateValue(startDate));
      const dt_date2 = new Date();

      // Get the Timestamp
      const date1_time_stamp = dt_date1.getTime();
      const date2_time_stamp = dt_date2.getTime();

      let calc: Date;

      // Check which timestamp is greater
      if (date1_time_stamp > date2_time_stamp) {
        calc = new Date(date1_time_stamp - date2_time_stamp);
      } else {
        calc = new Date(date2_time_stamp - date1_time_stamp);
      }

      // Retrieve the date, month, and year
      const calcFormatTmp = calc.getDate() + '-' + (calc.getMonth() + 1) + '-' + calc.getFullYear();
      // Convert to an array and store
      const calcFormat = calcFormatTmp.split("-");
      // Subtract each member of our array from the default date
      const days_passed = Math.abs(Number(calcFormat[0]) - 1);
      const months_passed = Math.abs(Number(calcFormat[1]) - 1);
      const years_passed = Math.abs(Number(calcFormat[2]) - 1970);

      // Set up custom text
      const yrsTxt = [t(translationKeys.year), t(translationKeys.years)];
      const mnthsTxt = [t(translationKeys.month), t(translationKeys.months)];
      const daysTxt = [t(translationKeys.day), t(translationKeys.days)];

      // Display the result with custom text
      const result = ((years_passed === 1) ? years_passed + ' ' + yrsTxt[0] + ' ' : (years_passed > 1) ?
        years_passed + ' ' + yrsTxt[1] + ' ' : '') +
        ((months_passed === 1) ? months_passed + ' ' + mnthsTxt[0] + ' ' : (months_passed > 1) ?
          months_passed + ' ' + mnthsTxt[1] + ' ' : '') +
        ((days_passed === 1) ? days_passed + ' ' + daysTxt[0] : (days_passed > 1) ?
          days_passed + ' ' + daysTxt[1] : '');

      setResultDate(result.trim())
    } else {
      setToStartDate(new Date(startDate.seconds * 1000).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }));
      setToEndDate(new Date(endDate.seconds * 1000).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }));

      // New date instances
      const dt_date1 = new Date(toDateValue(startDate));
      const dt_date2 = new Date(toDateValue(endDate));

      // Get the Timestamp
      const date1_time_stamp = dt_date1.getTime();
      const date2_time_stamp = dt_date2.getTime();

      let calc: Date;

      // Check which timestamp is greater
      if (date1_time_stamp > date2_time_stamp) {
        calc = new Date(date1_time_stamp - date2_time_stamp);
      } else {
        calc = new Date(date2_time_stamp - date1_time_stamp);
      }

      // Retrieve the date, month, and year
      const calcFormatTmp = calc.getDate() + '-' + (calc.getMonth() + 1) + '-' + calc.getFullYear();
      // Convert to an array and store
      const calcFormat = calcFormatTmp.split("-");
      // Subtract each member of our array from the default date
      const days_passed = Math.abs(Number(calcFormat[0]) - 2);
      const months_passed = Math.abs(Number(calcFormat[1]) - 1);
      const years_passed = Math.abs(Number(calcFormat[2]) - 1970);

      // Set up custom text
      const yrsTxt = [t(translationKeys.year), t(translationKeys.years)];
      const mnthsTxt = [t(translationKeys.month), t(translationKeys.months)];
      const daysTxt = [t(translationKeys.day), t(translationKeys.days)];

      // Display the result with custom text
      const result = ((years_passed === 1) ? years_passed + ' ' + yrsTxt[0] + ' ' : (years_passed > 1) ?
        years_passed + ' ' + yrsTxt[1] + ' ' : '') +
        ((months_passed === 1) ? months_passed + ' ' + mnthsTxt[0] + ' ' : (months_passed > 1) ?
          months_passed + ' ' + mnthsTxt[1] + ' ' : '') +
        ((days_passed === 1) ? days_passed + ' ' + daysTxt[0] : (days_passed > 1) ?
          days_passed + ' ' + daysTxt[1] : '');

      setResultDate(result.trim())
    }
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

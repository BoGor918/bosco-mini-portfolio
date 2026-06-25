// others
import { useState, useEffect } from "react";
// Mantine
import { useDisclosure } from '@mantine/hooks';
import { LoadingOverlay, Box } from "@mantine/core";
// react lazy load image
import { LazyLoadImage } from 'react-lazy-load-image-component';
// util
import { getDetailStyles, modalStyles } from '../util';
// global variable
import { colorTheme } from "../../../globalVariable/GlobalVariable";

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
    if (present === true) {
      setToStartDate(new Date(startDate.seconds * 1000).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }))
      setToEndDate("Present")
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
      const days_passed = Math.abs(Number(calcFormat[0]) - 2);
      const months_passed = Math.abs(Number(calcFormat[1]) - 1);
      const years_passed = Math.abs(Number(calcFormat[2]) - 1970);

      // Set up custom text
      const yrsTxt = ["Year", "Years"];
      const mnthsTxt = ["Month", "Months"];
      const daysTxt = ["Day", "Days"];

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
      const yrsTxt = ["Year", "Years"];
      const mnthsTxt = ["Month", "Months"];
      const daysTxt = ["Day", "Days"];

      // Display the result with custom text
      const result = ((years_passed === 1) ? years_passed + ' ' + yrsTxt[0] + ' ' : (years_passed > 1) ?
        years_passed + ' ' + yrsTxt[1] + ' ' : '') +
        ((months_passed === 1) ? months_passed + ' ' + mnthsTxt[0] + ' ' : (months_passed > 1) ?
          months_passed + ' ' + mnthsTxt[1] + ' ' : '') +
        ((days_passed === 1) ? days_passed + ' ' + daysTxt[0] : (days_passed > 1) ?
          days_passed + ' ' + daysTxt[1] : '');

      setResultDate(result.trim())
    }
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
            <div className={detailLabelStyle}>Type</div>
            <div className={detailValueStyle}>{type}</div>
          </div>
          <div className={detailCardStyle}>
            <div className={detailLabelStyle}>Title</div>
            <div className={detailValueStyle}>{title}</div>
          </div>
          <div className={detailCardStyle + ' sm:col-span-2'}>
            <div className={detailLabelStyle}>CGPA / WGPA / Best Five</div>
            <div className={detailValueStyle}>{gpa}</div>
          </div>
          <div className={detailCardStyle + ' sm:col-span-2'}>
            <div className={detailLabelStyle}>Period</div>
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

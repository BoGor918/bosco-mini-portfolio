// react
import { useContext } from 'react';
// mantine
import { Table } from '@mantine/core';
// global variable
import { colorTheme } from '../../../globalVariable/GlobalVariable';
import { MapperContext } from '../../../globalVariable/MapperContextProvider';
import { languageSetting, translationKeys } from '../../../globalVariable/Translation';
// icon
import { MdEdit } from 'react-icons/md';
import { normalizeImageSource } from '../../util';

// date helper function
const toDisplayDate = (seconds: number) => {
    return new Date(seconds * 1000).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
};

// period helper function
const toPeriod = (
    startDateSeconds: number,
    endDateSeconds: number | null,
    present: boolean,
    presentLabel: string,
) => {
    const startDate = toDisplayDate(startDateSeconds);

    if (present || endDateSeconds === null) {
        return `${startDate} - ${presentLabel}`;
    }

    return `${startDate} - ${toDisplayDate(endDateSeconds)}`;
};

export default function SchoolTable() {
    // context
    const { t, schoolData, language, theme } = useContext(MapperContext);
    // theme
    const isDarkTheme = theme === colorTheme.dark;

    // style list
    const tableWrapperStyle = `w-full max-w-7xl rounded-xl border shadow-sm ${isDarkTheme
        ? 'border-[#21D4F7]/25 bg-[#102340]'
        : 'border-[#0B1A33]/15 bg-white'
        }`;
    const tableScrollStyle = 'max-h-[30rem] overflow-auto';
    const headCellStyle = `text-[13px] font-semibold uppercase tracking-[0.12em] ${isDarkTheme
        ? 'text-[#A5D8FF]'
        : 'text-[#334155]'
        } ${isDarkTheme ? 'bg-[#102340]' : 'bg-[#F8FAFC]'}`;
    const bodyCellStyle = `text-[14px] ${isDarkTheme ? 'text-white' : 'text-[#0F172A]'}`;
    const rowStyle = isDarkTheme ? 'hover:bg-[#1B365D]' : 'hover:bg-[#F8FAFC]';

    const rows = schoolData.map((school) => {
        const schoolName =
            language === languageSetting.english
                ? school.en.SchoolName
                : language === languageSetting.traditionalChinese
                    ? school.zh.SchoolName
                    : school.cn.SchoolName;

        const schoolType =
            language === languageSetting.english
                ? school.en.Type
                : language === languageSetting.traditionalChinese
                    ? school.zh.Type
                    : school.cn.Type;

        const schoolTitle =
            language === languageSetting.english
                ? school.en.Title
                : language === languageSetting.traditionalChinese
                    ? school.zh.Title
                    : school.cn.Title;

        return (
            <Table.Tr key={school.id} className={rowStyle}>
                <Table.Td className={bodyCellStyle}>
                    <img
                        src={normalizeImageSource(school.Logo)}
                        alt={schoolName}
                        className="h-10 w-10 rounded-md object-contain"
                    />
                </Table.Td>
                <Table.Td className={bodyCellStyle}>{schoolName}</Table.Td>
                <Table.Td className={bodyCellStyle}>{schoolType}</Table.Td>
                <Table.Td className={bodyCellStyle}>{schoolTitle}</Table.Td>
                <Table.Td className={bodyCellStyle}>{school.GPA}</Table.Td>
                <Table.Td className={bodyCellStyle}>
                    {toPeriod(
                        school.StartDate.seconds,
                        school.EndDate?.seconds ?? null,
                        school.Present,
                        t(translationKeys.present),
                    )}
                </Table.Td>
                <Table.Td className={`${bodyCellStyle} whitespace-normal break-words`}>
                    <MdEdit className="cursor-pointer text-[22px] sm:text-[22px] md:text-[22px] lg:text-[24px]" />
                </Table.Td>
            </Table.Tr>
        );
    });

    return (
        <div className={tableWrapperStyle}>
            <div className={tableScrollStyle}>
                <Table horizontalSpacing="lg" verticalSpacing="lg" stickyHeader stickyHeaderOffset={0} className="min-w-[980px]">
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th className={headCellStyle}>{t(translationKeys.logo)}</Table.Th>
                            <Table.Th className={headCellStyle}>{t(translationKeys.schoolName)}</Table.Th>
                            <Table.Th className={headCellStyle}>{t(translationKeys.type)}</Table.Th>
                            <Table.Th className={headCellStyle}>{t(translationKeys.title)}</Table.Th>
                            <Table.Th className={headCellStyle}>{t(translationKeys.score)}</Table.Th>
                            <Table.Th className={headCellStyle}>{t(translationKeys.period)}</Table.Th>
                            <Table.Th className={headCellStyle}></Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {rows.length > 0 ? (
                            rows
                        ) : (
                            <Table.Tr>
                                <Table.Td className={bodyCellStyle} colSpan={7}>{t(translationKeys.empty)}</Table.Td>
                            </Table.Tr>
                        )}
                    </Table.Tbody>
                </Table>
            </div>

        </div>
    );
}
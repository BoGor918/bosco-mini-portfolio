// react
import { useContext } from 'react';
// mantine
import { Modal, Table } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
// global variable
import { colorTheme } from '../../../globalVariable/GlobalVariable';
import { MapperContext } from '../../../globalVariable/MapperContextProvider';
import { languageSetting, translationKeys } from '../../../globalVariable/Translation';
// icon
import { MdEdit } from "react-icons/md";
import { normalizeImageSource } from '../../util';

// date helper functions
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

export default function CompanyTable() {
    // context
    const { t, companyData, language, theme } = useContext(MapperContext);
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

    const rows = companyData.map((company) => (
        <Table.Tr key={company.id} className={rowStyle}>
            <Table.Td className={bodyCellStyle}>
                <img
                    src={normalizeImageSource(company.Logo)}
                    alt={
                        language === languageSetting.english
                            ? company.en.CompanyName
                            : language === languageSetting.traditionalChinese
                                ? company.zh.CompanyName
                                : company.cn.CompanyName
                    }
                    className="h-10 w-10 rounded-md object-contain"
                />
            </Table.Td>
            <Table.Td className={bodyCellStyle}>
                {
                    language === languageSetting.english
                        ? company.en.CompanyName
                        : language === languageSetting.traditionalChinese
                            ? company.zh.CompanyName
                            : company.cn.CompanyName
                }
            </Table.Td>
            <Table.Td className={bodyCellStyle}>
                {
                    language === languageSetting.english
                        ? company.en.Position
                        : language === languageSetting.traditionalChinese
                            ? company.zh.Position
                            : company.cn.Position
                }
            </Table.Td>
            <Table.Td className={bodyCellStyle}>
                {toPeriod(
                    company.StartDate.seconds,
                    company.EndDate?.seconds ?? null,
                    company.Present,
                    t(translationKeys.present),
                )}
            </Table.Td>
            <Table.Td className={`${bodyCellStyle} whitespace-normal break-words`}>{company.SkillSets.join(', ')}</Table.Td>
            <Table.Td className={`${bodyCellStyle} whitespace-normal break-words`}>
                <MdEdit className="cursor-pointer text-[22px] sm:text-[22px] md:text-[22px] lg:text-[24px]" />
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <div className={tableWrapperStyle}>
            <div className={tableScrollStyle}>
                <Table horizontalSpacing="lg" verticalSpacing="lg" stickyHeader stickyHeaderOffset={0} className="min-w-[980px]">
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th className={headCellStyle}>{t(translationKeys.logo)}</Table.Th>
                            <Table.Th className={headCellStyle}>{t(translationKeys.companyName)}</Table.Th>
                            <Table.Th className={headCellStyle}>{t(translationKeys.position)}</Table.Th>
                            <Table.Th className={headCellStyle}>{t(translationKeys.period)}</Table.Th>
                            <Table.Th className={headCellStyle}>{t(translationKeys.skillSets)}</Table.Th>
                            <Table.Th className={headCellStyle}></Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {rows.length > 0 ? (
                            rows
                        ) : (
                            <Table.Tr>
                                <Table.Td className={bodyCellStyle} colSpan={6}>{t(translationKeys.empty)}</Table.Td>
                            </Table.Tr>
                        )}
                    </Table.Tbody>
                </Table>
            </div>
        </div>
    )
}

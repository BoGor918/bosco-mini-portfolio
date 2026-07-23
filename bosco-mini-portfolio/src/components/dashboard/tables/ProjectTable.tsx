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

export default function ProjectTable() {
    // context
    const { t, projectData, language, theme } = useContext(MapperContext);
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

    const rows = projectData.map((project) => {
        const description =
            language === languageSetting.english
                ? project.en.Description
                : language === languageSetting.traditionalChinese
                    ? project.zh.Description
                    : project.cn.Description;

        return (
            <Table.Tr key={project.id} className={rowStyle}>
                <Table.Td className={bodyCellStyle}>
                    <img
                        src={normalizeImageSource(project.Logo)}
                        alt={project.ProjectName}
                        className="h-10 w-10 rounded-md object-contain"
                    />
                </Table.Td>
                <Table.Td className={bodyCellStyle}>{project.ProjectName}</Table.Td>
                <Table.Td className={`${bodyCellStyle} whitespace-normal break-words max-w-[18rem]`}>{description}</Table.Td>
                <Table.Td className={`${bodyCellStyle} whitespace-normal break-words`}>{project.TechStack.join(', ')}</Table.Td>
                <Table.Td className={`${bodyCellStyle} whitespace-normal break-words`}>{project.Link.join(', ')}</Table.Td>
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
                            <Table.Th className={headCellStyle}>{t(translationKeys.projectName)}</Table.Th>
                            <Table.Th className={headCellStyle}>{t(translationKeys.description)}</Table.Th>
                            <Table.Th className={headCellStyle}>{t(translationKeys.techStack)}</Table.Th>
                            <Table.Th className={headCellStyle}>{t(translationKeys.link)}</Table.Th>
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
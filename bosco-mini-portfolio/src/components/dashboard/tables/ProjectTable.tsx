// react
import { useContext } from 'react';
// mantine
import { Loader, Table, Tooltip } from '@mantine/core';
// global variable
import { colorTheme } from '../../../globalVariable/GlobalVariable';
import { MapperContext } from '../../../globalVariable/MapperContextProvider';
import { languageSetting, translationKeys } from '../../../globalVariable/Translation';
import { ProjectData } from '../../../types/type';
// icon
import { MdEdit } from 'react-icons/md';
// util
import { normalizeImageSource } from '../../util';
import { getDashboardTableStyles } from './util';

type ProjectTableProps = {
    onEditProject?: (project: ProjectData) => void;
};

export default function ProjectTable({ onEditProject }: ProjectTableProps) {
    // context
    const { t, projectData, projectLoading, language, theme } = useContext(MapperContext);
    // edit icon text
    const editIconText = `${t(translationKeys.edit)}${t(translationKeys.project)}`;
    // style list
    const {
        tableMainStyle,
        tableScrollStyle,
        tableWrapperStyle,
        headCellStyle,
        bodyCellStyle,
        editIconStyle,
        rowStyle,
        rowImageStyle,
    } = getDashboardTableStyles(theme === colorTheme.dark);

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
                        className={rowImageStyle}
                    />
                </Table.Td>
                <Table.Td className={bodyCellStyle}>{project.ProjectName}</Table.Td>
                <Table.Td className={`${bodyCellStyle} whitespace-normal break-words max-w-[18rem]`}>{description}</Table.Td>
                <Table.Td className={`${bodyCellStyle} whitespace-normal break-words`}>
                    <Tooltip label={editIconText}>
                        <span className="inline-flex">
                            <MdEdit
                                className={editIconStyle}
                                onClick={() => onEditProject?.(project)}
                            />
                        </span>
                    </Tooltip>
                </Table.Td>
            </Table.Tr>
        );
    });

    return (
        <div className={tableWrapperStyle}>
            <div className={tableScrollStyle}>
                <Table horizontalSpacing="lg" verticalSpacing="lg" stickyHeader stickyHeaderOffset={0} className={tableMainStyle}>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th className={headCellStyle}>{t(translationKeys.logo)}</Table.Th>
                            <Table.Th className={headCellStyle}>{t(translationKeys.projectName)}</Table.Th>
                            <Table.Th className={headCellStyle}>{t(translationKeys.description)}</Table.Th>
                            <Table.Th className={headCellStyle}></Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {projectLoading ? (
                            <Table.Tr>
                                <Table.Td className={`${bodyCellStyle} text-center`} colSpan={4}>
                                    <div className="flex items-center justify-center gap-2 py-2">
                                        <Loader size="sm" type="dots" />
                                    </div>
                                </Table.Td>
                            </Table.Tr>
                        ) : rows.length > 0 ? (
                            rows
                        ) : (
                            <Table.Tr>
                                <Table.Td className={`${bodyCellStyle} text-center`} colSpan={4}>{t(translationKeys.empty)}</Table.Td>
                            </Table.Tr>
                        )}
                    </Table.Tbody>
                </Table>
            </div>
        </div>
    )
}
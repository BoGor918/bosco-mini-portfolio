// react
import { useContext } from 'react';
// mantine
import { Table, Tooltip } from '@mantine/core';
// global variable
import { colorTheme, getLoaderColor } from '../../../globalVariable/GlobalVariable';
import { MapperContext } from '../../../globalVariable/MapperContextProvider';
import { translationKeys } from '../../../globalVariable/Translation';
import { SkillData } from '../../../types/type';
// icon
import { MdEdit } from "react-icons/md";
// util
import { normalizeImageSource } from '../../util';
import { getDashboardTableStyles, TableDotLoader, TableNoRecordsFoundComponent } from './util';

type SkillTableProps = {
    onEditSkill?: (skill: SkillData) => void;
};

export default function SkillTable({ onEditSkill }: SkillTableProps) {
    // context
    const { t, skillData, skillLoading, theme } = useContext(MapperContext);
    // edit icon text
    const editIconText = `${t(translationKeys.edit)}${t(translationKeys.skill)}`;
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
    const loaderColor = getLoaderColor(theme);

    const rows = skillData.map((skill) => (
        <Table.Tr key={skill.id} className={rowStyle}>
            <Table.Td className={bodyCellStyle}>
                <img
                    src={normalizeImageSource(skill.Logo)}
                    alt={skill.SkillName}
                    className={rowImageStyle}
                />
            </Table.Td>
            <Table.Td className={bodyCellStyle}>{skill.SkillName}</Table.Td>
            <Table.Td className={`${bodyCellStyle} whitespace-normal break-words`}>
                <Tooltip label={editIconText}>
                    <span className="inline-flex">
                        <MdEdit
                            className={editIconStyle}
                            onClick={() => onEditSkill?.(skill)}
                        />
                    </span>
                </Tooltip>
            </Table.Td>
        </Table.Tr>
    ));
    const showTablePlaceholder = skillLoading || rows.length === 0;

    return (
        <div className={tableWrapperStyle}>
            <div className={tableScrollStyle}>
                <Table horizontalSpacing="lg" verticalSpacing="lg" stickyHeader stickyHeaderOffset={0} className={tableMainStyle}>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th className={headCellStyle}>{t(translationKeys.logo)}</Table.Th>
                            <Table.Th className={headCellStyle}>{t(translationKeys.skill)}</Table.Th>
                            <Table.Th className={headCellStyle}></Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    {!showTablePlaceholder && <Table.Tbody>{rows}</Table.Tbody>}
                </Table>
                {showTablePlaceholder && (skillLoading
                    ? <TableDotLoader loaderColor={loaderColor} />
                    : <TableNoRecordsFoundComponent translate={t} theme={theme} />
                )}
            </div>
        </div>
    )
}
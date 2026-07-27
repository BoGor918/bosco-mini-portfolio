// react
import { useContext } from 'react';
// mantine
import { Loader, Table, Tooltip } from '@mantine/core';
// global variable
import { colorTheme } from '../../../globalVariable/GlobalVariable';
import { MapperContext } from '../../../globalVariable/MapperContextProvider';
import { translationKeys } from '../../../globalVariable/Translation';
import { SkillData } from '../../../types/type';
// icon
import { MdEdit } from "react-icons/md";
// util
import { normalizeImageSource } from '../../util';
import { getDashboardTableStyles } from './util';
import { NoRecordsFoundComponent } from '../../home/grids/util';

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
                    <Table.Tbody>
                        {skillLoading ? (
                            <Table.Tr>
                                <Table.Td className={`${bodyCellStyle} text-center`} colSpan={3}>
                                    <div className="flex items-center justify-center gap-2 py-2">
                                        <Loader size="sm" type="dots" />
                                    </div>
                                </Table.Td>
                            </Table.Tr>
                        ) : rows.length > 0 ? (
                            rows
                        ) : (
                            <Table.Tr>
                                <Table.Td className={`${bodyCellStyle} text-center`} colSpan={3}>
                                    <NoRecordsFoundComponent translate={t} theme={theme} />
                                </Table.Td>
                            </Table.Tr>
                        )}
                    </Table.Tbody>
                </Table>
            </div>
        </div>
    )
}
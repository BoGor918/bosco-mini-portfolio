// react
import { useContext } from 'react';
// mantine
import { Loader, Table, Tooltip } from '@mantine/core';
// global variable
import { colorTheme, getLoaderColor } from '../../../globalVariable/GlobalVariable';
import { MapperContext } from '../../../globalVariable/MapperContextProvider';
import { languageSetting, translationKeys } from '../../../globalVariable/Translation';
import { SchoolData } from '../../../types/type';
// icon
import { MdEdit } from 'react-icons/md';
// util
import { normalizeImageSource } from '../../util';
import { getDashboardTableStyles, toPeriod } from './util';
import { NoRecordsFoundComponent } from '../../home/grids/util';

type SchoolTableProps = {
    onEditSchool?: (school: SchoolData) => void;
};

export default function SchoolTable({ onEditSchool }: SchoolTableProps) {
    // context
    const { t, schoolData, schoolLoading, language, theme } = useContext(MapperContext);
    // edit icon text
    const editIconText = `${t(translationKeys.edit)}${t(translationKeys.school)}`;
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

        return (
            <Table.Tr key={school.id} className={rowStyle}>
                <Table.Td className={bodyCellStyle}>
                    <img
                        src={normalizeImageSource(school.Logo)}
                        alt={schoolName}
                        className={rowImageStyle}
                    />
                </Table.Td>
                <Table.Td className={bodyCellStyle}>{schoolName}</Table.Td>
                <Table.Td className={bodyCellStyle}>{schoolType}</Table.Td>
                <Table.Td className={bodyCellStyle}>
                    {toPeriod(
                        school.StartDate.seconds,
                        school.EndDate?.seconds ?? null,
                        school.Present,
                        t(translationKeys.present),
                    )}
                </Table.Td>
                <Table.Td className={`${bodyCellStyle} whitespace-normal break-words`}>
                    <Tooltip label={editIconText}>
                        <span className="inline-flex">
                            <MdEdit
                                className={editIconStyle}
                                onClick={() => onEditSchool?.(school)}
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
                            <Table.Th className={headCellStyle}>{t(translationKeys.schoolName)}</Table.Th>
                            <Table.Th className={headCellStyle}>{t(translationKeys.type)}</Table.Th>
                            <Table.Th className={headCellStyle}>{t(translationKeys.period)}</Table.Th>
                            <Table.Th className={headCellStyle}></Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {schoolLoading ? (
                            <Table.Tr>
                                <Table.Td className={`${bodyCellStyle} text-center`} colSpan={5}>
                                    <div className="flex items-center justify-center gap-2 py-2">
                                        <Loader size="sm" type="dots" color={loaderColor} />
                                    </div>
                                </Table.Td>
                            </Table.Tr>
                        ) : rows.length > 0 ? (
                            rows
                        ) : (
                            <Table.Tr>
                                <Table.Td className={`${bodyCellStyle} text-center`} colSpan={5}>
                                    <NoRecordsFoundComponent translate={t} theme={theme} />
                                </Table.Td>
                            </Table.Tr>
                        )}
                    </Table.Tbody>
                </Table>
            </div>

        </div>
    );
}
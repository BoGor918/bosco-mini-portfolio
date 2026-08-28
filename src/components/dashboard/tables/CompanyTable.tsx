// react
import { useContext } from 'react';
// mantine
import { Table, Tooltip } from '@mantine/core';
// global variable
import { colorTheme, getLoaderColor } from '../../../globalVariable/GlobalVariable';
import { MapperContext } from '../../../globalVariable/MapperContextProvider';
import { languageSetting, translationKeys } from '../../../globalVariable/Translation';
import { CompanyData } from '../../../types/type';
// icon
import { MdEdit } from "react-icons/md";
// util
import { normalizeImageSource } from '../../util';
import { getDashboardTableStyles, TableDotLoader, TableNoRecordsFoundComponent, toPeriod } from './util';

type CompanyTableProps = {
    onEditCompany?: (company: CompanyData) => void;
};

export default function CompanyTable({ onEditCompany }: CompanyTableProps) {
    // context
    const { t, companyData, companyLoading, language, theme } = useContext(MapperContext);
    // edit icon text
    const editIconText = `${t(translationKeys.edit)}${t(translationKeys.company)}`;
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
                    className={rowImageStyle}
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
            <Table.Td className={`${bodyCellStyle} whitespace-normal break-words ml-auto`}>
                <Tooltip label={editIconText}>
                    <span className="inline-flex">
                        <MdEdit
                            className={editIconStyle}
                            onClick={() => onEditCompany?.(company)}
                        />
                    </span>
                </Tooltip>
            </Table.Td>
        </Table.Tr>
    ));
    const showTablePlaceholder = companyLoading || rows.length === 0;

    return (
        <div className={tableWrapperStyle}>
            <div className={tableScrollStyle}>
                <Table horizontalSpacing="lg" verticalSpacing="lg" stickyHeader stickyHeaderOffset={0} className={tableMainStyle}>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th className={headCellStyle}>{t(translationKeys.logo)}</Table.Th>
                            <Table.Th className={headCellStyle}>{t(translationKeys.companyName)}</Table.Th>
                            <Table.Th className={headCellStyle}>{t(translationKeys.position)}</Table.Th>
                            <Table.Th className={headCellStyle}>{t(translationKeys.period)}</Table.Th>
                            <Table.Th className={headCellStyle}></Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    {!showTablePlaceholder && <Table.Tbody>{rows}</Table.Tbody>}
                </Table>
                {showTablePlaceholder && (companyLoading
                    ? <TableDotLoader loaderColor={loaderColor} />
                    : <TableNoRecordsFoundComponent translate={t} theme={theme} />
                )}
            </div>
        </div>
    )
}

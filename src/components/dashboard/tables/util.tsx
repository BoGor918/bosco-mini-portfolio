// mantine
import { Loader } from "@mantine/core";
// global variable
import { TranslationKey, translationKeys } from "../../../globalVariable/Translation";
import { colorTheme } from "../../../globalVariable/GlobalVariable";

// dashboard table styles
export const getDashboardTableStyles = (isDarkTheme: boolean) => ({
    tableMainStyle: `min-w-[980px]`,
    tableWrapperStyle: `w-full overflow-hidden rounded-xl border shadow-sm ${isDarkTheme
        ? 'border-cyan/25 bg-slate-700'
        : 'border-dark-blue/15 bg-white'
        }`,
    tableScrollStyle: 'max-h-[303px] overflow-auto [border-radius:inherit] [-webkit-overflow-scrolling:touch]',
    headCellStyle: `text-[13px] font-semibold uppercase tracking-[0.12em] ${isDarkTheme
        ? 'text-white'
        : 'text-dark-blue'
        } ${isDarkTheme ? 'bg-slate-700' : 'bg-gray-100'}`,
    bodyCellStyle: `text-[14px] ${isDarkTheme ? 'text-white' : 'text-dark-blue'}`,
    rowStyle: isDarkTheme ? 'hover:bg-slate-600' : 'hover:bg-gray-100',
    rowImageStyle: 'h-10 w-10 rounded-md object-contain',
    editIconStyle: `cursor-pointer text-[22px] sm:text-[22px] md:text-[22px] lg:text-[24px] ${isDarkTheme ? 'text-white hover:text-white/70' : 'text-slate-900 hover:text-dark-blue/70'}`,
});

// date helper functions
export const toDisplayDate = (seconds: number) => {
    return new Date(seconds * 1000).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
};

// period helper function
export const toPeriod = (
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

export const TableDotLoader = ({ loaderColor }: { loaderColor: string }) => (
    <div className="h-[241.5px] w-full flex items-center justify-center gap-2 py-2">
        <Loader size="sm" type="dots" color={loaderColor} />
    </div>
);

export const TableNoRecordsFoundComponent = ({ translate, theme }: { translate: (key: TranslationKey) => string, theme: string }) => {
    return (
        <div className={`h-[241.5px] w-full flex items-center justify-center rounded-md text-sm font-semibold ${theme === colorTheme.dark ? 'text-white' : 'text-slate-500'}`}>
            {translate(translationKeys.noRecordsFound)}
        </div>
    );
};
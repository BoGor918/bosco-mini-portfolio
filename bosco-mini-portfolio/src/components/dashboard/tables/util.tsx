// dashboard table styles
export const getDashboardTableStyles = (isDarkTheme: boolean) => ({
    tableMainStyle: `min-w-[980px]`,
    tableWrapperStyle: `animate-fade-up animate-delay-100 animate-once w-full overflow-hidden rounded-xl border shadow-sm ${isDarkTheme
        ? 'border-[#21D4F7]/25 bg-[#102340]'
        : 'border-[#0B1A33]/15 bg-white'
        }`,
    tableScrollStyle: 'max-h-[303px] overflow-auto [border-radius:inherit] [-webkit-overflow-scrolling:touch]',
    headCellStyle: `text-[13px] font-semibold uppercase tracking-[0.12em] ${isDarkTheme
        ? 'text-[#FFFFFF]'
        : 'text-[#0B1A33]'
        } ${isDarkTheme ? 'bg-[#102340]' : 'bg-[#F8FAFC]'}`,
    bodyCellStyle: `text-[14px] ${isDarkTheme ? 'text-white' : 'text-[#0B1A33]'}`,
    rowStyle: isDarkTheme ? 'hover:bg-[#1B365D]' : 'hover:bg-[#F8FAFC]',
    rowImageStyle: 'h-10 w-10 rounded-md object-contain',
    editIconStyle: `cursor-pointer text-[22px] sm:text-[22px] md:text-[22px] lg:text-[24px] ${isDarkTheme ? 'text-white hover:text-white/70' : 'text-[#0F172A] hover:text-[#0B1A33]/70'}`,
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
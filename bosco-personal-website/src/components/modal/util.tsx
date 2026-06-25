export const modalStyles = {
    modalMainDiv: "flex flex-col font-light p-3",
    modalTextStyle: "text-[14px] sm:text-[14px] md:text-[14px] lg:text-[16px] text-[#9A9A9A] dark:text-[#94A3B8]",
    modalLogoStyle: "flex justify-center items-center bg-[#9a9a9a17] p-[2rem] rounded-lg",
    modalNameStyle: "text-black dark:text-white text-[20px] sm:text-[20px] md:text-[20px] lg:text-[25px] font-medium mt-5 mb-1",
}

export const getDetailStyles = (isDarkTheme: boolean) => ({
    detailGridStyle: "mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3",
    detailCardStyle:
        "rounded-2xl border p-3 " +
        (isDarkTheme
            ? "border-white/20 bg-[#0B1A33]/20"
            : "border-[#0B1A33]/15 bg-[#0B1A33]/[0.03]"),
    detailLabelStyle:
        "text-[12px] font-semibold uppercase tracking-[0.16em] " +
        (isDarkTheme ? "text-[#94A3B8]" : "text-[#475569]"),
    detailValueStyle:
        "mt-1 text-[16px] leading-[1.5] break-words " +
        (isDarkTheme ? "text-white" : "text-[#0F172A]"),
    durationPillStyle:
        "inline-flex items-center rounded-full px-2.5 py-1 text-[13px] font-semibold tracking-[0.08em] uppercase " +
        (isDarkTheme
            ? "bg-[#21D4F7]/10 text-[#21D4F7]"
            : "bg-[#0B1A33]/10 text-[#0B1A33]"),
    durationPillLowerCaseStyle:
        "inline-flex items-center rounded-full px-2.5 py-1 text-[13px] font-semibold tracking-[0.08em] " +
        (isDarkTheme
            ? "bg-[#21D4F7]/10 text-[#21D4F7]"
            : "bg-[#0B1A33]/10 text-[#0B1A33]"),
    durationDivStyle: "mt-1 flex flex-col lg:flex-row items-start gap-2",
});
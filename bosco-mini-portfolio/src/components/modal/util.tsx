export const modalStyles = {
    modalMainDiv: "flex flex-col font-light p-3",
    modalTextStyle: "text-[14px] sm:text-[14px] md:text-[14px] lg:text-[16px] text-[#9A9A9A] dark:text-[#94A3B8]",
    modalLogoStyle: "flex justify-center items-center bg-[#9a9a9a17] p-[2rem] rounded-lg",
    modalNameStyle: "text-[#0B1A33] dark:text-white text-[20px] sm:text-[20px] md:text-[20px] lg:text-[25px] font-medium mt-5 mb-1",
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

type DateLike =
    | Date
    | string
    | number
    | { toDate?: () => Date; seconds?: number }
    | null
    | undefined;

type DurationTranslationKeys<TTranslationKey extends string> = {
    present: TTranslationKey;
    year: TTranslationKey;
    years: TTranslationKey;
    month: TTranslationKey;
    months: TTranslationKey;
    day: TTranslationKey;
    days: TTranslationKey;
};

type CalculateDurationParams<TTranslationKey extends string> = {
    startDate: DateLike;
    endDate?: DateLike;
    present?: boolean;
    t: (key: TTranslationKey) => string;
    translationKeys: DurationTranslationKeys<TTranslationKey>;
    locale?: string;
    now?: Date;
};

type CalculateDurationResult = {
    toStartDate: string;
    toEndDate: string;
    resultDate: string;
};

const toDateValue = (value: DateLike): Date | null => {
    if (!value) {
        return null;
    }

    if (value instanceof Date) {
        return value;
    }

    if (typeof value === "object" && typeof value.toDate === "function") {
        return value.toDate();
    }

    if (typeof value === "object" && typeof value.seconds === "number") {
        return new Date(value.seconds * 1000);
    }

    if (typeof value === "string" || typeof value === "number") {
        const parsed = new Date(value);

        if (Number.isNaN(parsed.getTime())) {
            return null;
        }

        return parsed;
    }

    return null;
};

const toDisplayDate = (value: Date | null, locale: string) => {
    if (!value) {
        return "";
    }

    return value.toLocaleDateString(locale, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};

const getDateDiff = (start: Date, end: Date) => {
    const startTime = start.getTime();
    const endTime = end.getTime();

    let from = start;
    let to = end;

    if (startTime > endTime) {
        from = end;
        to = start;
    }

    let years = to.getFullYear() - from.getFullYear();
    let months = to.getMonth() - from.getMonth();
    let days = to.getDate() - from.getDate();

    if (days < 0) {
        months -= 1;
        const daysInPreviousMonth = new Date(to.getFullYear(), to.getMonth(), 0).getDate();
        days += daysInPreviousMonth;
    }

    if (months < 0) {
        years -= 1;
        months += 12;
    }

    return { years, months, days };
};

const toDurationLabel = <TTranslationKey extends string>(
    years: number,
    months: number,
    days: number,
    t: (key: TTranslationKey) => string,
    keys: DurationTranslationKeys<TTranslationKey>,
) => {
    const parts: string[] = [];

    if (years > 0) {
        parts.push(`${years} ${years === 1 ? t(keys.year) : t(keys.years)}`);
    }

    if (months > 0) {
        parts.push(`${months} ${months === 1 ? t(keys.month) : t(keys.months)}`);
    }

    if (days > 0) {
        parts.push(`${days} ${days === 1 ? t(keys.day) : t(keys.days)}`);
    }

    if (parts.length === 0) {
        parts.push(`0 ${t(keys.days)}`);
    }

    return parts.join(" ");
};

export const calculateDuration = <TTranslationKey extends string>({
    startDate,
    endDate,
    present = false,
    t,
    translationKeys,
    locale = "en-GB",
    now = new Date(),
}: CalculateDurationParams<TTranslationKey>): CalculateDurationResult => {
    const parsedStartDate = toDateValue(startDate);
    const parsedEndDate = present ? now : toDateValue(endDate);

    const toStartDate = toDisplayDate(parsedStartDate, locale);
    const toEndDate = present
        ? t(translationKeys.present)
        : toDisplayDate(parsedEndDate, locale);

    if (!parsedStartDate || !parsedEndDate) {
        return {
            toStartDate,
            toEndDate,
            resultDate: "",
        };
    }

    const { years, months, days } = getDateDiff(parsedStartDate, parsedEndDate);
    const resultDate = toDurationLabel(years, months, days, t, translationKeys);

    return {
        toStartDate,
        toEndDate,
        resultDate,
    };
};
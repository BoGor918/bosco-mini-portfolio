// global variable
import { color, colorTheme } from "../../../globalVariable/GlobalVariable";
import { translationKeys, type TranslationKey } from "../../../globalVariable/Translation";
// mantine
import { Loader } from '@mantine/core';

const loadingPlaceholders = Array.from({ length: 45 });

export const gridStyles = {
    gridMainDivStyle: "animate-fade animate-delay-0 animate-once flex justify-center items-center mt-[1rem] sm:mt-[1rem] md:mt-[1rem] lg:mt-[2rem] w-full",
    gridDivThreeColStyle: "mx-0 sm:mx-0 md:mx-0 lg:mx-2 grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-1 w-fit",
    gridDivFiveColStyle: "mx-0 sm:mx-0 md:mx-0 lg:mx-2 grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-1 w-fit",
    gridLazyLoadImageDivStyle: "relative bg-white shadow-md rounded-sm w-[115.66px] sm:w-[115.66px] md:w-[115.66px] lg:w-[295.33px] h-[115.66px] sm:h-[115.66px] md:h-[115.66px] lg:h-[298px] flex justify-center items-center cursor-pointer overflow-hidden border-0 p-0 appearance-none focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2",
    gridLazyLoadImageSmallDivStyle: "relative bg-white shadow-md rounded-sm w-[115.66px] sm:w-[115.66px] md:w-[115.66px] lg:w-[175px] h-[115.66px] sm:h-[115.66px] md:h-[115.66px] lg:h-[175px] flex justify-center items-center cursor-pointer overflow-hidden border-0 p-0 appearance-none focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2",
    gridLazyLoadImageStyle: "w-full h-full object-contain p-4 sm:p-4 md:p-4 lg:p-10 transition-opacity duration-300",
    gridLazyLoaderDivStyle: "absolute inset-0 flex justify-center items-center",
}

export const GridLoadingPlaceholder = ({
    loaderColor,
    small = false,
    keyPrefix = "grid",
}: {
    loaderColor: string;
    small?: boolean;
    keyPrefix?: string;
}) => {
    return (
        <>
            {loadingPlaceholders.map((_, index) => (
                <div
                    key={`${keyPrefix}-loading-${index}`}
                    className={small ? gridStyles.gridLazyLoadImageSmallDivStyle : gridStyles.gridLazyLoadImageDivStyle}
                    aria-hidden="true"
                >
                    <Loader size="lg" type="bars" color={loaderColor} />
                </div>
            ))}
        </>
    );
};

export const getModalStyle = (isDarkTheme: boolean) => {
    return isDarkTheme
        ? {
            modalProps: {
                closeButtonProps: { className: 'intro-modal-close-btn' },
                styles: {
                    header: {
                        backgroundColor: color.darkBlue,
                    },
                    content: {
                        backgroundColor: color.darkBlue,
                    },
                },
            },
        }
        : {};
}

export const NoRecordsFoundComponent = ({ translate, theme }: { translate: (key: TranslationKey) => string, theme: string }) => {
    return (
        <div className={`col-span-full min-h-[9rem] w-full flex items-center justify-center rounded-md text-sm font-semibold ${theme === colorTheme.dark ? 'text-white' : 'text-slate-500'}`}>
            {translate(translationKeys.noRecordsFound)}
        </div>
    );
};
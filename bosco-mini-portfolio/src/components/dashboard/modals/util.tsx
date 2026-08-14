// react
import { useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
// mantine
import { Button, Checkbox, FileInput, Tabs, Text, TextInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';
// global variable
import { MapperContext } from '../../../globalVariable/MapperContextProvider';
import { translationKeys } from '../../../globalVariable/Translation';
import { color, colorTheme } from '../../../globalVariable/GlobalVariable';

// notification
export const SuccessNotificationType = "success";
export const ErrorNotificationType = "error";

// dashboard modal type
export type DashboardModalType = {
    closeModal: () => void;
    onSavingChange?: (isSaving: boolean) => void;
    onDirtyChange?: (isDirty: boolean) => void;
    readOnly?: boolean;
};

// dashboard submit button type
type DashboardSubmitDeleteButtonGroupProps = {
    isSaving: boolean;
    disabled?: boolean;
    showLoading?: boolean;
    idleText?: string;
    savingText?: string;
    deleteText?: string;
    showDelete?: boolean;
    onDeleteClick?: () => void;
    validationMessage?: string;
    theme?: string;
};

// dashboard locale text tabs type
type DashboardLocaleTextTabsProps = {
    tabsStyles: any;
    t: (key: keyof typeof translationKeys) => string;
    fieldKeys: string[];
    inputStyles: any;
    disabled: boolean;
    getInputProps: (path: string) => any;
    getFieldLabel: (fieldKey: string, locale: Locale) => string;
};

// dashboard image file input type
type DashboardImageFileInputProps = {
    inputStyles: any;
    disabled: boolean;
    inputProps: any;
    componentKey?: string;
    className?: string;
    label?: string;
    placeholder?: string;
};

// dashboard existing image preview type
type DashboardExistingImagePreviewProps = {
    imageSource: string | File;
    alt: string;
    label?: string;
    isDarkTheme: boolean;
    className?: string;
    imageClassName?: string;
};

// dashboard present checkbox type
type DashboardPresentCheckboxProps = {
    inputStyles: any;
    isDarkTheme: boolean;
    disabled: boolean;
    inputProps: any;
    componentKey?: string;
    className?: string;
    label?: string;
};

// dashboard date range fields type
type DashboardDateRangeFieldsProps = {
    inputStyles: any;
    isSaving: boolean;
    disabled: boolean;
    present: boolean;
    startDate: Date | null;
    endDate: Date | null;
    onStartDateChange: (value: Date | string | null) => void;
    onEndDateChange: (value: Date | string | null) => void;
    onStartDateBlur: () => void;
    onEndDateBlur: () => void;
    startDateError?: ReactNode;
    endDateError?: ReactNode;
    startDateLabel?: string;
    endDateLabel?: string;
};

// locale type and tab values
export type Locale = 'en' | 'zh' | 'cn';
export const getLocaleTabs = (
    t: (key: keyof typeof translationKeys) => string,
): Array<{ value: Locale; label: string }> => [
        {
            value: 'en',
            label: t(translationKeys.englishLanguage),
        },
        {
            value: 'zh',
            label: t(translationKeys.tranditionalChineseLanguage),
        },
        {
            value: 'cn',
            label: t(translationKeys.simplifiedChineseLanguage),
        },
    ];

// dashboard input styles and tabs styles
export const getDashboardInputStyles = (isDarkTheme: boolean) => ({
    label: {
        color: isDarkTheme ? color.white : color.darkBlue,
        fontWeight: 600,
        fontSize: '14px',
    },
    input: {
        backgroundColor: isDarkTheme ? color.slate700 : color.white,
        color: isDarkTheme ? color.white : color.darkBlue,
        borderColor: isDarkTheme ? color.cyanOverlay : color.darkBlueOverlay,
        fontSize: '14px',
    },
});

// dashboard tabs styles
export const getDashboardTabsStyles = (isDarkTheme: boolean) => ({
    tab: {
        color: isDarkTheme ? color.white : color.darkBlue,
    },
});

// dashboard saving effect hook
export const useDashboardSavingEffect = (
    isSaving: boolean,
    onSavingChange?: (isSaving: boolean) => void,
) => {
    useEffect(() => {
        onSavingChange?.(isSaving);
    }, [isSaving, onSavingChange]);
};

// dashboard submit button
export function DashboardSubmitDeleteButtonGroup({
    isSaving,
    disabled = false,
    showLoading = false,
    idleText = 'Submit',
    deleteText = 'Delete',
    showDelete = false,
    onDeleteClick,
    validationMessage,
    theme,
}: DashboardSubmitDeleteButtonGroupProps) {
    const { theme: contextTheme, loginUser, t } = useContext(MapperContext);
    const activeTheme = theme ?? contextTheme;
    const isReadOnly = loginUser?.IsAdmin !== true;

    return (
        <div className="mt-4 flex flex-col md:flex-row lg:flex-row justify-start item-start md:items-center lg:items-center">
            <div className="flex gap-2 mb-1 lg:mb-0">
                {showDelete && (
                    <Button
                        type="button"
                        className={"bg-red hover:bg-red/90" + (disabled ? ' cursor-not-allowed' : '')}
                        disabled={isSaving || disabled}
                        onClick={onDeleteClick}
                    >
                        {deleteText}
                    </Button>
                )}
                <Button
                    type="submit"
                    disabled={isSaving || disabled}
                    loading={showLoading && isSaving}
                    className={activeTheme === colorTheme.dark
                        ? `bg-light-blue hover:bg-light-blue/90 text-white` + (disabled ? 'text-gray-300 cursor-not-allowed' : '')
                        : `bg-dark-blue hover:bg-dark-blue/90 text-white` + (disabled ? 'text-gray-300 cursor-not-allowed' : '')}
                >
                    {idleText}
                </Button>
            </div>
            <div className="ml-0 md:ml-2 lg:ml-2">
                {validationMessage && (
                    <Text c="red" size="xs">
                        {validationMessage}
                    </Text>
                )}
                {isReadOnly && (
                    <Text c="red" size="xs">
                        {t(translationKeys.onlyAdminCanSubmitOrEdit)}
                    </Text>
                )}
            </div>
        </div>
    );
}

// dashboard locale text tabs
export function DashboardLocaleTextTabs({
    tabsStyles,
    t,
    fieldKeys,
    inputStyles,
    disabled,
    getInputProps,
    getFieldLabel,
}: DashboardLocaleTextTabsProps) {
    const localeTabs = getLocaleTabs(t);

    return (
        <Tabs variant="outline" defaultValue="en" styles={tabsStyles}>
            <Tabs.List>
                {localeTabs.map(({ value, label }) => (
                    <Tabs.Tab key={value} value={value}>
                        <span className="text-[14px] font-bold">{label}</span>
                    </Tabs.Tab>
                ))}
            </Tabs.List>
            {localeTabs.map(({ value: locale }) => (
                <Tabs.Panel key={locale} value={locale}>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 mt-2">
                        {fieldKeys.map((fieldKey, index) => {
                            const formPath = `${locale}.${fieldKey}`;
                            const isLastOddField = fieldKeys.length % 2 !== 0 && index === fieldKeys.length - 1;

                            return (
                                <TextInput
                                    key={formPath}
                                    className={`w-full ${isLastOddField ? 'md:col-span-2' : ''}`}
                                    withAsterisk
                                    label={getFieldLabel(fieldKey, locale)}
                                    styles={inputStyles}
                                    {...getInputProps(formPath)}
                                    disabled={disabled}
                                />
                            );
                        })}
                    </div>
                </Tabs.Panel>
            ))}
        </Tabs>
    );
}

// dashboard image file input
export function DashboardImageFileInput({
    inputStyles,
    disabled,
    inputProps,
    componentKey,
    className = 'pt-2',
    label = 'Upload file',
}: DashboardImageFileInputProps) {
    return (
        <div>
            <FileInput
                withAsterisk
                accept="image/png,image/jpeg"
                label={label}
                styles={inputStyles}
                key={componentKey}
                className={className}
                disabled={disabled}
                {...inputProps}
            />
        </div>
    );
}

// dashboard existing image preview
export function DashboardExistingImagePreview({
    imageSource,
    alt,
    label = 'Image',
    isDarkTheme,
    className = 'mt-2',
    imageClassName = 'max-w-full max-h-48 object-contain',
}: DashboardExistingImagePreviewProps) {
    return (
        <div className={className}>
            <span className={`text-[14px] font-bold ${isDarkTheme ? 'text-white' : 'text-dark-blue'}`}>
                {label}
            </span>
            <img
                src={typeof imageSource === 'string' ? imageSource : URL.createObjectURL(imageSource)}
                alt={alt}
                className={imageClassName}
            />
        </div>
    );
}
// dashboard present checkbox
export function DashboardPresentCheckbox({
    inputStyles,
    isDarkTheme,
    disabled,
    inputProps,
    componentKey,
    className = 'pt-4',
    label = 'Present',
}: DashboardPresentCheckboxProps) {
    return (
        <Checkbox
            label={label}
            className={className}
            styles={{
                ...inputStyles,
                icon: {
                    color: isDarkTheme ? color.white : color.darkBlue,
                },
            }}
            key={componentKey}
            disabled={disabled}
            {...inputProps}
        />
    );
}

// dashboard date range fields
export function DashboardDateRangeFields({
    inputStyles,
    isSaving,
    disabled,
    present,
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
    onStartDateBlur,
    onEndDateBlur,
    startDateError,
    endDateError,
    startDateLabel = 'Start Date',
    endDateLabel = 'End Date',
}: DashboardDateRangeFieldsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:pt-2 lg:pt-2">
            <DateInput
                withAsterisk
                label={startDateLabel}
                styles={inputStyles}
                className="pt-2 md:pt-0 lg:pt-0"
                value={startDate}
                onChange={onStartDateChange}
                onBlur={onStartDateBlur}
                error={startDateError}
                disabled={isSaving || disabled}
                maxDate={endDate || undefined}
                clearable
            />
            <DateInput
                withAsterisk
                label={endDateLabel}
                styles={inputStyles}
                value={endDate}
                onChange={onEndDateChange}
                onBlur={onEndDateBlur}
                error={endDateError}
                disabled={isSaving || disabled || present}
                minDate={startDate || undefined}
                clearable
            />
        </div>
    );
}

// to convert timestamp to date
export const toDateFromTimestamp = (
    timestamp?: { seconds: number; nanoseconds: number } | null,
): Date | null => {
    if (!timestamp) {
        return null;
    }

    return new Date(timestamp.seconds * 1000);
};
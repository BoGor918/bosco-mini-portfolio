// others
import { useState, useContext } from 'react';
import { useDisclosure } from '@mantine/hooks';
// global variable
import { MapperContext } from '../../../globalVariable/MapperContextProvider';
import { colorTheme } from '../../../globalVariable/GlobalVariable';
// mantine components
import { Loader, Modal } from '@mantine/core';
// page components
import EducationModalComponent from '../modals/EducationModalComponent';
// react lazy load image
import { LazyLoadImage } from 'react-lazy-load-image-component';
// types
import { SchoolData } from '../../../types/type';
// util
import { gridStyles, getModalStyle } from './util';
import { normalizeImageSource } from '../../util';
// global variable
import { languageSetting } from '../../../globalVariable/Translation';

// loading placeholders for skeleton loaders
const loadingPlaceholders = Array.from({ length: 3 });

export default function EduGrid() {
    // global variable
    const {
        language,
        theme,
        schoolLoading,
        schoolData
    } = useContext(MapperContext);
    // modal hook
    const [opened, { open, close }] = useDisclosure(false);
    // selected school
    const [selectedSchool, setSelectedSchool] = useState<SchoolData | null>(null);
    // loaded logo ids
    const [loadedLogoIds, setLoadedLogoIds] = useState<Set<SchoolData['id']>>(new Set());
    // failed logo ids
    const [failedLogoIds, setFailedLogoIds] = useState<Set<SchoolData['id']>>(new Set());

    // style list
    const { modalProps } = getModalStyle(theme === colorTheme.dark);

    // open modal with set selected school
    const openModal = (school: SchoolData) => {
        setSelectedSchool(school);
        open();
    };

    // mark failed logo so we can render a loader fallback for that item
    const onLogoError = (schoolId: SchoolData['id']) => {
        setFailedLogoIds((prev) => new Set(prev).add(schoolId));
    };

    // mark logo as loaded so we can hide loader overlay
    const onLogoLoad = (schoolId: SchoolData['id']) => {
        setLoadedLogoIds((prev) => new Set(prev).add(schoolId));
    };

    return (
        <div className={gridStyles.gridMainDivStyle}>
            {/* school grid */}
            <div className={gridStyles.gridDivThreeColStyle}>
                {schoolLoading && (
                    loadingPlaceholders.map((_, index) => (
                        <div
                            key={`school-loading-${index}`}
                            className={gridStyles.gridLazyLoadImageDivStyle}
                            aria-hidden="true"
                        >
                            <Loader size="lg" type="bars" color="blue" />
                        </div>
                    ))
                )}
                {!schoolLoading && schoolData.length === 0 && (
                    <div className="col-span-full min-h-[9rem] w-full flex items-center justify-center rounded-md border border-[#0B1A33]/10 bg-white/80 text-[#334155] text-sm font-semibold">
                        No records found.
                    </div>
                )}
                {!schoolLoading && schoolData.map((school: SchoolData, i: number) => {
                    const hasLogoUrl = Boolean(school.Logo);
                    const showLogoFallback = !hasLogoUrl || failedLogoIds.has(school.id);
                    const isLogoLoaded = loadedLogoIds.has(school.id);
                    return (
                        <button
                            key={i}
                            type="button"
                            onClick={() => openModal(school)}
                            className={gridStyles.gridLazyLoadImageDivStyle}
                            aria-label={`Open ${language === languageSetting.english ? school.en.SchoolName : language === languageSetting.traditionalChinese ? school.zh.SchoolName : school.cn.SchoolName}`}
                        >
                            {!showLogoFallback && (
                                <LazyLoadImage
                                    className={`${gridStyles.gridLazyLoadImageStyle} ${isLogoLoaded ? 'opacity-100' : 'opacity-0'}`}
                                    src={normalizeImageSource(school.Logo)}
                                    alt={language === languageSetting.english ? school.en.SchoolName : language === languageSetting.traditionalChinese ? school.zh.SchoolName : school.cn.SchoolName}
                                    onLoad={() => onLogoLoad(school.id)}
                                    onError={() => onLogoError(school.id)}
                                />
                            )}
                            {(!isLogoLoaded || showLogoFallback) && (
                                <div className={gridStyles.gridLazyLoaderDivStyle}>
                                    <Loader type="bars" color="blue" />
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
            {/* modal components */}
            <Modal opened={opened} onClose={close} size="lg" centered {...modalProps}>
                {selectedSchool && (
                    <EducationModalComponent
                        docID={selectedSchool.id}
                        schoolName={language === languageSetting.english ? selectedSchool.en.SchoolName : language === languageSetting.traditionalChinese ? selectedSchool.zh.SchoolName : selectedSchool.cn.SchoolName}
                        type={language === languageSetting.english ? selectedSchool.en.Type : language === languageSetting.traditionalChinese ? selectedSchool.zh.Type : selectedSchool.cn.Type}
                        title={language === languageSetting.english ? selectedSchool.en.Title : language === languageSetting.traditionalChinese ? selectedSchool.zh.Title : selectedSchool.cn.Title}
                        gpa={selectedSchool.GPA}
                        startDate={selectedSchool.StartDate}
                        endDate={selectedSchool.EndDate}
                        present={selectedSchool.Present}
                        logo={normalizeImageSource(selectedSchool.Logo)}
                    />
                )}
            </Modal>
        </div>
    );
}
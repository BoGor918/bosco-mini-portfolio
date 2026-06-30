// others
import { useState, useContext } from 'react';
import { useDisclosure } from '@mantine/hooks';
// global variable
import { MapperContext } from '../../globalVariable/MapperContextProvider';
import { colorTheme } from '../../globalVariable/GlobalVariable';
// mantine components
import { Loader, Modal } from '@mantine/core';
// page components
import EducationModalComponent from '../modal/education/EducationModalComponent';
// react lazy load image
import { LazyLoadImage } from 'react-lazy-load-image-component';
// types
import { SchoolData } from '../../types/type';
// util
import { gridStyles } from './util';
// global variable
import { languageSetting } from '../../globalVariable/Translation';

export default function CompanyGrid() {
    // global variable
    const {
        language,
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
                {schoolData.map((school: SchoolData, i: number) => {
                    const hasLogoUrl = Boolean(school.Logo?.URL);
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
                                    src={school.Logo.URL}
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
            {
                localStorage.getItem(colorTheme.theme) === colorTheme.light ?
                    <Modal opened={opened} onClose={close} size="lg" centered>
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
                                logo={selectedSchool.Logo.URL}
                            />
                        )}
                    </Modal> :
                    <Modal opened={opened} onClose={close} size="lg" centered
                        closeButtonProps={{ className: 'intro-modal-close-btn' }}
                        styles={{
                            header: {
                                backgroundColor: "#0B1A33",
                            },
                            content: {
                                backgroundColor: "#0B1A33",
                            },
                        }}
                    >
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
                                logo={selectedSchool.Logo.URL}
                            />
                        )}
                    </Modal>
            }
        </div>
    );
}
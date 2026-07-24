// others
import { useState, useContext } from 'react';
import { useDisclosure } from '@mantine/hooks';
// global variable
import { MapperContext } from '../../../globalVariable/MapperContextProvider';
import { colorTheme } from '../../../globalVariable/GlobalVariable';
// mantine components
import { Loader, Modal } from '@mantine/core';
// page components
import CompanyModalComponent from '../modals/CompanyModalComponent';
// react lazy load image
import { LazyLoadImage } from 'react-lazy-load-image-component';
// types
import { CompanyData } from '../../../types/type';
// util
import { gridStyles, getModalStyle } from './util';
import { normalizeImageSource } from '../../util';
// global variable
import { languageSetting } from '../../../globalVariable/Translation';

// loading placeholders for skeleton loaders
const loadingPlaceholders = Array.from({ length: 3 });

export default function CompanyGrid() {
    // global variable
    const {
        language,
        theme,
        companyLoading,
        companyData
    } = useContext(MapperContext);
    // modal hook
    const [opened, { open, close }] = useDisclosure(false);
    // selected company
    const [selectedCompany, setSelectedCompany] = useState<CompanyData | null>(null);
    // loaded logo ids
    const [loadedLogoIds, setLoadedLogoIds] = useState<Set<CompanyData['id']>>(new Set());
    // failed logo ids
    const [failedLogoIds, setFailedLogoIds] = useState<Set<CompanyData['id']>>(new Set());

    // style list
    const { modalProps } = getModalStyle(theme === colorTheme.dark);

    // open modal with set selected company
    const openModal = (company: CompanyData) => {
        setSelectedCompany(company);
        open();
    };

    // mark failed logo so we can render a loader fallback for that item
    const onLogoError = (companyId: CompanyData['id']) => {
        setFailedLogoIds((prev) => new Set(prev).add(companyId));
    };

    // mark logo as loaded so we can hide loader overlay
    const onLogoLoad = (companyId: CompanyData['id']) => {
        setLoadedLogoIds((prev) => new Set(prev).add(companyId));
    };

    return (
        <div className={gridStyles.gridMainDivStyle}>
            {/* company grids */}
            <div className={gridStyles.gridDivThreeColStyle}>
                {companyLoading && (
                    loadingPlaceholders.map((_, index) => (
                        <div
                            key={`company-loading-${index}`}
                            className={gridStyles.gridLazyLoadImageDivStyle}
                            aria-hidden="true"
                        >
                            <Loader size="lg" type="bars" color="blue" />
                        </div>
                    ))
                )}
                {!companyLoading && companyData.length === 0 && (
                    <div className="col-span-full min-h-[9rem] w-full flex items-center justify-center rounded-md border border-[#0B1A33]/10 bg-white/80 text-[#334155] text-sm font-semibold">
                        No records found.
                    </div>
                )}
                {!companyLoading && companyData.map((company: CompanyData, i: number) => {
                    const hasLogoUrl = Boolean(company.Logo);
                    const showLogoFallback = !hasLogoUrl || failedLogoIds.has(company.id);
                    const isLogoLoaded = loadedLogoIds.has(company.id);
                    return (
                        <button
                            key={i}
                            type="button"
                            onClick={() => openModal(company)}
                            className={gridStyles.gridLazyLoadImageDivStyle}
                            aria-label={`Open ${language === languageSetting.english ? company.en.CompanyName : language === languageSetting.traditionalChinese ? company.zh.CompanyName : company.cn.CompanyName}`}
                        >
                            {!showLogoFallback && (
                                <LazyLoadImage
                                    className={`${gridStyles.gridLazyLoadImageStyle} ${isLogoLoaded ? 'opacity-100' : 'opacity-0'}`}
                                    src={normalizeImageSource(company.Logo)}
                                    alt={language === languageSetting.english ? company.en.CompanyName : language === languageSetting.traditionalChinese ? company.zh.CompanyName : company.cn.CompanyName}
                                    onLoad={() => onLogoLoad(company.id)}
                                    onError={() => onLogoError(company.id)}
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
                {selectedCompany && (
                    <CompanyModalComponent
                        docID={selectedCompany.id}
                        companyName={language === languageSetting.english ? selectedCompany.en.CompanyName : language === languageSetting.traditionalChinese ? selectedCompany.zh.CompanyName : selectedCompany.cn.CompanyName}
                        team={language === languageSetting.english ? selectedCompany.en.Team : language === languageSetting.traditionalChinese ? selectedCompany.zh.Team : selectedCompany.cn.Team}
                        position={language === languageSetting.english ? selectedCompany.en.Position : language === languageSetting.traditionalChinese ? selectedCompany.zh.Position : selectedCompany.cn.Position}
                        jobDuties={language === languageSetting.english ? selectedCompany.en.JobDuties : language === languageSetting.traditionalChinese ? selectedCompany.zh.JobDuties : selectedCompany.cn.JobDuties}
                        projects={language === languageSetting.english ? selectedCompany.en.Projects : language === languageSetting.traditionalChinese ? selectedCompany.zh.Projects : selectedCompany.cn.Projects}
                        skillSets={selectedCompany.SkillSets}
                        startDate={selectedCompany.StartDate}
                        endDate={selectedCompany.EndDate}
                        present={selectedCompany.Present}
                        logo={normalizeImageSource(selectedCompany.Logo)}
                        createDate={selectedCompany.CreateDate}
                    />
                )}
            </Modal>
        </div>
    );
}
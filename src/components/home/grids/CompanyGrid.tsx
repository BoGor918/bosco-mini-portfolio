// others
import { useState, useContext } from 'react';
import { useDisclosure } from '@mantine/hooks';
// global variable
import { MapperContext } from '../../../globalVariable/MapperContextProvider';
import { colorTheme, getLoaderColor } from '../../../globalVariable/GlobalVariable';
// mantine components
import { Loader, Modal } from '@mantine/core';
// page components
import CompanyModalComponent from '../modals/CompanyModalComponent';
// react lazy load image
import { LazyLoadImage } from 'react-lazy-load-image-component';
// types
import { CompanyData } from '../../../types/type';
// util
import { gridStyles, getModalStyle, GridLoadingPlaceholder, NoRecordsFoundComponent } from './util';
import { normalizeImageSource } from '../../util';
// global variable
import { languageSetting } from '../../../globalVariable/Translation';

export default function CompanyGrid() {
    // global variable
    const {
        t,
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
    const loaderColor = getLoaderColor(theme);

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
                    <GridLoadingPlaceholder loaderColor={loaderColor} keyPrefix="company" />
                )}
                {!companyLoading && companyData.length === 0 && (
                    <NoRecordsFoundComponent translate={t} theme={theme} />
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
                                    <Loader type="bars" color={loaderColor} />
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
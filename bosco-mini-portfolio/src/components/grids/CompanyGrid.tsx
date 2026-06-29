// others
import { useState, useContext } from 'react';
import { useDisclosure } from '@mantine/hooks';
// global variable
import { MapperContext } from '../../globalVariable/MapperContextProvider';
import { colorTheme } from '../../globalVariable/GlobalVariable';
// mantine components
import { Loader, Modal } from '@mantine/core';
// page components
import CompanyModalComponent from '../modal/company/CompanyModalComponent';
// react lazy load image
import { LazyLoadImage } from 'react-lazy-load-image-component';
// types
import { CompanyData } from '../../types/type';
// util
import { gridStyles } from './util';
// global variable
import { languageSetting } from '../../globalVariable/Translation';

export default function CompanyGrid() {
    // global variable
    const {
        language,
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
                {companyData.map((company: CompanyData, i: number) => {
                    const hasLogoUrl = Boolean(company.Logo?.URL);
                    const showLogoFallback = !hasLogoUrl || failedLogoIds.has(company.id);
                    const isLogoLoaded = loadedLogoIds.has(company.id);
                    return (
                        <div key={i} onClick={() => openModal(company)} className={gridStyles.gridLazyLoadImageDivStyle}>
                            {!showLogoFallback && (
                                <LazyLoadImage
                                    className={`${gridStyles.gridLazyLoadImageStyle} ${isLogoLoaded ? 'opacity-100' : 'opacity-0'}`}
                                    src={company.Logo.URL}
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
                        </div>
                    );
                })}
            </div>
            {/* modal components */}
            {
                localStorage.getItem(colorTheme.theme) === colorTheme.light ?
                    <Modal opened={opened} onClose={close} size="lg" centered>
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
                                logo={selectedCompany.Logo.URL}
                                createDate={selectedCompany.CreateDate}
                            />
                        )}
                    </Modal> :
                    <Modal opened={opened} onClose={close} size="lg" centered
                        styles={{
                            header: {
                                backgroundColor: "#0B1A33",
                            },
                            content: {
                                backgroundColor: "#0B1A33",
                            },
                        }}
                    >
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
                                logo={selectedCompany.Logo.URL}
                                createDate={selectedCompany.CreateDate}
                            />
                        )}
                    </Modal>
            }
        </div>
    );
}
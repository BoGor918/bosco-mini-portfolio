// others
import { useState, useContext } from 'react';
import { useDisclosure } from '@mantine/hooks';
// global variable
import { MapperContext } from '../../../globalVariable/MapperContextProvider';
import { colorTheme, getLoaderColor } from '../../../globalVariable/GlobalVariable';
// mantine components
import { Loader, Modal } from '@mantine/core';
// page components
import SkillModalComponent from '../modals/SkillModalComponent';
// react lazy load image
import { LazyLoadImage } from 'react-lazy-load-image-component';
// types
import { SkillData } from '../../../types/type';
// util
import { gridStyles, getModalStyle, NoRecordsFoundComponent } from './util';
import { normalizeImageSource } from '../../util';

// loading placeholders for skeleton loaders
const loadingPlaceholders = Array.from({ length: 45 });

export default function SkillGrid() {
    // global variable
    const {
        t,
        theme,
        skillLoading,
        skillData
    } = useContext(MapperContext);
    // modal hook
    const [opened, { open, close }] = useDisclosure(false);
    // selected skill
    const [selectedSkill, setSelectedSkill] = useState<SkillData | null>(null);
    // loaded logo ids
    const [loadedLogoIds, setLoadedLogoIds] = useState<Set<SkillData['id']>>(new Set());
    // failed logo ids
    const [failedLogoIds, setFailedLogoIds] = useState<Set<SkillData['id']>>(new Set());

    // style list
    const { modalProps } = getModalStyle(theme === colorTheme.dark);
    const loaderColor = getLoaderColor(theme);

    // open modal with set selected skill
    const openModal = (skill: SkillData) => {
        setSelectedSkill(skill);
        open();
    };

    // mark failed logo so we can render a loader fallback for that item
    const onLogoError = (skillId: SkillData['id']) => {
        setFailedLogoIds((prev) => new Set(prev).add(skillId));
    };

    // mark logo as loaded so we can hide loader overlay
    const onLogoLoad = (skillId: SkillData['id']) => {
        setLoadedLogoIds((prev) => new Set(prev).add(skillId));
    };

    return (
        <div className={gridStyles.gridMainDivStyle}>
            {/* skill grid */}
            <div className={gridStyles.gridDivFiveColStyle}>
                {skillLoading && (
                    loadingPlaceholders.map((_, index) => (
                        <div
                            key={`skill-loading-${index}`}
                            className={gridStyles.gridLazyLoadImageSmallDivStyle}
                            aria-hidden="true"
                        >
                            <Loader size="lg" type="bars" color={loaderColor} />
                        </div>
                    ))
                )}
                {!skillLoading && skillData.length === 0 && (
                    <NoRecordsFoundComponent translate={t} theme={theme} />
                )}
                {!skillLoading && skillData.map((skill: SkillData, i: number) => {
                    const hasLogoUrl = Boolean(skill.Logo);
                    const showLogoFallback = !hasLogoUrl || failedLogoIds.has(skill.id);
                    const isLogoLoaded = loadedLogoIds.has(skill.id);
                    return (
                        <button
                            key={i}
                            type="button"
                            onClick={() => openModal(skill)}
                            className={gridStyles.gridLazyLoadImageSmallDivStyle}
                            aria-label={`Open ${skill.SkillName}`}
                        >
                            {!showLogoFallback && (
                                <LazyLoadImage
                                    className={`${gridStyles.gridLazyLoadImageStyle} ${isLogoLoaded ? 'opacity-100' : 'opacity-0'}`}
                                    src={normalizeImageSource(skill.Logo)}
                                    alt={skill.SkillName}
                                    onLoad={() => onLogoLoad(skill.id)}
                                    onError={() => onLogoError(skill.id)}
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
            <Modal opened={opened} onClose={close} size="md" centered {...modalProps}>
                {selectedSkill && (
                    <SkillModalComponent
                        skillName={selectedSkill.SkillName}
                        logo={normalizeImageSource(selectedSkill.Logo)}
                    />
                )}
            </Modal>
        </div>
    );
}
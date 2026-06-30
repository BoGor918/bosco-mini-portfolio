// others
import { useState, useContext } from 'react';
import { useDisclosure } from '@mantine/hooks';
// global variable
import { MapperContext } from '../../globalVariable/MapperContextProvider';
import { colorTheme } from '../../globalVariable/GlobalVariable';
// mantine components
import { Loader, Modal } from '@mantine/core';
// page components
import SkillModalComponent from '../modal/skill/SkillModalComponent';
// react lazy load image
import { LazyLoadImage } from 'react-lazy-load-image-component';
// types
import { SkillData } from '../../types/type';
// util
import { gridStyles } from './util';

export default function SkillGrid() {
    // global variable
    const {
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
                {skillData.map((skill: SkillData, i: number) => {
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
                                    src={skill.Logo}
                                    alt={skill.SkillName}
                                    onLoad={() => onLogoLoad(skill.id)}
                                    onError={() => onLogoError(skill.id)}
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
                    <Modal opened={opened} onClose={close} size="md" centered>
                        {selectedSkill && (
                            <SkillModalComponent
                                skillName={selectedSkill.SkillName}
                                logo={selectedSkill.Logo}
                            />
                        )}
                    </Modal> :
                    <Modal opened={opened} onClose={close} size="md" centered
                        styles={{
                            header: {
                                backgroundColor: "#0B1A33",
                            },
                            content: {
                                backgroundColor: "#0B1A33",
                            },
                        }}
                    >
                        {selectedSkill && (
                            <SkillModalComponent
                                skillName={selectedSkill.SkillName}
                                logo={selectedSkill.Logo}
                            />
                        )}
                    </Modal>
            }
        </div>
    );
}
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

    return (
        <div className={gridStyles.gridMainDivStyle}>
            {/* skill grid */}
            <div className={gridStyles.gridDivFiveColStyle}>
                {skillData.map((skill: SkillData, i: number) => {
                    const hasLogoUrl = Boolean(skill.Logo);
                    const showLogoFallback = !hasLogoUrl || failedLogoIds.has(skill.id);
                    return (
                        <div key={i} onClick={() => openModal(skill)} className={gridStyles.gridLazyLoadImageSmallDivStyle}>
                            {showLogoFallback ? (
                                <div className="flex justify-center w-[295.33px]">
                                    <Loader type="bars" color="blue" />
                                </div>
                            ) : (
                                <LazyLoadImage
                                    className={gridStyles.gridLazyLoadImageStyle}
                                    src={skill.Logo}
                                    alt={skill.SkillName}
                                    onError={() => onLogoError(skill.id)}
                                />
                            )}
                        </div>
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
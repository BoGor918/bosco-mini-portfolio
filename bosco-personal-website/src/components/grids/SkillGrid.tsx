// others
import { useState, useContext } from 'react';
import { useDisclosure } from '@mantine/hooks';
// global variable
import { MapperContext } from '../../globalVariable/MapperContextProvider';
import { colorTheme } from '../../globalVariable/GlobalVariable';
// mantine components
import { Modal } from '@mantine/core';
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

    // open modal with set selected skill
    const openModal = (skill: SkillData) => {
        setSelectedSkill(skill);
        open();
    };

    return (
        <div className={gridStyles.gridMainDivStyle}>
            {/* skill grid */}
            <div className={gridStyles.gridDivFiveColStyle}>
                {skillData.map((skill: any, i: any) => (
                    <div key={i} onClick={() => openModal(skill)} className={gridStyles.gridLazyLoadImageSmallDivStyle}>
                        <LazyLoadImage
                            className={gridStyles.gridLazyLoadImageStyle}
                            src={skill.Logo}
                            alt={skill.SkillName}
                        />
                    </div>
                ))}
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
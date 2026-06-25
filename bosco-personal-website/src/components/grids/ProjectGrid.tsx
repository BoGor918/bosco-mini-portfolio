// others
import { useState, useContext } from 'react';
import { useDisclosure } from '@mantine/hooks';
// global variable
import { MapperContext } from '../../globalVariable/MapperContextProvider';
import { colorTheme } from '../../globalVariable/GlobalVariable';
// mantine components
import { Modal } from '@mantine/core';
// page components
import ProjectModalComponent from '../modal/project/ProjectModalComponent';
// react lazy load image
import { LazyLoadImage } from 'react-lazy-load-image-component';
// util
import { gridStyles } from './util';

// project interface
interface Project {
    id: string;
    ProjectName: string;
    TechStack: [];
    Description: string;
    Link: []
    Logo: string;
    CreateDate: Date;
}

export default function ProjectGrid() {
    // global variable
    const {
        projectData
    } = useContext(MapperContext);

    // modal hook
    const [opened, { open, close }] = useDisclosure(false);
    // selected project
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    // open modal with set selected project
    const openModal = (project: Project) => {
        setSelectedProject(project);
        open();
    };

    return (
        <div className={gridStyles.gridMainDivStyle}>
            {/* project grid */}
            <div className={gridStyles.gridDivThreeColStyle}>
                {projectData.map((project: any, i: any) => (
                    <div key={i} onClick={() => openModal(project)} className={gridStyles.gridLazyLoadImageDivStyle}>
                        <LazyLoadImage
                            className={gridStyles.gridLazyLoadImageStyle}
                            src={project.Logo}
                            alt={project.ProjectName}
                        />
                    </div>
                ))}
            </div>
            {/* modal components */}
            {
                localStorage.getItem(colorTheme.theme) === colorTheme.light ?
                    <Modal opened={opened} onClose={close} size="lg" centered>
                        {selectedProject && (
                            <ProjectModalComponent
                                projectName={selectedProject.ProjectName}
                                description={selectedProject.Description}
                                techStack={selectedProject.TechStack}
                                link={selectedProject.Link}
                                logo={selectedProject.Logo}
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
                        {selectedProject && (
                            <ProjectModalComponent
                                projectName={selectedProject.ProjectName}
                                description={selectedProject.Description}
                                techStack={selectedProject.TechStack}
                                link={selectedProject.Link}
                                logo={selectedProject.Logo}
                            />
                        )}
                    </Modal>
            }
        </div>
    );
}
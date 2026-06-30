// others
import { useState, useContext } from 'react';
import { useDisclosure } from '@mantine/hooks';
// global variable
import { MapperContext } from '../../globalVariable/MapperContextProvider';
import { colorTheme } from '../../globalVariable/GlobalVariable';
// mantine components
import { Loader, Modal } from '@mantine/core';
// page components
import ProjectModalComponent from '../modal/project/ProjectModalComponent';
// react lazy load image
import { LazyLoadImage } from 'react-lazy-load-image-component';
// type
import { ProjectData } from '../../types/type';
// util
import { gridStyles } from './util';
// global variable
import { languageSetting } from '../../globalVariable/Translation';

export default function CompanyGrid() {
    // global variable
    const {
        language,
        projectData
    } = useContext(MapperContext);

    // modal hook
    const [opened, { open, close }] = useDisclosure(false);
    // selected project
    const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
    // loaded logo ids
    const [loadedLogoIds, setLoadedLogoIds] = useState<Set<ProjectData['id']>>(new Set());
    // failed logo ids
    const [failedLogoIds, setFailedLogoIds] = useState<Set<ProjectData['id']>>(new Set());

    // open modal with set selected project
    const openModal = (project: ProjectData) => {
        setSelectedProject(project);
        open();
    };

    // mark failed logo so we can render a loader fallback for that item
    const onLogoError = (projectId: ProjectData['id']) => {
        setFailedLogoIds((prev) => new Set(prev).add(projectId));
    };

    // mark logo as loaded so we can hide loader overlay
    const onLogoLoad = (projectId: ProjectData['id']) => {
        setLoadedLogoIds((prev) => new Set(prev).add(projectId));
    };

    return (
        <div className={gridStyles.gridMainDivStyle}>
            {/* project grid */}
            <div className={gridStyles.gridDivThreeColStyle}>
                {projectData.map((project: ProjectData, i: number) => {
                    const hasLogoUrl = Boolean(project.Logo);
                    const showLogoFallback = !hasLogoUrl || failedLogoIds.has(project.id);
                    const isLogoLoaded = loadedLogoIds.has(project.id);
                    return (
                        <button
                            key={i}
                            type="button"
                            onClick={() => openModal(project)}
                            className={gridStyles.gridLazyLoadImageDivStyle}
                            aria-label={`Open ${project.ProjectName}`}
                        >
                            {!showLogoFallback && (
                                <LazyLoadImage
                                    className={`${gridStyles.gridLazyLoadImageStyle} ${isLogoLoaded ? 'opacity-100' : 'opacity-0'}`}
                                    src={project.Logo}
                                    alt={project.ProjectName}
                                    onLoad={() => onLogoLoad(project.id)}
                                    onError={() => onLogoError(project.id)}
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
                        {selectedProject && (
                            <ProjectModalComponent
                                projectName={selectedProject.ProjectName}
                                description={language === languageSetting.english ? selectedProject.en.Description : language === languageSetting.traditionalChinese ? selectedProject.zh.Description : selectedProject.cn.Description}
                                techStack={selectedProject.TechStack}
                                link={selectedProject.Link}
                                logo={selectedProject.Logo}
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
                        {selectedProject && (
                            <ProjectModalComponent
                                projectName={selectedProject.ProjectName}
                                description={language === languageSetting.english ? selectedProject.en.Description : language === languageSetting.traditionalChinese ? selectedProject.zh.Description : selectedProject.cn.Description}
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
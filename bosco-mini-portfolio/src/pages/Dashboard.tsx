// react
import { useContext, useEffect, useMemo, useState } from 'react'
// route
import { useNavigate, useSearchParams } from 'react-router-dom';
// mantine
import { Button, LoadingOverlay, Modal, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
// components
import CompanyTable from '../components/dashboard/tables/CompanyTable';
import SkillTable from '../components/dashboard/tables/SkillTable';
import SchoolTable from '../components/dashboard/tables/SchoolTable';
import ProjectTable from '../components/dashboard/tables/ProjectTable';
import DashboardCompanyModalComponent from '../components/dashboard/modals/DashboardCompanyModalComponent';
import DashboardSkillModalComponent from '../components/dashboard/modals/DashboardSkillModalComponent';
import DashboardSchoolModalComponent from '../components/dashboard/modals/DashboardSchoolModalComponent';
import DashboardProjectModalComponent from '../components/dashboard/modals/DashboardProjectModalComponent';
// icon
import { IoMdAddCircle } from "react-icons/io";
import { BiMoon, BiSolidMoon } from 'react-icons/bi';
// global variable
import { MapperContext } from '../globalVariable/MapperContextProvider';
import { colorTheme } from '../globalVariable/GlobalVariable';
import { languageSetting, translationKeys } from '../globalVariable/Translation';
import { showNotification } from '../globalVariable/Notification';
// type
import { CompanyData, ProjectData, SchoolData, SkillData } from '../types/type';
// util
import { ErrorNotificationType, SuccessNotificationType } from '../components/dashboard/modals/util';
// query
import { deleteCompanyDocument } from '../query/CompanyQuery';
import { deleteProjectDocument } from '../query/ProjectQuery';
import { deleteSchoolDocument } from '../query/SchoolQuery';
import { deleteSkillDocument } from '../query/SkillQuery';
// firebase
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

// valid widgets for dashboard
const validWidgets = new Set(["c", "e", "p", "s"]);

// modal mode
export type modalCreateModeType = "create";
export type modalEditModeType = "edit";
export const modalCreateMode = 'create';
export const modalEditMode = 'edit';

export default function Dashboard() {
    // context
    const { t, language, setLanguage, theme, setTheme, loginUser, setLoginUser, loadPortfolioData } = useContext(MapperContext);
    const isReadOnly = loginUser?.IsAdmin !== true;
    // hook
    const [opened, { open, close }] = useDisclosure(false);
    const [isModalSaving, setIsModalSaving] = useState(false);
    const [isModalDirty, setIsModalDirty] = useState(false);
    const [confirmCloseOpened, setConfirmCloseOpened] = useState(false);
    const [confirmDeleteOpened, setConfirmDeleteOpened] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [companyModalMode, setCompanyModalMode] = useState<modalCreateModeType | modalEditModeType>(modalCreateMode);
    const [skillModalMode, setSkillModalMode] = useState<modalCreateModeType | modalEditModeType>(modalCreateMode);
    const [projectModalMode, setProjectModalMode] = useState<modalCreateModeType | modalEditModeType>(modalCreateMode);
    const [schoolModalMode, setSchoolModalMode] = useState<modalCreateModeType | modalEditModeType>(modalCreateMode);
    const [editingCompany, setEditingCompany] = useState<CompanyData | null>(null);
    const [editingSkill, setEditingSkill] = useState<SkillData | null>(null);
    const [editingProject, setEditingProject] = useState<ProjectData | null>(null);
    const [editingSchool, setEditingSchool] = useState<SchoolData | null>(null);
    const [signOutLoading, setSignOutLoading] = useState(false);
    // url param
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const widget = searchParams.get("d") ?? "c";
    // dashboard navigation items
    const dashboardNavItems = useMemo(() => [
        { key: 'c', label: t(translationKeys.company) },
        { key: 'e', label: t(translationKeys.education) },
        { key: 'p', label: t(translationKeys.project) },
        { key: 's', label: t(translationKeys.skill) },
    ], [t]);
    // modal title
    const modalTitle = widget === dashboardNavItems[0].key
        ? companyModalMode === 'edit' ? `${t(translationKeys.edit)}${t(translationKeys.company)}` : `${t(translationKeys.add)}${t(translationKeys.company)}`
        : widget === dashboardNavItems[3].key
            ? skillModalMode === 'edit' ? `${t(translationKeys.edit)}${t(translationKeys.skill)}` : `${t(translationKeys.add)}${t(translationKeys.skill)}`
            : widget === dashboardNavItems[2].key
                ? projectModalMode === 'edit' ? `${t(translationKeys.edit)}${t(translationKeys.project)}` : `${t(translationKeys.add)}${t(translationKeys.project)}`
                : schoolModalMode === 'edit' ? `${t(translationKeys.edit)}${t(translationKeys.education)}` : `${t(translationKeys.add)}${t(translationKeys.education)}`;
    // dashboard title
    const dashboardTitle = widget === "c" ? `${t(translationKeys.companys)}` : widget === "s" ? `${t(translationKeys.skills)}` : widget === "p" ? `${t(translationKeys.projects)}` : `${t(translationKeys.educations)}`;
    // modal handle
    const isEditModalOpen =
        (widget === 'c' && companyModalMode === modalEditMode) ||
        (widget === 's' && skillModalMode === modalEditMode) ||
        (widget === 'p' && projectModalMode === modalEditMode) ||
        (widget === 'e' && schoolModalMode === modalEditMode);
    const shouldBlockCloseForUnsavedChanges = isEditModalOpen && isModalDirty;
    const deleteTargetLabel = widget === 'c'
        ? t(translationKeys.company)
        : widget === 's'
            ? t(translationKeys.skill)
            : widget === 'p'
                ? t(translationKeys.project)
                : t(translationKeys.school);
    const addEditModalStyles = theme === colorTheme.dark
        ? {
            header: {
                backgroundColor: "#0B1A33",
            },
            content: {
                backgroundColor: "#0B1A33",
            },
            title: {
                color: "#94A3B8",
            },
        }
        : undefined;
        
    // load portfolio data on component mount
    useEffect(() => {
        loadPortfolioData();
    }, [loadPortfolioData]);

    // style list
    const dashboardContainerStyle = `flex flex-col my-auto w-full px-4 mt-[5rem]`;
    const languageSwitchAndThemeContainerStyle = `w-full mb-3 flex flex-wrap items-center gap-2`;
    const languageSwitchContainerStyle = `flex items-center gap-2`;
    const languageSwitchButtonStyle = (isActive: boolean) =>
        `px-2 py-1 border rounded-md text-[11px] font-semibold transition ` + (theme === colorTheme.dark
            ? isActive
                ? `border-[#21D4F7] bg-[#21D4F7] text-[#0B1A33]`
                : `border-white/45 text-white hover:bg-white/10`
            : isActive
                ? `border-[#0B1A33] bg-[#0B1A33] text-white`
                : `border-[#0B1A33]/45 text-[#0B1A33] hover:bg-[#0B1A33]/10`);
    const themeSwitchButtonStyle = `p-1 border-[2px] rounded-full` + (theme !== colorTheme.dark ? ` border-[#0B1A33] hover:bg-[#0B1A33]/10` : ` border-[#FFFFFF] hover:bg-[#FFFFFF]/10`);
    const biMoonIconStyle = `text-[22px] sm:text-[22px] md:text-[22px] lg:text-[24px]`;
    const biSolidMoonIconStyle = `text-[#FFFFFF] text-[22px] sm:text-[22px] md:text-[22px] lg:text-[24px]`;
    const navContainerStyle = `w-full mb-3 flex flex-wrap gap-2`;
    const navButtonStyle = (isActive: boolean) =>
        `px-2 py-1 border rounded-md text-[14px] font-semibold transition ` + (theme === colorTheme.dark
            ? isActive
                ? `border-[#21D4F7] bg-[#21D4F7] text-[#0B1A33]`
                : `border-white/45 text-white hover:bg-white/10`
            : isActive
                ? `border-[#0B1A33] bg-[#0B1A33] text-white`
                : `border-[#0B1A33]/45 text-[#0B1A33] hover:bg-[#0B1A33]/10`);
    const titleAndAddButtonContainerStyle = `flex justify-between items-center w-full mb-2`;
    const welcomeTextContainerStyle = `w-full flex justify-start pb-1`;
    const welcomeTextStyle = `block text-left font-bold text-xl ${theme === colorTheme.dark ? 'text-white' : 'text-[#0F172A]'}`;
    const titleStyle = `font-bold text-xl mr-auto ${theme === colorTheme.dark ? 'text-white' : 'text-[#0F172A]'}`;
    const addIconStyle = `cursor-pointer text-[22px] sm:text-[22px] md:text-[22px] lg:text-[24px] ${theme === colorTheme.dark ? 'text-white hover:text-white/70' : 'text-[#0B1A33] hover:text-[#0B1A33]/70'}`;
    const unsavedChangesDescriptionStyle = `text-sm ${theme === colorTheme.dark ? 'text-white' : 'text-[#0F172A]'}`;
    const unsavedChangesButtonContainerStyle = `mt-4 flex justify-end gap-2`;
    const keepEditingButtonStyle = `px-3 py-2 rounded border` + (theme === colorTheme.dark ? ` bg-[#4094F4] hover:bg-[#4094F4]/90` : ` bg-[#0B1A33] hover:bg-[#0B1A33]/90`);
    const discardButtonStyle = `px-3 py-2 rounded bg-red-600 hover:bg-red-700 text-white`;
    const footerActionsContainerStyle = 'w-full pt-3 mt-3 border-t flex items-center' + (theme === colorTheme.dark ? 'border-white/20' : 'border-[#0B1A33]/15');
    const signOutButtonStyle = `inline-flex items-center rounded-md border px-3 py-1.5 text-[13px] font-semibold transition bg-red-600 hover:bg-red-700 text-white mr-2`;
    const backToHomeButtonStyle = `inline-flex items-center rounded-md border px-3 py-1.5 text-[13px] font-semibold transition` + (theme === colorTheme.dark ? ` bg-[#4094F4] hover:bg-[#4094F4]/90` : ` bg-[#0B1A33] hover:bg-[#0B1A33]/90`);

    // effect to handle invalid widget in url param
    useEffect(() => {
        if (!validWidgets.has(widget)) {
            setSearchParams({ d: dashboardNavItems[0].key }, { replace: true });
        }
    }, [setSearchParams, widget, dashboardNavItems]);

    // handle modal open and close
    const handleOpenModal = () => {
        setCompanyModalMode(modalCreateMode);
        setSkillModalMode(modalCreateMode);
        setProjectModalMode(modalCreateMode);
        setSchoolModalMode(modalCreateMode);
        setEditingCompany(null);
        setEditingSkill(null);
        setEditingProject(null);
        setEditingSchool(null);
        setIsModalSaving(false);
        setIsModalDirty(false);
        setConfirmCloseOpened(false);
        open();
    };

    // handle edit functions for each widget
    const handleEditCompany = (company: CompanyData) => {
        setCompanyModalMode(modalEditMode);
        setEditingCompany(company);
        setIsModalSaving(false);
        setIsModalDirty(false);
        setConfirmCloseOpened(false);
        open();
    };
    const handleEditSchool = (school: SchoolData) => {
        setSchoolModalMode(modalEditMode);
        setEditingSchool(school);
        setIsModalSaving(false);
        setIsModalDirty(false);
        setConfirmCloseOpened(false);
        open();
    };
    const handleEditProject = (project: ProjectData) => {
        setProjectModalMode(modalEditMode);
        setEditingProject(project);
        setIsModalSaving(false);
        setIsModalDirty(false);
        setConfirmCloseOpened(false);
        open();
    };
    const handleEditSkill = (skill: SkillData) => {
        setSkillModalMode(modalEditMode);
        setEditingSkill(skill);
        setIsModalSaving(false);
        setIsModalDirty(false);
        setConfirmCloseOpened(false);
        open();
    };

    // handle modal close and reset modal state
    const closeAndResetModalState = () => {
        setIsModalSaving(false);
        setIsModalDirty(false);
        setConfirmCloseOpened(false);
        setConfirmDeleteOpened(false);
        setIsDeleting(false);
        close();
        setCompanyModalMode(modalCreateMode);
        setSkillModalMode(modalCreateMode);
        setProjectModalMode(modalCreateMode);
        setSchoolModalMode(modalCreateMode);
        setEditingCompany(null);
        setEditingSkill(null);
        setEditingProject(null);
        setEditingSchool(null);
    };

    // handle modal close with unsaved changes check
    const handleCloseModal = () => {
        if (isModalSaving) {
            return;
        }

        if (shouldBlockCloseForUnsavedChanges) {
            setConfirmCloseOpened(true);
            return;
        }

        closeAndResetModalState();
    };

    // handle discard unsaved changes
    const handleDiscardUnsavedChanges = () => {
        closeAndResetModalState();
    };

    const handleOpenDeleteConfirm = () => {
        if (isModalSaving || !isEditModalOpen || isReadOnly) {
            return;
        }

        setConfirmDeleteOpened(true);
    };

    const handleConfirmDelete = async () => {
        if (isDeleting) {
            return;
        }

        setIsDeleting(true);

        try {
            if (widget === 'c' && editingCompany) {
                await deleteCompanyDocument(editingCompany.id);
            } else if (widget === 's' && editingSkill) {
                await deleteSkillDocument(String(editingSkill.id));
            } else if (widget === 'p' && editingProject) {
                await deleteProjectDocument(editingProject.id);
            } else if (widget === 'e' && editingSchool) {
                await deleteSchoolDocument(editingSchool.id);
            } else {
                setConfirmDeleteOpened(false);
                return;
            }

            showNotification(`${deleteTargetLabel} ${t(translationKeys.delete)}d successfully.`, SuccessNotificationType);
            closeAndResetModalState();
        } catch {
            showNotification(`Failed to ${t(translationKeys.delete).toLowerCase()} ${deleteTargetLabel}.`, ErrorNotificationType);
        } finally {
            setIsDeleting(false);
        }
    };

    // handle navigate to different widget
    const handleNavigateWidget = (nextWidget: string) => {
        setSearchParams({ d: nextWidget });
    };

    // handle theme switch
    const handleThemeSwitch = () => {
        setTheme(theme === colorTheme.dark ? colorTheme.light : colorTheme.dark);
    };

    // sign out
    const onSignOut = async () => {
        setSignOutLoading(true);

        try {
            await signOut(auth);
            await setLoginUser(null);
            showNotification(`${t(translationKeys.signOutMessage)}`, SuccessNotificationType);
            navigate('/', { replace: true });
        } catch {
            showNotification(`${t(translationKeys.failedToSignOut)}`, ErrorNotificationType);
        } finally {
            setSignOutLoading(false);
        }
    };

    return (
        <div className={dashboardContainerStyle}>
            <div className={welcomeTextContainerStyle}>
                <span className={welcomeTextStyle}>{loginUser ? `${t(translationKeys.welcome)}, ${loginUser.Username}` : t(translationKeys.welcome)}</span>
            </div>
            <div className={languageSwitchAndThemeContainerStyle}>
                <div className={languageSwitchContainerStyle}>
                    <button
                        type="button"
                        onClick={() => setLanguage(languageSetting.english)}
                        className={languageSwitchButtonStyle(language === languageSetting.english)}
                    >
                        {t(translationKeys.englishLanguage)}
                    </button>
                    <button
                        type="button"
                        onClick={() => setLanguage(languageSetting.traditionalChinese)}
                        className={languageSwitchButtonStyle(language === languageSetting.traditionalChinese)}
                    >
                        {t(translationKeys.tranditionalChineseLanguage)}
                    </button>
                    <button
                        type="button"
                        onClick={() => setLanguage(languageSetting.simplifiedChinese)}
                        className={languageSwitchButtonStyle(language === languageSetting.simplifiedChinese)}
                    >
                        {t(translationKeys.simplifiedChineseLanguage)}
                    </button>
                </div>
                <button type="button" onClick={handleThemeSwitch} className={themeSwitchButtonStyle}>
                    {
                        theme === colorTheme.light
                            ? <BiMoon className={biMoonIconStyle} />
                            : <BiSolidMoon className={biSolidMoonIconStyle} />
                    }
                </button>
            </div>
            <nav className={navContainerStyle}>
                {dashboardNavItems.map(({ key, label }) => {
                    const isActive = widget === key;
                    return (
                        <button
                            key={key}
                            type="button"
                            onClick={() => handleNavigateWidget(key)}
                            className={navButtonStyle(isActive)}
                        >
                            {label}
                        </button>
                    );
                })}
            </nav>
            <div className={titleAndAddButtonContainerStyle}>
                <span className={titleStyle}>{dashboardTitle}:</span>
                <Tooltip label={modalTitle}>
                    <button
                        type="button"
                        className="inline-flex"
                        onClick={handleOpenModal}
                        aria-label={modalTitle}
                    >
                        <IoMdAddCircle className={addIconStyle} />
                    </button>
                </Tooltip>
            </div>
            {widget === dashboardNavItems[3].key
                ? <SkillTable onEditSkill={handleEditSkill} />
                : widget === dashboardNavItems[1].key
                    ? <SchoolTable onEditSchool={handleEditSchool} />
                    : widget === dashboardNavItems[2].key
                        ? <ProjectTable onEditProject={handleEditProject} />
                        : <CompanyTable onEditCompany={handleEditCompany} />}
            <div className={footerActionsContainerStyle}>
                <Button
                    type="button"
                    onClick={onSignOut}
                    className={signOutButtonStyle}
                    disabled={signOutLoading}
                >
                    {signOutLoading ? `${t(translationKeys.signOut)}...` : t(translationKeys.signOut)}
                </Button>
                <Button
                    type="button"
                    onClick={() => navigate('/')}
                    className={backToHomeButtonStyle}
                >
                    {t(translationKeys.backToHome)}
                </Button>
            </div>
            {/* add or edit modal */}
            <Modal
                opened={opened}
                onClose={handleCloseModal}
                size="lg"
                title={modalTitle}
                centered
                closeOnClickOutside={!isModalSaving}
                closeOnEscape={!isModalSaving}
                withCloseButton={!isModalSaving}
                closeButtonProps={theme === colorTheme.dark ? { className: 'intro-modal-close-btn' } : undefined}
                styles={addEditModalStyles}
            >
                {widget === dashboardNavItems[0].key
                    ? <DashboardCompanyModalComponent closeModal={closeAndResetModalState} onSavingChange={setIsModalSaving} onDirtyChange={setIsModalDirty} mode={companyModalMode} initialCompany={editingCompany} onDeleteRequest={handleOpenDeleteConfirm} readOnly={isReadOnly} />
                    : widget === dashboardNavItems[3].key
                        ? <DashboardSkillModalComponent closeModal={closeAndResetModalState} onSavingChange={setIsModalSaving} onDirtyChange={setIsModalDirty} mode={skillModalMode} initialSkill={editingSkill} onDeleteRequest={handleOpenDeleteConfirm} readOnly={isReadOnly} />
                        : widget === dashboardNavItems[2].key
                            ? <DashboardProjectModalComponent closeModal={closeAndResetModalState} onSavingChange={setIsModalSaving} onDirtyChange={setIsModalDirty} mode={projectModalMode} initialProject={editingProject} onDeleteRequest={handleOpenDeleteConfirm} readOnly={isReadOnly} />
                            : <DashboardSchoolModalComponent closeModal={closeAndResetModalState} onSavingChange={setIsModalSaving} onDirtyChange={setIsModalDirty} mode={schoolModalMode} initialSchool={editingSchool} onDeleteRequest={handleOpenDeleteConfirm} readOnly={isReadOnly} />}
            </Modal>
            {/* discard modal */}
            <Modal
                opened={confirmCloseOpened}
                onClose={() => setConfirmCloseOpened(false)}
                size="lg"
                title={t(translationKeys.unsavedChanges)}
                centered
                closeOnClickOutside={!isModalSaving}
                closeOnEscape={!isModalSaving}
                withCloseButton={!isModalSaving}
                closeButtonProps={theme === colorTheme.dark ? { className: 'intro-modal-close-btn' } : undefined}
                styles={addEditModalStyles}
            >
                <div className="relative">
                    <LoadingOverlay
                        visible={isModalSaving}
                        zIndex={1000}
                        overlayProps={{
                            radius: 'sm',
                            blur: 1.5,
                            backgroundOpacity: 0.35,
                            color: theme === colorTheme.dark ? '#0B1A33' : '#334155',
                        }}
                    />
                    <p className={unsavedChangesDescriptionStyle}>
                        {t(translationKeys.unsavedChangesDescription)}
                    </p>
                    <div className={unsavedChangesButtonContainerStyle}>
                        <Button
                            type="button"
                            className={keepEditingButtonStyle}
                            onClick={() => setConfirmCloseOpened(false)}
                        >
                            {t(translationKeys.keepEditing)}
                        </Button>
                        <Button
                            type="button"
                            className={discardButtonStyle}
                            onClick={handleDiscardUnsavedChanges}
                        >
                            {t(translationKeys.discard)}
                        </Button>
                    </div>
                </div>
            </Modal>
            {/* delete confirm modal */}
            <Modal
                opened={confirmDeleteOpened}
                onClose={() => setConfirmDeleteOpened(false)}
                size="lg"
                title={`${t(translationKeys.delete)} ${deleteTargetLabel}`}
                centered
                closeOnClickOutside={!isDeleting}
                closeOnEscape={!isDeleting}
                withCloseButton={!isDeleting}
                closeButtonProps={theme === colorTheme.dark ? { className: 'intro-modal-close-btn' } : undefined}
                styles={addEditModalStyles}
            >
                <div className="relative">
                    <LoadingOverlay
                        visible={isDeleting}
                        zIndex={1000}
                        overlayProps={{
                            radius: 'sm',
                            blur: 1.5,
                            backgroundOpacity: 0.35,
                            color: theme === colorTheme.dark ? '#0B1A33' : '#334155',
                        }}
                    />
                    <p className={unsavedChangesDescriptionStyle}>
                        This action cannot be undone. Are you sure you want to continue?
                    </p>
                    <div className={unsavedChangesButtonContainerStyle}>
                        <Button
                            type="button"
                            className={keepEditingButtonStyle}
                            onClick={() => setConfirmDeleteOpened(false)}
                            disabled={isDeleting}
                        >
                            {t(translationKeys.keepEditing)}
                        </Button>
                        <Button
                            type="button"
                            className={discardButtonStyle}
                            onClick={handleConfirmDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? `${t(translationKeys.delete)}...` : t(translationKeys.delete)}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

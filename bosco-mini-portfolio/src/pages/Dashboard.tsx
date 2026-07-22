import React, { useContext, useEffect, useState } from 'react'
import { useDisclosure } from '@mantine/hooks';
import CompanyTable from '../components/dashboard/table/CompanyTable';
import SkillTable from '../components/dashboard/table/SkillTable';
import { IoMdAddCircle } from "react-icons/io";
import { MapperContext } from '../globalVariable/MapperContextProvider';
import { colorTheme } from '../globalVariable/GlobalVariable';
import { Modal } from '@mantine/core';
import { useSearchParams } from 'react-router-dom';
import AddCompanyModalContent from '../components/dashboard/company/AddCompanyModalContent';
import AddSkillModalContent from '../components/dashboard/skill/AddSkillModalContent';

const validWidgets = new Set(["c", "e", "p", "s"]);

export default function Dashboard() {
    // context
    const { theme } = useContext(MapperContext);
    // theme
    const isDarkTheme = theme === colorTheme.dark;
    // modal hook
    const [opened, { open, close }] = useDisclosure(false);
    const [isModalSaving, setIsModalSaving] = useState(false);
    // url param
    const [searchParams, setSearchParams] = useSearchParams();
    const widget = searchParams.get("d") ?? "1";
    // modal title
    const modalTitle = widget === "c" ? "Add Company" : widget === "s" ? "Add Skill" : widget === "p" ? "Add Project" : "Add Education";
    // dashboard title
    const dashboardTitle = widget === "c" ? "Companies" : widget === "s" ? "Skills" : widget === "p" ? "Projects" : "Educations";

    useEffect(() => {
        if (!validWidgets.has(widget)) {
            setSearchParams({ d: "c" }, { replace: true });
        }
    }, [setSearchParams, widget]);

    const handleOpenModal = () => {
        setIsModalSaving(false);
        open();
    };

    const handleCloseModal = () => {
        if (isModalSaving) {
            return;
        }

        setIsModalSaving(false);
        close();
    };

    // style list
    const dashboardContainerStyle = `flex flex-col justify-center items-center my-auto w-full h-screen px-4`;

    return (
        <div className={dashboardContainerStyle}>
            <div className="flex space-between items-center w-full mb-2">
                <span className={`text-xl mr-auto ${isDarkTheme ? 'text-white' : 'text-[#0F172A]'}`}>{dashboardTitle}:</span>
                <IoMdAddCircle onClick={handleOpenModal} className={`cursor-pointer text-[22px] sm:text-[22px] md:text-[22px] lg:text-[24px] ${isDarkTheme ? 'text-white' : 'text-[#0F172A]'}`} />
            </div>
            {widget === "s" ? <SkillTable /> : <CompanyTable />}
            {/* modal components */}
            {
                theme === colorTheme.light ?
                    <Modal
                        opened={opened}
                        onClose={handleCloseModal}
                        size="lg"
                        title={modalTitle}
                        centered
                        closeOnClickOutside={!isModalSaving}
                        closeOnEscape={!isModalSaving}
                        withCloseButton={!isModalSaving}
                    >
                        {widget === "c" ? <AddCompanyModalContent closeModal={handleCloseModal} onSavingChange={setIsModalSaving} /> : widget === "s" ? <AddSkillModalContent closeModal={handleCloseModal} onSavingChange={setIsModalSaving} /> : widget === "p" ? "Add Project" : "Add Education"}
                    </Modal> :
                    <Modal opened={opened} onClose={handleCloseModal} size="lg" title={modalTitle} centered
                        closeOnClickOutside={!isModalSaving}
                        closeOnEscape={!isModalSaving}
                        withCloseButton={!isModalSaving}
                        closeButtonProps={{ className: 'intro-modal-close-btn' }}
                        styles={{
                            header: {
                                backgroundColor: "#0B1A33",
                            },
                            content: {
                                backgroundColor: "#0B1A33",
                            },
                            title: {
                                color: "#94A3B8",
                            },
                        }}
                    >
                        {widget === "c" ? <AddCompanyModalContent closeModal={handleCloseModal} onSavingChange={setIsModalSaving} /> : widget === "s" ? <AddSkillModalContent closeModal={handleCloseModal} onSavingChange={setIsModalSaving} /> : widget === "p" ? "Add Project" : "Add Education"}
                    </Modal>
            }
        </div>
    )
}

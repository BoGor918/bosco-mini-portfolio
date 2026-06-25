// others
import { useState, useContext } from 'react';
import { useDisclosure } from '@mantine/hooks';
// global variable
import { MapperContext } from '../../globalVariable/MapperContextProvider';
import { colorTheme } from '../../globalVariable/GlobalVariable';
// mantine components
import { Modal } from '@mantine/core';
// page components
import EducationModalComponent from '../modal/education/EducationModalComponent';
// react lazy load image
import { LazyLoadImage } from 'react-lazy-load-image-component';
// types
import { SchoolData } from '../../types/type';
// util
import { gridStyles } from './util';

export default function EduGrid() {
    // global variable
    const {
        schoolData
    } = useContext(MapperContext);

    // modal hook
    const [opened, { open, close }] = useDisclosure(false);
    // selected school
    const [selectedSchool, setSelectedSchool] = useState<SchoolData | null>(null);

    // open modal with set selected school
    const openModal = (school: SchoolData) => {
        setSelectedSchool(school);
        open();
    };

    return (
        <div className={gridStyles.gridMainDivStyle}>
            {/* school grid */}
            <div className={gridStyles.gridDivThreeColStyle}>
                {schoolData.map((school: SchoolData, i: number) => (
                    <div key={i} onClick={() => openModal(school)} className={gridStyles.gridLazyLoadImageDivStyle}>
                        <LazyLoadImage
                            className={gridStyles.gridLazyLoadImageStyle}
                            src={school.Logo.URL}
                            alt={school.SchoolName}
                        />
                    </div>
                ))}
            </div>
            {/* modal components */}
            {
                localStorage.getItem(colorTheme.theme) === colorTheme.light ?
                    <Modal opened={opened} onClose={close} size="lg" centered>
                        {selectedSchool && (
                            <EducationModalComponent
                                docID={selectedSchool.id}
                                schoolName={selectedSchool.SchoolName}
                                type={selectedSchool.Type}
                                title={selectedSchool.Title}
                                gpa={selectedSchool.GPA}
                                startDate={selectedSchool.StartDate}
                                endDate={selectedSchool.EndDate}
                                present={selectedSchool.Present}
                                logo={selectedSchool.Logo.URL}
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
                        {selectedSchool && (
                            <EducationModalComponent
                                docID={selectedSchool.id}
                                schoolName={selectedSchool.SchoolName}
                                type={selectedSchool.Type}
                                title={selectedSchool.Title}
                                gpa={selectedSchool.GPA}
                                startDate={selectedSchool.StartDate}
                                endDate={selectedSchool.EndDate}
                                present={selectedSchool.Present}
                                logo={selectedSchool.Logo.URL}
                            />
                        )}
                    </Modal>
            }
        </div>
    );
}
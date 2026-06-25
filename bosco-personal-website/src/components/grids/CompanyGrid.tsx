// others
import { useState, useContext } from 'react';
import { useDisclosure } from '@mantine/hooks';
// global variable
import { MapperContext } from '../../globalVariable/MapperContextProvider';
import { colorTheme } from '../../globalVariable/GlobalVariable';
// mantine components
import { Modal } from '@mantine/core';
// page components
import CompanyModalComponent from '../modal/company/CompanyModalComponent';
// react lazy load image
import { LazyLoadImage } from 'react-lazy-load-image-component';
// types
import { CompanyData } from '../../types/type';
// util
import { gridStyles } from './util';

export default function CompanyGrid() {
    // global variable
    const {
        companyData
    } = useContext(MapperContext);

    // modal hook
    const [opened, { open, close }] = useDisclosure(false);
    // selected company
    const [selectedCompany, setSelectedCompany] = useState<CompanyData | null>(null);

    // open modal with set selected company
    const openModal = (company: CompanyData) => {
        setSelectedCompany(company);
        open();
    };

    return (
        <div className={gridStyles.gridMainDivStyle}>
            {/* company grids */}
            <div className={gridStyles.gridDivThreeColStyle}>
                {companyData.map((company: any, i: any) => (
                    <div key={i} onClick={() => openModal(company)} className={gridStyles.gridLazyLoadImageDivStyle}>
                        <LazyLoadImage
                            className={gridStyles.gridLazyLoadImageStyle}
                            src={company.Logo.URL}
                            alt={company.CompanyName}
                        />
                    </div>
                ))}
            </div>
            {/* modal components */}
            {
                localStorage.getItem(colorTheme.theme) === colorTheme.light ?
                    <Modal opened={opened} onClose={close} size="lg" centered>
                        {selectedCompany && (
                            <CompanyModalComponent
                                docID={selectedCompany.id}
                                companyName={selectedCompany.CompanyName}
                                team={selectedCompany.Team}
                                position={selectedCompany.Position}
                                jobDuties={selectedCompany.JobDuties}
                                projects={selectedCompany.Projects}
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
                                companyName={selectedCompany.CompanyName}
                                team={selectedCompany.Team}
                                position={selectedCompany.Position}
                                jobDuties={selectedCompany.JobDuties}
                                projects={selectedCompany.Projects}
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
// others
import { useState, createContext, useEffect } from "react";
// data
import companyJSON from '../data/companyData.json';
import schoolJSON from '../data/schoolData.json';
import projectJSON from '../data/projectData.json';
import SkillJSON from '../data/skillData.json';
// types
import { CompanyData, ProjectData, SchoolData, SkillData } from "../types/type";

// variable interface
interface MapperContextType {
    companyData: CompanyData[];
    schoolData: SchoolData[];
    projectData: ProjectData[];
    skillData: SkillData[];
}

// create context
export const MapperContext = createContext<MapperContextType>({
    companyData: [],
    schoolData: [],
    projectData: [],
    skillData: [],
});

export default function MapperContextProvider(props: any) {
    // company data
    const [companyData, setCompanyData] = useState<CompanyData[]>([]);
    // school data
    const [schoolData, setSchoolData] = useState<SchoolData[]>([]);
    // project data
    const [projectData, setProjectData] = useState<ProjectData[]>([]);
    // skill data
    const [skillData, setSkillData] = useState<SkillData[]>([]);

    // get company, school, project, and skill data from JSON
    useEffect(() => {
        // load company data from JSON
        setCompanyData(
            companyJSON
                .map((item: CompanyData) => ({ ...item, id: item.id }))
                .sort((a, b) => String(b.id).localeCompare(String(a.id), undefined, { numeric: true }))
        );
        // load school data from JSON
        setSchoolData(
            schoolJSON
                .map((item: SchoolData) => ({ ...item, id: item.id }))
                .sort((a, b) => String(b.id).localeCompare(String(a.id), undefined, { numeric: true }))
        );
        // load project data from JSON
        setProjectData(
            projectJSON
                .map((item: ProjectData) => ({ ...item, id: item.id }))
                .sort((a, b) => String(b.id).localeCompare(String(a.id), undefined, { numeric: true }))
        );
        // load skill data from JSON
        setSkillData(
            SkillJSON
                .map((item: SkillData) => ({ ...item, id: item.id }))
                .sort((a, b) => String(b.id).localeCompare(String(a.id), undefined, { numeric: true }))
        );
    }, []);

    return (
        // pass the value in provider and return
        <MapperContext.Provider value={{
            companyData,
            schoolData,
            projectData,
            skillData,
        }}>
            {props.children}
        </MapperContext.Provider>
    )
}
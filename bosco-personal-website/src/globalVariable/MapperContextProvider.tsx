// others
import { useState, createContext, useEffect } from "react";
// data
import companyJSON from '../data/companyData.json';
import schoolJSON from '../data/schoolData.json';
import projectJSON from '../data/projectData.json';
import SkillJSON from '../data/skillData.json';
import { LanguageType, TranslationKey, languageSetting, translations } from "./Translation";
// types
import { CompanyData, ProjectData, SchoolData, SkillData } from "../types/type";

// variable interface
interface MapperContextType {
    companyData: CompanyData[];
    schoolData: SchoolData[];
    projectData: ProjectData[];
    skillData: SkillData[];
    language: LanguageType;
    setLanguage: (language: LanguageType) => void;
    t: (key: TranslationKey) => string;
}

// create context
export const MapperContext = createContext<MapperContextType>({
    companyData: [],
    schoolData: [],
    projectData: [],
    skillData: [],
    language: languageSetting.english,
    setLanguage: () => { },
    t: (key) => translations.en[key],
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
    // language
    const [language, setLanguage] = useState<LanguageType>(languageSetting.english);

    // get company, school, project, and skill data from JSON
    useEffect(() => {
        const storedLanguage = localStorage.getItem(languageSetting.key) as LanguageType | null;

        if (
            storedLanguage === languageSetting.english ||
            storedLanguage === languageSetting.traditionalChinese ||
            storedLanguage === languageSetting.simplifiedChinese
        ) {
            setLanguage(storedLanguage);
        } else {
            const browserLanguage = navigator.language.toLowerCase();

            if (browserLanguage.includes('zh-tw') || browserLanguage.includes('zh-hk') || browserLanguage.includes('hant')) {
                setLanguage(languageSetting.traditionalChinese);
            } else if (browserLanguage.includes('zh')) {
                setLanguage(languageSetting.simplifiedChinese);
            }
        }

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

    useEffect(() => {
        localStorage.setItem(languageSetting.key, language);
    }, [language]);

    const t = (key: TranslationKey) => {
        return translations[language][key];
    };

    return (
        // pass the value in provider and return
        <MapperContext.Provider value={{
            companyData,
            schoolData,
            projectData,
            skillData,
            language,
            setLanguage,
            t,
        }}>
            {props.children}
        </MapperContext.Provider>
    )
}
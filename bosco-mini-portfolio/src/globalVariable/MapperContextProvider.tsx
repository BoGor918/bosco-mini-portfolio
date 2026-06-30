// others
import { useState, createContext, useEffect, type PropsWithChildren } from "react";
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

const sortByDescendingId = <T extends { id: string | number }>(items: T[]) => {
    return [...items].sort((a, b) => String(b.id).localeCompare(String(a.id), undefined, { numeric: true }));
};

const companyDataSource = sortByDescendingId(companyJSON as CompanyData[]);
const schoolDataSource = sortByDescendingId(schoolJSON as SchoolData[]);
const projectDataSource = sortByDescendingId(projectJSON as ProjectData[]);
const skillDataSource = sortByDescendingId(SkillJSON as SkillData[]);

const getInitialLanguage = (): LanguageType => {
    const storedLanguage = localStorage.getItem(languageSetting.key) as LanguageType | null;

    if (
        storedLanguage === languageSetting.english ||
        storedLanguage === languageSetting.traditionalChinese ||
        storedLanguage === languageSetting.simplifiedChinese
    ) {
        return storedLanguage;
    }

    return languageSetting.english;
};

export default function MapperContextProvider({ children }: PropsWithChildren) {
    // language
    const [language, setLanguage] = useState<LanguageType>(getInitialLanguage);

    useEffect(() => {
        localStorage.setItem(languageSetting.key, language);
    }, [language]);

    const t = (key: TranslationKey) => {
        return translations[language][key];
    };

    return (
        // pass the value in provider and return
        <MapperContext.Provider value={{
            companyData: companyDataSource,
            schoolData: schoolDataSource,
            projectData: projectDataSource,
            skillData: skillDataSource,
            language,
            setLanguage,
            t,
        }}>
            {children}
        </MapperContext.Provider>
    )
}
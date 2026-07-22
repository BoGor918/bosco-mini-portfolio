// others
import { useState, createContext, useEffect, type PropsWithChildren } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
// data
import companyJSON from '../data/companyData.json';
import schoolJSON from '../data/schoolData.json';
import projectJSON from '../data/projectData.json';
import { LanguageType, TranslationKey, languageSetting, translations } from "./Translation";
// types
import { CompanyData, ProjectData, SchoolData, SkillData, UserProfile } from "../types/type";
import { auth } from "../firebase";
import { colorTheme } from "./GlobalVariable";
import { fetchUserCollectionData } from "../query/user/UserQuery";
import { fetchSkillCollectionData } from "../query/skill/SkillQuery";
import { fetchCompanyCollectionData } from "../query/company/CompanyQuery";

// variable interface
interface MapperContextType {
    companyData: CompanyData[];
    schoolData: SchoolData[];
    projectData: ProjectData[];
    skillData: SkillData[];
    user: User | null;
    userData: UserProfile[];
    theme: string;
    setTheme: (theme: string) => void;
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
    user: null,
    userData: [],
    theme: colorTheme.light,
    setTheme: () => { },
    language: languageSetting.english,
    setLanguage: () => { },
    t: (key) => translations.en[key],
});

const sortByDescendingId = <T extends { id: string | number }>(items: T[]) => {
    return [...items].sort((a, b) => String(b.id).localeCompare(String(a.id), undefined, { numeric: true }));
};

const schoolDataSource = sortByDescendingId(schoolJSON as SchoolData[]);
const projectDataSource = sortByDescendingId(projectJSON as ProjectData[]);

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

const getInitialTheme = (): string => {
    const storedTheme = localStorage.getItem(colorTheme.theme);
    const prefersDarkMode = window.matchMedia(`(prefers-color-scheme: ${colorTheme.dark})`).matches;

    if (storedTheme === colorTheme.dark || storedTheme === colorTheme.light) {
        return storedTheme;
    }

    return prefersDarkMode ? colorTheme.dark : colorTheme.light;
};

export default function MapperContextProvider({ children }: PropsWithChildren) {
    // language
    const [language, setLanguage] = useState<LanguageType>(getInitialLanguage);
    // user
    const [user, setUser] = useState<User | null>(null);
    // theme
    const [theme, setTheme] = useState(getInitialTheme);
    // data
    const [userData, setUserData] = useState<UserProfile[]>([]);
    const [companyData, setCompanyData] = useState<CompanyData[]>([]);
    const [skillData, setSkillData] = useState<SkillData[]>([]);

    // listen for authentication state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    // fetch user data and subscribe skill data when user state changes
    useEffect(() => {
        let isActive = true;

        const loadUsers = async () => {
            const users = await fetchUserCollectionData<UserProfile>('Users', (userDocument) => userDocument.data() as UserProfile);

            if (!isActive) {
                return;
            }

            setUserData(users);
        };

        loadUsers();

        const loadSkills = fetchSkillCollectionData(
            (skills) => setSkillData(skills),
            () => setSkillData([]),
        );

        const loadCompanies = fetchCompanyCollectionData(
            (company) => setCompanyData(company),
            () => setCompanyData([]),
        );

        return () => {
            isActive = false;
            loadSkills(); // This will unsubscribe from the skill snapshot
            loadCompanies(); // This will unsubscribe from the company snapshot
        };
    }, [user]);

    // set language
    useEffect(() => {
        localStorage.setItem(languageSetting.key, language);
    }, [language]);

    // set theme and background color
    useEffect(() => {
        if (theme === colorTheme.dark) {
            document.documentElement.classList.add(colorTheme.dark);
            document.body.style.backgroundColor = `#0B1A33`;
            document.querySelector(`meta[name="theme-color"]`)?.setAttribute(`content`, `#0B1A33`);
        } else {
            document.documentElement.classList.remove(colorTheme.dark);
            document.body.style.backgroundColor = `#FFFFFF`;
            document.querySelector(`meta[name="theme-color"]`)?.setAttribute(`content`, `#FFFFFF`);
        }

        localStorage.setItem(colorTheme.theme, theme);
    }, [theme]);

    const t = (key: TranslationKey) => {
        return translations[language][key];
    };

    return (
        // pass the value in provider and return
        <MapperContext.Provider value={{
            companyData,
            schoolData: schoolDataSource,
            projectData: projectDataSource,
            skillData,
            user,
            userData,
            theme,
            setTheme,
            language,
            setLanguage,
            t,
        }}>
            {children}
        </MapperContext.Provider>
    )
}
// others
import { useState, createContext, useEffect, type PropsWithChildren } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
// data
import { LanguageType, TranslationKey, languageSetting, translations } from "./Translation";
// types
import { CompanyData, ProjectData, SchoolData, SkillData, UserProfile } from "../types/type";
// firebase
import { auth } from "../firebase";
// global variable
import { colorTheme } from "./GlobalVariable";
// query
import { fetchUserCollectionData } from "../query/UserQuery";
import { fetchSkillCollectionData } from "../query/SkillQuery";
import { fetchCompanyCollectionData } from "../query/CompanyQuery";
import { fetchSchoolCollectionData } from "../query/SchoolQuery";
import { fetchProjectCollectionData } from "../query/ProjectQuery";

// variable interface
interface MapperContextType {
    companyData: CompanyData[];
    schoolData: SchoolData[];
    projectData: ProjectData[];
    skillData: SkillData[];
    authLoading: boolean;
    companyLoading: boolean;
    schoolLoading: boolean;
    projectLoading: boolean;
    skillLoading: boolean;
    user: User | null;
    userData: UserProfile[];
    loginUser: UserProfile | null;
    theme: string;
    setTheme: (theme: string) => void;
    language: LanguageType;
    setLanguage: (language: LanguageType) => void;
    t: (key: TranslationKey) => string;
    setLoginUser: (user: UserProfile | null) => void;
}

// create context
export const MapperContext = createContext<MapperContextType>({
    companyData: [],
    schoolData: [],
    projectData: [],
    skillData: [],
    authLoading: true,
    companyLoading: true,
    schoolLoading: true,
    projectLoading: true,
    skillLoading: true,
    user: null,
    userData: [],
    theme: colorTheme.light,
    setTheme: () => { },
    language: languageSetting.english,
    setLanguage: () => { },
    t: (key) => translations.en[key],
    loginUser: null,
    setLoginUser: () => { },
});

// initial language and theme functions
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

// initial theme function
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
    const [loginUser, setLoginUser] = useState<UserProfile | null>(null);
    const [authLoading, setAuthLoading] = useState(true);
    // theme
    const [theme, setTheme] = useState(getInitialTheme);
    // data
    const [userData, setUserData] = useState<UserProfile[]>([]);
    const [companyData, setCompanyData] = useState<CompanyData[]>([]);
    const [schoolData, setSchoolData] = useState<SchoolData[]>([]);
    const [projectData, setProjectData] = useState<ProjectData[]>([]);
    const [skillData, setSkillData] = useState<SkillData[]>([]);
    const [companyLoading, setCompanyLoading] = useState(true);
    const [schoolLoading, setSchoolLoading] = useState(true);
    const [projectLoading, setProjectLoading] = useState(true);
    const [skillLoading, setSkillLoading] = useState(true);

    // listen for authentication state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            // set login user
            if (currentUser) {
                const loadLoginUser = async () => {
                    const users = await fetchUserCollectionData<UserProfile>('Users', (userDocument) => userDocument.data() as UserProfile);
                    const foundUser = users.find((user) => user.UID === currentUser.uid) || null;
                    setLoginUser(foundUser);
                };
                loadLoginUser();
            }
            setAuthLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // fetch user data and subscribe skill data when user state changes
    useEffect(() => {
        let isActive = true;

        setCompanyLoading(true);
        setSchoolLoading(true);
        setProjectLoading(true);
        setSkillLoading(true);

        const loadUsers = async () => {
            const users = await fetchUserCollectionData<UserProfile>('Users', (userDocument) => userDocument.data() as UserProfile);

            if (!isActive) {
                return;
            }

            setUserData(users);
        };

        loadUsers();

        const loadCompanies = fetchCompanyCollectionData(
            (company) => {
                setCompanyData(company);
                setCompanyLoading(false);
            },
            () => {
                setCompanyData([]);
                setCompanyLoading(false);
            },
        );
        const loadSchools = fetchSchoolCollectionData(
            (schools) => {
                setSchoolData(schools);
                setSchoolLoading(false);
            },
            () => {
                setSchoolData([]);
                setSchoolLoading(false);
            },
        );
        const loadProjects = fetchProjectCollectionData(
            (projects) => {
                setProjectData(projects);
                setProjectLoading(false);
            },
            () => {
                setProjectData([]);
                setProjectLoading(false);
            },
        );
        const loadSkills = fetchSkillCollectionData(
            (skills) => {
                setSkillData(skills);
                setSkillLoading(false);
            },
            () => {
                setSkillData([]);
                setSkillLoading(false);
            },
        );

        // this will unsubscribe from the skill snapshot
        return () => {
            isActive = false;
            loadSkills();
            loadCompanies();
            loadSchools();
            loadProjects();
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

    // translation function
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
            authLoading,
            companyLoading,
            schoolLoading,
            projectLoading,
            skillLoading,
            user,
            userData,
            loginUser,
            setLoginUser,
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
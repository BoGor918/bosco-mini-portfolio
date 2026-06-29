export type CompanyData = {
    SkillSets: string[],
    EndDate: null | {
        seconds: number,
        nanoseconds: number
    },
    CreateDate: {
        seconds: number,
        nanoseconds: number
    },
    StartDate: {
        seconds: number,
        nanoseconds: number
    },
    Present: boolean,
    Logo: {
        URL: string,
        FileName: string
    },
    id: number,
    en: {
        CompanyName: string,
        Team: string,
        Position: string,
        Projects: string,
        JobDuties: string,
    },
    zh: {
        CompanyName: string,
        Team: string,
        Position: string,
        Projects: string,
        JobDuties: string,
    },
    cn: {
        CompanyName: string,
        Team: string,
        Position: string,
        Projects: string,
        JobDuties: string,
    }
}


export type SchoolData = {
    Logo: {
        URL: string,
        FileName: string
    },
    EndDate: {
        seconds: number,
        nanoseconds: number
    },
    StartDate: {
        seconds: number,
        nanoseconds: number
    },
    Present: boolean,
    GPA: number,
    CreateDate: {
        seconds: number,
        nanoseconds: number
    },
    id: number,
    en: {
        SchoolName: string,
        Type: string,
        Title: string,
    },
    zh: {
        SchoolName: string,
        Type: string,
        Title: string,
    },
    cn: {
        SchoolName: string,
        Type: string,
        Title: string,
    }
}

export type ProjectData = {
    Link: string[],
    CreateDate: {
        seconds: number,
        nanoseconds: number
    },
    ProjectName: string,
    Logo: string,
    TechStack: string[],
    id: number,
    en: {
        Description: string
    },
    zh: {
        Description: string
    },
    cn: {
        Description: string
    }
}

export type SkillData = {
    Logo: string,
    CreateDate: {
        seconds: number,
        nanoseconds: number
    },
    SkillName: string,
    id: number
}
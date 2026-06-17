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
    Position: string,
    Present: boolean,
    JobDuties: string,
    Logo: {
        URL: string,
        FileName: string
    },
    Projects: string,
    Team: string,
    CompanyName: string,
    id: number
}

export type SchoolData = {
    Logo: {
        URL: string,
        FileName: string
    },
    Type: string,
    EndDate: {
        seconds: number,
        nanoseconds: number
    },
    SchoolName: string,
    Title: string,
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
    id: number
}

export type ProjectData = {
    Link: string[],
    CreateDate: {
        seconds: number,
        nanoseconds: number
    },
    ProjectName: string,
    Logo: string,
    Description: string,
    TechStack: string[],
    id: number
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
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
    Logo: string,
    id: string,
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
    Logo: string
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
    id: string,
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
    id: string,
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
    id: string | number
}

export type UserProfile = {
    Email?: string,
    Username?: string,
    UID?: string,
    IsAdmin?: boolean,
}

export type NotificationType = 'success' | 'error'
import {
    collection,
    doc,
    onSnapshot,
    orderBy,
    query,
    setDoc,
} from 'firebase/firestore';
import { firestore } from '../../firebase';
import { CompanyData } from '../../types/type';

export const fetchCompanyCollectionData = (
    onData: (companies: CompanyData[]) => void,
    onError?: () => void,
) => {
    const companyQuery = query(collection(firestore, 'Company'), orderBy('CreateDate', 'desc'));

    return onSnapshot(
        companyQuery,
        (companySnapshot) => {
            if (companySnapshot.empty) {
                onData([]);
                return;
            }

            const companies = companySnapshot.docs.map((companyDocument) => ({
                ...(companyDocument.data() as Omit<CompanyData, 'id'>),
                id: companyDocument.id,
            }));

            onData(companies);
        },
        () => {
            onError?.();
        },
    );
};

export const saveCompanyDocument = async (
    id: string,
    payload: {
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
        },
        Logo: string | null;
        Present: boolean,
        SkillSets: string[],
        StartDate: Date,
        EndDate: Date | null,
        CreateDate: Date,
    },
) => {
    await setDoc(doc(firestore, 'Company', id), payload);
};
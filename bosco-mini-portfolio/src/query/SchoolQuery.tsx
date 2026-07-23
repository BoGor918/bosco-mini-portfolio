import {
    collection,
    doc,
    onSnapshot,
    orderBy,
    query,
    setDoc,
} from 'firebase/firestore';
import { firestore } from '../firebase';
import { SchoolData } from '../types/type';

export const fetchSchoolCollectionData = (
    onData: (companies: SchoolData[]) => void,
    onError?: () => void,
) => {
    const schoolQuery = query(collection(firestore, 'School'), orderBy('CreateDate', 'desc'));

    return onSnapshot(
        schoolQuery,
        (schoolSnapshot) => {
            if (schoolSnapshot.empty) {
                onData([]);
                return;
            }

            const schools = schoolSnapshot.docs.map((schoolDocument) => ({
                ...(schoolDocument.data() as Omit<SchoolData, 'id'>),
                id: schoolDocument.id,
            }));

            onData(schools);
        },
        () => {
            onError?.();
        },
    );
};

export const saveSchoolDocument = async (
    id: string,
    payload: {
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
        },
        Logo: string | null,
        GPA: number | null,
        Present: boolean,
        StartDate: Date,
        EndDate: Date | null,
        CreateDate: Date,
    },
) => {
    await setDoc(doc(firestore, 'School', id), payload);
};
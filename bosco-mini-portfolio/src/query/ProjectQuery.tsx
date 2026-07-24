import {
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    orderBy,
    query,
    setDoc,
} from 'firebase/firestore';
import { firestore } from '../firebase';
import { ProjectData } from '../types/type';

export const fetchProjectCollectionData = (
    onData: (companies: ProjectData[]) => void,
    onError?: () => void,
) => {
    const projectQuery = query(collection(firestore, 'Project'), orderBy('CreateDate', 'desc'));

    return onSnapshot(
        projectQuery,
        (projectSnapshot) => {
            if (projectSnapshot.empty) {
                onData([]);
                return;
            }

            const companies = projectSnapshot.docs.map((projectDocument) => ({
                ...(projectDocument.data() as Omit<ProjectData, 'id'>),
                id: projectDocument.id,
            }));

            onData(companies);
        },
        () => {
            onError?.();
        },
    );
};

export const saveProjectDocument = async (
    id: string,
    payload: {
        en: {
            Description: string
        },
        zh: {
            Description: string
        },
        cn: {
            Description: string
        }
        Logo: string | null,
        ProjectName: string,
        Link: string[],
        TechStack: string[],
        CreateDate: Date,
    },
) => {
    await setDoc(doc(firestore, 'Project', id), payload);
};

export const deleteProjectDocument = async (id: string) => {
    await deleteDoc(doc(firestore, 'Project', id));
};
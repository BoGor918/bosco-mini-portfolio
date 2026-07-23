import {
    collection,
    doc,
    getDocs,
    setDoc,
    type DocumentData,
    type QueryDocumentSnapshot,
} from 'firebase/firestore';
import { firestore } from '../firebase';
import { UserProfile } from '../types/type';


export const fetchUserCollectionData = async <T,>(
    collectionName: string,
    mapper: (document: QueryDocumentSnapshot<DocumentData>) => T
): Promise<T[]> => {
    try {
        const snapshot = await getDocs(collection(firestore, collectionName));

        if (snapshot.empty) {
            return [];
        }

        return snapshot.docs.map(mapper);
    } catch {
        return [];
    }
};

export const saveUserDocument = async (
    userId: string,
    payload: Pick<UserProfile, 'Email' | 'Username' | 'UID'>,
) => {
    await setDoc(doc(firestore, 'Users', userId), payload);
};

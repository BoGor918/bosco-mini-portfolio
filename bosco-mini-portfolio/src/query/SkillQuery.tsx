import {
	collection,
	doc,
	onSnapshot,
	orderBy,
	query,
	setDoc,
} from 'firebase/firestore';
import { firestore } from '../firebase';
import { SkillData } from '../types/type';

export const fetchSkillCollectionData = (
    onData: (skills: SkillData[]) => void,
    onError?: () => void,
) => {
    const skillQuery = query(collection(firestore, 'Skill'), orderBy('CreateDate', 'desc'));

    return onSnapshot(
        skillQuery,
        (skillSnapshot) => {
            if (skillSnapshot.empty) {
                onData([]);
                return;
            }

            const skills = skillSnapshot.docs.map((skillDocument) => ({
                ...(skillDocument.data() as Omit<SkillData, 'id'>),
                id: skillDocument.id,
            }));

            onData(skills);
        },
        () => {
            onError?.();
        },
    );
};

export const saveSkillDocument = async (
    id: string,
    payload: {
        SkillName: string;
        Logo: string | null;
        CreateDate: Date;
    },
) => {
    await setDoc(doc(firestore, 'Skill', id), payload);
};
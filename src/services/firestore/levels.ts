import { doc, getDoc } from "firebase/firestore";
import { db } from "../../api/firebase";
import { LevelInfo } from "../../types/level";


export const getLocalLevels = async(): Promise<LevelInfo[] | null> => {
    const localLevels = localStorage.getItem('game:levels');
    if (localLevels && validateTTL()) {
        console.log('localLevels', 'from local storage');
        try {
            return Promise.resolve(JSON.parse(localLevels) as LevelInfo[]);
        } catch (error) {
            console.error('Error parsing local levels:', error);
            return null;
        }
    }

    console.log('localLevels', 'from firestore');
    return await getLevels();
}


export const getLevels = async () : Promise<LevelInfo[] | null> => {
    const docRef = doc(db, "settings", "levels");
    const docSnap = await getDoc(docRef);
    setLocalLevelsTTL(new Date().getTime() + 24 * 60 * 60 * 1000); // Set TTL to 1 day from now
    return docSnap.data()?.levels as LevelInfo[] | null;
};



const validateTTL = (): boolean => {
    const ttl = getLocalLevelsTTL();
    if (ttl < new Date().getTime()) {
        return false;
    }
    return true;
}
const getLocalLevelsTTL = () => {
    const ttl = localStorage.getItem('game:levelsttl');
    if (ttl) {
        return parseInt(ttl);
    }
    return 0;
}

const setLocalLevelsTTL = (ttl: number) => {
    localStorage.setItem('game:levelsttl', ttl.toString());
}
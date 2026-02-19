import { doc, getDoc } from "firebase/firestore";
import { db } from "../../api/firebase";
import { LevelInfo } from "../../types/level";
import CircularJSON from 'circular-json';


export const getLocalLevels = async(): Promise<LevelInfo[] | null> => {
    const localLevels = localStorage.getItem('game:levels');
    if (localLevels && validateTTL()) {
        try {
            // Parse with CircularJSON since localStorage uses CircularJSON
            const levels = CircularJSON.parse(localLevels) as LevelInfo[];
            // Set default time limit of 300 seconds for all levels that don't have one
            // Preserve solution format
            return levels.map(level => {
                let solution = level.solution;
                if (solution && Array.isArray(solution)) {
                    try {
                        const str = CircularJSON.stringify(solution);
                        if (str.includes('~') || str.includes('~0')) {
                            solution = str;
                        }
                    } catch {
                        // CircularJSON stringify can fail; keep as array
                    }
                }
                
                return {
                    ...level,
                    timeLimitInSeconds: level.timeLimitInSeconds ?? 300,
                    solution
                };
            });
        } catch (error) {
            console.error('Error parsing local levels:', error);
            return null;
        }
    }

    return await getLevels();
}


export const getLevels = async () : Promise<LevelInfo[] | null> => {
    const docRef = doc(db, "settings", "levels");
    const docSnap = await getDoc(docRef);
    setLocalLevelsTTL(new Date().getTime() + 24 * 60 * 60 * 1000); // Set TTL to 1 day from now
    const levels = docSnap.data()?.levels as LevelInfo[] | null;
    
    // Set default time limit of 300 seconds for all levels that don't have one
    // Preserve solution format (CircularJSON string or array)
    if (levels) {
        return levels.map(level => {
            // If solution is an array, convert to CircularJSON string to preserve circular refs
            let solution = level.solution;
            if (solution && Array.isArray(solution)) {
                // Check if array contains circular references by stringifying
                try {
                    const str = CircularJSON.stringify(solution);
                    // If it contains CircularJSON markers, store as string
                    if (str.includes('~') || str.includes('~0')) {
                        solution = str;
                    }
                } catch {
                    // If CircularJSON fails, keep as array
                }
            }
            
            return {
                ...level,
                timeLimitInSeconds: level.timeLimitInSeconds ?? 300,
                solution
            };
        });
    }
    
    return levels;
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
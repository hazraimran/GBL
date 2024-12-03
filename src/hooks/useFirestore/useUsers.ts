// hooks/useFirestore/useUsers.ts
import { useState, useEffect } from 'react';
import { User } from '../../services/firestore/types';
import { userService } from '../../services/firestore/users';

export const useUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const fetchedUsers = await userService.getAllUsers();
                setUsers(fetchedUsers);
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return { users, loading, error };
};
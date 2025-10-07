/* eslint-disable react-refresh/only-export-components */
import type { Patient } from '@/interfaces';
import { createContext, useState, type ReactNode } from 'react';

interface AuthContextType {
    user: Patient | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    register: (userData: Partial<Patient>) => Promise<boolean>;
    logout: () => void;
    updateProfile: (userData: Partial<Patient>) => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<Patient | null>(null);

    const login = async (email: string, password: string): Promise<boolean> => {
        // Mock login - in real app, this would call an API
        if (email === 'john.smith@email.com' && password === 'password') {
            const mockUser: Patient = {
                id: '1',
                full_name: 'John Smith',
                personal_id: 'ID123456789',
                birth_date: '1985-06-15',
                gender: 'Male',
                phone: '+1 (555) 123-4567',
                address: '123 Main Street, Springfield, IL 62701',
                email: 'john.smith@email.com',
                insurance_provider: 'Blue Cross Blue Shield',
                policy_number: 'BC12345678',
                insurance_validity: '2025-12-31'
            };
            setUser(mockUser);
            return true;
        }
        return false;
    };

    const register = async (userData: Partial<Patient>): Promise<boolean> => {
        // Mock registration - in real app, this would call an API
        const newUser: Patient = {
            id: Date.now().toString(),
            full_name: userData.full_name || '',
            personal_id: userData.personal_id || '',
            birth_date: userData.birth_date || '',
            gender: userData.gender || 'Male',
            phone: userData.phone || '',
            address: userData.address || '',
            email: userData.email || '',
            insurance_provider: userData.insurance_provider,
            policy_number: userData.policy_number,
            insurance_validity: userData.insurance_validity
        };
        setUser(newUser);
        return true;
    };

    const logout = () => {
        setUser(null);
    };

    const updateProfile = async (userData: Partial<Patient>): Promise<boolean> => {
        if (user) {
            setUser({ ...user, ...userData });
            return true;
        }
        return false;
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            login,
            register,
            logout,
            updateProfile
        }}>
            {children}
        </AuthContext.Provider>
    );
}


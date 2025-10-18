/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import type { Patient } from '@/interfaces';
import { supabase } from '@/utils/backend/client';
import { createContext, useState, useEffect, type ReactNode } from 'react';

interface AuthContextType {
    user: Patient | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    register: (userData: RegisterData) => Promise<boolean>;
    logout: () => void;
    updateProfile: (userData: Partial<Omit<Patient, 'id' | 'email'>>) => Promise<boolean>;
}

// Kiểu dữ liệu cho đăng ký (bao gồm password)
interface RegisterData extends Omit<Patient, 'id'> {
    password: string; // Cần thiết cho đăng ký
}

// Khởi tạo Context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);


// Key dùng để lưu ID người dùng vào localStorage
const USER_STORAGE_KEY = 'patient_user_id';

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<Patient | null>(null);
    const [loading, setLoading] = useState(true);

    // --- Khởi tạo: Tải người dùng từ Local Storage ---
    useEffect(() => {
        const loadUser = async () => {
            const userId = localStorage.getItem(USER_STORAGE_KEY);
            if (userId) {
                // Truy vấn bảng patients bằng ID đã lưu
                const { data, error } = await supabase
                    .from('patient')
                    .select('*')
                    .eq('id', userId)
                    .limit(1)
                    .single();

                if (data && !error) {
                    // Loại bỏ trường password trước khi lưu vào state
                    const { password, ...patientData } = data;
                    setUser(patientData as Patient);
                } else {
                    console.error('Error loading stored user:', error);
                    localStorage.removeItem(USER_STORAGE_KEY); // Xóa ID lỗi
                }
            }
            setLoading(false);
        };

        loadUser();
    }, []);

    // --- Hàm Đăng nhập ---
    const login = async (email: string, password: string): Promise<boolean> => {
        const { data, error } = await supabase
            .from('patient')
            .select('*')
            .eq('email', email)
            .eq('password', password)
            .limit(1)
            .single();

        if (error) {
            console.error('Login failed or user not found:', error);
            return false;
        }

        if (data) {
            const patientData = data as Patient;

            localStorage.setItem(USER_STORAGE_KEY, patientData.id);
            setUser(patientData);
            return true;
        }

        return false; // Không khớp email/password
    };

    // --- Hàm Đăng ký ---
    const register = async (userData: RegisterData): Promise<boolean> => {
        const { password, ...patientData } = userData;

        // 1. Kiểm tra email đã tồn tại chưa
        const { data: existingUser, error: checkError } = await supabase
            .from('patient')
            .select('id')
            .eq('email', patientData.email)
            .limit(1);

        if (checkError) {
            console.error('Error checking existing email:', checkError.message);
            return false;
        }

        if (existingUser && existingUser.length > 0) {
            console.error('Registration error: Email already exists.');
            return false;
        }

        // 2. Chèn người dùng mới vào bảng 'patient' (không cần truyền ID, database sẽ tự tạo)
        const newUser: Omit<Patient, 'id'> & { password: string } = {
            ...patientData,
            password: password, // LƯU Ý BẢO MẬT: Mật khẩu chưa được băm!
        };

        const { data: insertedUser, error: insertError } = await supabase
            .from('patient')
            .insert(newUser)
            .select()
            .single();

        if (insertError || !insertedUser) {
            console.error('Error registering patient:', insertError?.message);
            return false;
        }

        // 3. Đăng nhập người dùng sau khi đăng ký thành công
        localStorage.setItem(USER_STORAGE_KEY, insertedUser.id);

        // Loại bỏ password trước khi lưu vào state
        const { password: _, ...userWithoutPassword } = insertedUser;
        setUser(userWithoutPassword as Patient);
        return true;
    };

    // --- Hàm Đăng xuất --
    const logout = () => {
        localStorage.removeItem(USER_STORAGE_KEY);
        setUser(null);
    };

    // --- Hàm Cập nhật Hồ sơ ---
    const updateProfile = async (userData: Partial<Omit<Patient, 'id' | 'email'>>): Promise<boolean> => {
        if (!user) return false;

        const { error: updateError } = await supabase
            .from('patient')
            .update(userData)
            .eq('id', user.id); // Cập nhật dựa trên ID người dùng hiện tại

        if (updateError) {
            console.error('Profile update error:', updateError.message);
            return false;
        }

        // Cập nhật trạng thái người dùng trong ứng dụng
        setUser({ ...user, ...userData });
        return true;
    };


    if (loading) {
        // Hiển thị màn hình tải trong khi kiểm tra Local Storage
        return <div>Loading authentication...</div>;
    }

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
import { createContext, useContext, useEffect, useState } from 'react';
import StorageService from '../services/StorageService';

// 创建认证上下文
const AuthContext = createContext();

// 认证提供者组件
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // 检查是否有已登录的用户
    useEffect(() => {
        checkCurrentUser();
    }, []);

    const checkCurrentUser = async () => {
        try {
            const currentUser = await StorageService.getCurrentUser();
            if (currentUser) {
                setUser(currentUser);
            }
        } catch (error) {
            console.log('检查当前用户失败:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // 登录函数
    const login = async (username, password) => {
        try {
            const validUser = await StorageService.validateLogin(username, password);
            if (validUser) {
                // 更新最后登录时间
                const updatedUser = {
                    ...validUser,
                    lastLoginAt: new Date().toISOString()
                };
                await StorageService.saveUser(updatedUser);
                setUser(updatedUser);
                return { success: true };
            } else {
                return { success: false, error: '用户名或密码错误' };
            }
        } catch (error) {
            console.log('登录失败:', error);
            return { success: false, error: '登录失败，请重试' };
        }
    };

    // 注册函数
    const register = async (username, password) => {
        try {
            // 检查用户名是否已存在
            const exists = await StorageService.isUsernameExists(username);
            if (exists) {
                return { success: false, error: '用户名已存在' };
            }

            // 创建新用户
            const newUser = {
                username,
                password, // 实际项目中应该加密
                registeredAt: new Date().toISOString(),
                lastLoginAt: new Date().toISOString()
            };

            // 保存用户
            const saved = await StorageService.addUser(newUser);
            if (saved) {
                return { success: true };
            } else {
                return { success: false, error: '注册失败，请重试' };
            }
        } catch (error) {
            console.log('注册失败:', error);
            return { success: false, error: '注册失败，请重试' };
        }
    };

    // 登出函数
    const logout = async () => {
        try {
            await StorageService.clearCurrentUser();
            setUser(null);
            return { success: true };
        } catch (error) {
            console.log('登出失败:', error);
            return { success: false, error: '登出失败' };
        }
    };

    const value = {
        user,
        isLoading,
        login,
        register,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// 使用认证上下文的Hook
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

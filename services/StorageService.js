import AsyncStorage from '@react-native-async-storage/async-storage';

// 简单的存储服务
class StorageService {
    // 保存用户数据
    static async saveUser(userData) {
        try {
            const jsonValue = JSON.stringify(userData);
            await AsyncStorage.setItem('currentUser', jsonValue);
            return true;
        } catch (error) {
            console.log('保存用户数据失败:', error);
            return false;
        }
    }

    // 获取当前用户
    static async getCurrentUser() {
        try {
            const jsonValue = await AsyncStorage.getItem('currentUser');
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (error) {
            console.log('获取用户数据失败:', error);
            return null;
        }
    }

    // 获取所有用户（用于注册时检查重复）
    static async getAllUsers() {
        try {
            const jsonValue = await AsyncStorage.getItem('allUsers');
            return jsonValue != null ? JSON.parse(jsonValue) : [];
        } catch (error) {
            console.log('获取所有用户失败:', error);
            return [];
        }
    }

    // 保存新用户到用户列表
    static async addUser(userData) {
        try {
            const allUsers = await this.getAllUsers();
            allUsers.push(userData);
            const jsonValue = JSON.stringify(allUsers);
            await AsyncStorage.setItem('allUsers', jsonValue);
            return true;
        } catch (error) {
            console.log('添加用户失败:', error);
            return false;
        }
    }

    // 检查用户名是否已存在
    static async isUsernameExists(username) {
        try {
            const allUsers = await this.getAllUsers();
            return allUsers.some(user => user.username === username);
        } catch (error) {
            console.log('检查用户名失败:', error);
            return false;
        }
    }

    // 验证登录
    static async validateLogin(username, password) {
        try {
            const allUsers = await this.getAllUsers();
            const user = allUsers.find(user =>
                user.username === username && user.password === password
            );
            return user || null;
        } catch (error) {
            console.log('验证登录失败:', error);
            return null;
        }
    }

    // 清除当前用户（登出）
    static async clearCurrentUser() {
        try {
            await AsyncStorage.removeItem('currentUser');
            return true;
        } catch (error) {
            console.log('清除用户数据失败:', error);
            return false;
        }
    }
}

export default StorageService;

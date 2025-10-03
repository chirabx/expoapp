import { Ionicons } from '@expo/vector-icons';
import {
    Dimensions,
    Platform,
    StatusBar,
    StyleSheet,
    TouchableOpacity
} from 'react-native';

const { width } = Dimensions.get('window');
const isAndroid = Platform.OS === 'android';
const statusBarHeight = StatusBar.currentHeight || 0;
const IS_TABLET = width > 768;

export default function MenuButton({ onPress, isExpanded }) {
    // 在平板上，如果侧边栏已展开就不显示按钮
    if (IS_TABLET && isExpanded) {
        return null;
    }

    return (
        <TouchableOpacity
            style={styles.menuButton}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Ionicons
                name="menu"
                size={24}
                color="#fff"
            />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    menuButton: {
        position: 'absolute',
        top: isAndroid ? statusBarHeight + 15 : 50,
        left: 20,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(102, 126, 234, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        elevation: isAndroid ? 15 : 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
});

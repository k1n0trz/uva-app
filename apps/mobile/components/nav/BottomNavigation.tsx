import { Image, ImageSourcePropType, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../constants/theme';

const ICON_BY_ROUTE: Record<string, ImageSourcePropType> = {
  hoy: require('../../assets/nav/nav-hoy.png'),
  calendario: require('../../assets/nav/nav-calendario.png'),
  vera: require('../../assets/nav/nav-vera.png'),
  rutinas: require('../../assets/nav/nav-rutinas.png'),
  tienda: require('../../assets/nav/nav-tienda.png'),
};

const LABEL_BY_ROUTE: Record<string, string> = {
  hoy: 'Hoy',
  calendario: 'Calendario',
  vera: 'Vera',
  rutinas: 'Rutinas',
  tienda: 'Tienda',
};

/**
 * Minimal shape we need from expo-router/@react-navigation's tabBar render
 * props — kept local (not imported from @react-navigation/bottom-tabs) so this
 * file doesn't depend on that package's resolution path.
 */
type MinimalTabBarProps = {
  state: { index: number; routes: { key: string; name: string }[] };
  navigation: { navigate: (name: string) => void };
};

/** Custom tab bar: 5 tabs, Vera raised and larger — matches the prototype's bottom nav. */
export function BottomNavigation({ state, navigation }: MinimalTabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View
      className="flex-row items-center justify-around border-t-2 border-primary-border bg-primary-xsoft px-2 pt-2"
      style={{ paddingBottom: Math.max(insets.bottom, 10) }}
    >
      {state.routes.map((route) => {
        const isFocused = state.routes[state.index]?.key === route.key;
        const isVera = route.name === 'vera';
        const icon = ICON_BY_ROUTE[route.name];
        const label = LABEL_BY_ROUTE[route.name] ?? route.name;
        if (!icon) return null;

        return (
          <Pressable
            key={route.key}
            onPress={() => navigation.navigate(route.name)}
            accessibilityRole="button"
            accessibilityLabel={label}
            accessibilityState={{ selected: isFocused }}
            className="min-h-[44px] min-w-[44px] items-center justify-center gap-0.5"
            style={isVera ? { marginTop: -14 } : undefined}
          >
            <Image
              source={icon}
              style={{
                width: isVera ? 52 : 34,
                height: isVera ? 52 : 34,
                borderRadius: isVera ? 52 * 0.22 : 34 * 0.3,
                opacity: isFocused || isVera ? 1 : 0.55,
              }}
              resizeMode="cover"
            />
            <Text
              className="font-bold text-[10px]"
              style={{ color: isFocused ? colors.primary : colors.inkSecondary }}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

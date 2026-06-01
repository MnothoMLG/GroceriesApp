import React, { FC, useEffect } from "react";
import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { Text } from "../text";
import { SvgProps } from "react-native-svg";
import { useIsFocused } from "@react-navigation/native";
import { routes } from "@navigation/routes";
import { colors } from "@theme";
import { ShoppingBasket, ShoppingCart } from "lucide-react-native";
import { useSelector } from "react-redux";
import { getCartTotal } from "@store/shop/selectors";
import { useTranslation } from "@hooks";
import { formatPrice } from "@util";

const tabHeight = 94;

export const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  const isFocused = useIsFocused();
  const { t } = useTranslation();
  const cartTotal = useSelector(getCartTotal);
  const cartTotalLabel = formatPrice(cartTotal, t("common.currencySymbol"));

  useEffect(() => {
    if (isFocused) {
      onPress({
        name: state?.routes?.[state?.index]?.name,
        key: state?.routes?.[state?.index]?.key,
        isFocused: false,
        index: state?.index,
        animateOnly: true,
      });
    }
  }, [isFocused]);

  useEffect(() => {}, [state?.routes]);

  const onPress = (args: {
    name: string;
    key: string;
    isFocused: boolean;
    index: number;
    animateOnly?: boolean;
  }) => {
    const event = !args.animateOnly
      ? navigation.emit({
          type: "tabPress",
          target: args.key,
          canPreventDefault: true,
        })
      : {
          defaultPrevented: false,
        };
    if (!args.isFocused && !event.defaultPrevented) {
      // The `merge: true` option makes sure that the params inside the tab screen are preserved
      if (!args.animateOnly) {
        let routeName = args.name;

        navigation.navigate({ name: routeName, merge: true });
      }
    }
  };

  return (
    <View style={styles.container}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];

        const isFocused = state.index === index;

        const Icon = icons[route.name];
        const color = isFocused ? colors.primary : colors.borderGreyDark;
        const isCartRoute = route.name === routes.CART;
        const label =
          route.name === routes.SHOP
            ? t("tabs.shop")
            : route.name === routes.CART
              ? t("tabs.cart")
              : options.title || route.name;

        return (
          <TouchableWithoutFeedback
            key={route.name}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={() =>
              onPress({
                name: route.name,
                key: route.key,
                isFocused,
                index,
              })
            }
          >
            <View style={styles.item}>
              {isCartRoute && cartTotal > 0 ? (
                <View style={styles.totalBadge}>
                  <Text size={10} color={colors.white}>
                    {cartTotalLabel}
                  </Text>
                </View>
              ) : null}
              <Icon width={24} height={24} color={color} />
              <Text
                color={color}
                style={[
                  styles.label,
                  isFocused ? styles.activeLabel : null,
                  { color },
                ]}
              >
                {label}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        );
      })}
    </View>
  );
};

const icons: { [key: string]: FC<SvgProps> } = {
  [routes.SHOP]: ShoppingBasket,
  [routes.CART]: ShoppingCart,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "white",
    alignItems: "flex-start",
    paddingTop: 16,
    height: tabHeight,
    paddingHorizontal: 5,
    borderColor: colors.borderGrey,
    borderTopWidth: 1,
  },
  padding: {
    backgroundColor: "white",
  },
  item: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  totalBadge: {
    minWidth: 58,
    height: 22,
    borderRadius: 11,
    borderColor: colors.white,
    borderWidth: 1,
    backgroundColor: colors.primary,
    position: "absolute",
    top: -7,
    right: 42,
    zIndex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 7,
  },
  label: {
    marginTop: 5,
    fontSize: 12,
    lineHeight: 13,
    fontWeight: "600",
  },
  activeLabel: {
    fontWeight: "800",
  },
  activeItem: {
    justifyContent: "center",
    alignItems: "center",
    bottom: 0,
    position: "absolute",
    left: 0,
    right: 0,
  },
});

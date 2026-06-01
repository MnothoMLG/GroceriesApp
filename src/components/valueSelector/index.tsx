import React, { FC } from "react";
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { Text } from "../text";
import { Minus, Plus } from "lucide-react-native";
import { colors } from "@theme";
import { useTranslation } from "@hooks";

type ValueSelectorVariant = "catalog" | "cart";

interface Props {
  value: number;
  variant?: ValueSelectorVariant;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  onIncrement?: () => void;
  onDecrement?: () => void;
}

export const ValueSelector: FC<Props> = ({
  value,
  variant = "catalog",
  disabled,
  style,
  onIncrement,
  onDecrement,
}) => {
  const { t } = useTranslation();
  const isCatalog = variant === "catalog";
  const iconSize = isCatalog ? 14 : 11;
  const cartIconColor = colors.dark;

  return (
    <View
      style={[
        styles.container,
        isCatalog ? styles.catalogContainer : styles.cartContainer,
        disabled ? styles.disabled : null,
        style,
      ]}
    >
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={t("accessibility.decreaseQuantity")}
        activeOpacity={0.75}
        disabled={disabled || !onDecrement}
        onPress={onDecrement}
        style={[
          styles.button,
          isCatalog ? styles.catalogButtonLight : styles.cartButtonLight,
        ]}
      >
        <Minus
          width={iconSize}
          height={iconSize}
          strokeWidth={3}
          color={isCatalog ? colors.primary : cartIconColor}
        />
      </TouchableOpacity>

      <Text
        size={11}
        style={[styles.value, isCatalog ? styles.catalogValue : null]}
      >
        {value}
      </Text>

      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={t("accessibility.increaseQuantity")}
        activeOpacity={0.75}
        disabled={disabled || !onIncrement}
        onPress={onIncrement}
        style={[
          styles.button,
          isCatalog ? styles.catalogButtonDark : styles.cartButtonDark,
        ]}
      >
        <Plus
          width={iconSize}
          height={iconSize}
          strokeWidth={3}
          color={isCatalog ? colors.white : cartIconColor}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  catalogContainer: {
    width: 88,
    height: 42,
    borderRadius: 16,
    paddingHorizontal: 6,
    backgroundColor: colors.primary10,
  },
  cartContainer: {
    minWidth: 72,
    height: 32,
    flexShrink: 0,
    borderRadius: 26,
    paddingHorizontal: 4,
    backgroundColor: colors.primary10,
    borderColor: colors.borderGrey,
    borderWidth: 1,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
  },
  catalogButtonLight: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.white,
  },
  catalogButtonDark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
  },
  cartButtonLight: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.white,
    borderColor: "#E6ECE8",
    borderWidth: 1,
  },
  cartButtonDark: {
    width: 24,
    height: 30,
    backgroundColor: colors.transparent,
  },
  value: {
    color: colors.primary,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "800",
    minWidth: 22,
    textAlign: "center",
  },
  catalogValue: {
    color: colors.grey100,
    fontSize: 15,
  },
  disabled: {
    opacity: 0.5,
  },
});

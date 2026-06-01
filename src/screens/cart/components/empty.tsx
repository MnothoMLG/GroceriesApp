import React from "react";
import { StyleSheet, View } from "react-native";
import { ShoppingCart } from "lucide-react-native";
import { colors } from "@theme";
import { Text, AppButton } from "@components";
import { useTranslation } from "@hooks";

export const EmptyCart = ({
  navigateToShop,
}: {
  navigateToShop: () => void;
}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <ShoppingCart width={42} height={42} color={colors.primary} />
      </View>
      <Text style={styles.emptyTitle}>{t("cart.emptyTitle")}</Text>
      <Text style={styles.emptyText}>{t("cart.emptyDescription")}</Text>
      <AppButton
        accessibilityRole="button"
        activeOpacity={0.82}
        onPress={navigateToShop}
        label={t("cart.startShopping")}
        style={styles.emptyButton}
        br={25}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  emptyState: {
    flex: 1,
    paddingHorizontal: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyIcon: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: "#F7F4F0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  emptyTitle: {
    color: colors.primary,
    fontSize: 22,
    lineHeight: 30,
    fontWeight: "900",
  },
  emptyText: {
    color: colors.grey,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 22,
  },
  emptyButton: {
    height: 50,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
});

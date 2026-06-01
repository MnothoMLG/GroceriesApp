import React, { FC } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Text } from "@components";
import { colors } from "@theme";
import { useTranslation } from "@hooks";
import { formatPrice } from "@util";

export interface PaymentSummaryProps {
  subtotal: number;
  deliveryFee?: number;
  deliveryDiscount?: number;
  currencySymbol?: string;
  style?: StyleProp<ViewStyle>;
}

interface SummaryRowProps {
  label: string;
  value: string;
  valueColor?: string;
  bold?: boolean;
}

const normaliseAmount = (amount: number) => Math.max(amount, 0);

export const PaymentSummary: FC<PaymentSummaryProps> = ({
  subtotal,
  deliveryFee = 0,
  deliveryDiscount = 0,
  currencySymbol,
  style,
}) => {
  const { t } = useTranslation();
  const activeCurrencySymbol = currencySymbol ?? t("common.currencySymbol");
  const safeSubtotal = normaliseAmount(subtotal);
  const safeDeliveryFee = normaliseAmount(deliveryFee);
  const appliedDeliveryDiscount = Math.min(
    normaliseAmount(deliveryDiscount),
    safeDeliveryFee,
  );
  const payableDeliveryFee = safeDeliveryFee - appliedDeliveryDiscount;
  const total = safeSubtotal + payableDeliveryFee;

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{t("cart.paymentSummary")}</Text>

      <SummaryRow
        label={t("cart.subtotal")}
        value={formatPrice(safeSubtotal, activeCurrencySymbol)}
      />
      <SummaryRow
        label={t("cart.deliveryFee")}
        value={formatPrice(safeDeliveryFee, activeCurrencySymbol)}
      />
      {appliedDeliveryDiscount > 0 ? (
        <SummaryRow
          label={t("cart.deliveryDiscount")}
          value={`-${formatPrice(appliedDeliveryDiscount, activeCurrencySymbol)}`}
          valueColor={colors.success}
          bold
        />
      ) : null}

      <View style={styles.divider} />

      <SummaryRow
        label={t("cart.total")}
        value={formatPrice(total, activeCurrencySymbol)}
        valueColor={colors.primary}
        bold
      />
    </View>
  );
};

const SummaryRow: FC<SummaryRowProps> = ({
  label,
  value,
  valueColor = colors.grey100,
  bold,
}) => {
  return (
    <View style={styles.row}>
      <Text style={[styles.label, bold ? styles.boldLabel : null]}>
        {label}
      </Text>
      <Text
        style={[
          styles.value,
          bold ? styles.boldValue : null,
          { color: valueColor },
        ]}
      >
        {value}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderGrey,
    borderRadius: 16,
    padding: 16,
    marginTop: 24,
  },
  title: {
    color: colors.grey100,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "900",
    marginBottom: 14,
  },
  row: {
    minHeight: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    flex: 1,
    color: colors.grey70,
    fontSize: 15,
    lineHeight: 21,
    marginRight: 16,
  },
  boldLabel: {
    color: colors.grey100,
    fontWeight: "800",
  },
  value: {
    color: colors.grey100,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "700",
  },
  boldValue: {
    fontSize: 17,
    lineHeight: 23,
    fontWeight: "900",
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderGrey,
    marginVertical: 12,
  },
});

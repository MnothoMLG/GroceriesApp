import React, { FC, useMemo, useState } from "react";
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { Leaf, RefreshCw, Sparkles } from "lucide-react-native";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";
import { AppButton, Text } from "@components";
import { ICartItem } from "@constants/types";
import { useBasketHealthCoach, useTranslation } from "@hooks";
import { colors } from "@theme";

interface HealthCoachProps {
  cartItems: Array<ICartItem>;
  style?: StyleProp<ViewStyle>;
}

export const HealthCoach: FC<HealthCoachProps> = ({ cartItems, style }) => {
  const { t } = useTranslation();
  const [hasRequestedTips, setHasRequestedTips] = useState(false);
  const basket = useMemo(() => {
    return cartItems.flatMap((item) =>
      Array.from({ length: item.quantity }, () => item.product),
    );
  }, [cartItems]);
  const { data, isLoading, isFetching, isError, refetch } =
    useBasketHealthCoach(basket, false);
  const loading = hasRequestedTips && (isLoading || isFetching);
  const suggestions = useMemo(() => {
    if (!data) {
      return [];
    }

    const recommendations = data.recommendations ?? [];
    const highlights = data.highlights ?? [];

    if (recommendations.length) {
      return recommendations;
    }

    if (highlights.length) {
      return highlights;
    }

    return data.summary ? [data.summary] : [];
  }, [data]);
  const showTips = hasRequestedTips && !loading && suggestions.length > 0;
  const showEmptyState =
    hasRequestedTips &&
    !loading &&
    !showTips &&
    (isError || !suggestions.length);

  const getTips = () => {
    setHasRequestedTips(true);
    refetch();
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <View style={styles.iconBubble}>
          <Leaf
            width={16}
            height={16}
            strokeWidth={2.4}
            color={colors.success}
          />
        </View>
        <View style={styles.copy}>
          <Text size={16} bold>
            {t("cart.healthCoachTitle")}
          </Text>
          <Text color={colors.borderGreyDark}>
            {t("cart.healthCoachSubtitle")}
          </Text>
        </View>

        {showTips || loading || showEmptyState ? (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={t("cart.healthCoachRefresh")}
            activeOpacity={0.72}
            disabled={loading}
            onPress={getTips}
            style={styles.refreshButton}
          >
            <RefreshCw
              width={16}
              height={16}
              strokeWidth={2.4}
              color={loading ? colors.borderGreyDark : colors.grey70}
            />
          </TouchableOpacity>
        ) : (
          <AppButton
            label={t("cart.healthCoachCta")}
            iconLeft={Sparkles}
            activeOpacity={0.82}
            disabled={!basket.length || loading}
            onPress={getTips}
            br={24}
            bold
            textSize={15}
            style={styles.cta}
          />
        )}
      </View>

      {loading ? (
        <View testID="health-coach-loading" style={styles.loadingContent}>
          <ShimmerLine style={styles.shimmerWide} />
          <ShimmerLine style={styles.shimmerMedium} />
          <ShimmerLine style={styles.shimmerShort} />
        </View>
      ) : null}

      {showTips ? (
        <View>
          {suggestions.slice(0, 3).map((suggestion) => (
            <View key={suggestion} style={styles.tipRow}>
              <Text>{"\u2022 "}</Text>
              <Text bold size={13} color={colors.dark}>
                {suggestion}
              </Text>
            </View>
          ))}
        </View>
      ) : null}

      {showEmptyState ? (
        <Text size={13} color={colors.textGrey}>
          {t("cart.healthCoachEmpty")}
        </Text>
      ) : null}
    </View>
  );
};

const ShimmerLine = ({ style }: { style: StyleProp<ViewStyle> }) => {
  return (
    <ShimmerPlaceholder
      LinearGradient={LinearGradient}
      style={[styles.shimmer, style]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderGrey,
    backgroundColor: colors.lightBrownish,
    padding: 16,
    marginTop: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBubble: {
    width: 36,
    height: 36,
    borderRadius: 27,
    backgroundColor: "#DDF2D9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  copy: {
    flex: 1,
    paddingRight: 12,
  },
  cta: {
    height: 48,
    minWidth: 128,
    paddingHorizontal: 18,
    backgroundColor: colors.success,
  },
  refreshButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContent: {
    marginTop: 26,
  },
  shimmer: {
    height: 18,
    borderRadius: 8,
    backgroundColor: "#F7F0D0",
    marginBottom: 14,
  },
  shimmerWide: {
    width: "94%",
  },
  shimmerMedium: {
    width: "84%",
  },
  shimmerShort: {
    width: "74%",
    marginBottom: 0,
  },

  tipRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 10,
  },
  bullet: {
    color: "#008B24",
    fontSize: 22,
    lineHeight: 25,
    marginRight: 12,
  },
  emptyText: {
    color: colors.grey70,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700",
    marginTop: 18,
  },
});

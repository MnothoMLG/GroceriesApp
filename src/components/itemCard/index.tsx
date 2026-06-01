import React, { FC } from "react";
import {
  StyleProp,
  StyleSheet,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { Plus } from "lucide-react-native";
import { colors } from "@theme";
import { IProduct } from "@constants/types";
import { Margin } from "../layout/layout";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "../image";
import { useSelector } from "react-redux";
import { getCartProductById } from "@store/shop/selectors";
import { AppState } from "@store/root.reducer";
import { ValueSelector } from "../valueSelector";
import { Text } from "../text";
import { useTranslation } from "@hooks";
import { formatPrice } from "@util";

export type ItemCardVariant = "catalog" | "cart";

export interface Props {
  product?: IProduct;
  index: number;
  variant?: ItemCardVariant;
  quantity?: number;
  subtitle?: string;
  originalPrice?: number;
  showRemoveAction?: boolean;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  onAddToCart?: () => void;
  onIncrement?: () => void;
  onDecrement?: () => void;
  onRemove?: () => void;
}

const getProductImage = (product: IProduct) =>
  product.image ||
  `https://placehold.co/200x200/png?text=${encodeURIComponent(product.name)}`;

export const ItemCard: FC<Props> = ({
  onPress,
  product,
  onAddToCart,
  onIncrement,
  onDecrement,
  variant = "catalog",
  quantity,
  subtitle,
  originalPrice,
  style,
  index,
}) => {
  const { t } = useTranslation();
  const cartItem = useSelector((state: AppState) =>
    product ? getCartProductById(product.id)(state) : undefined,
  );

  if (product) {
    const hasAvailability = product.quantity_available !== undefined;
    const availableQuantity = product.quantity_available ?? 0;
    const isAvailable = !hasAvailability || availableQuantity > 0;
    const productSubtitle =
      subtitle || product.description || product.category || product.unit;
    const comparisonPrice = originalPrice ?? product.originalPrice;
    const currencySymbol = t("common.currencySymbol");
    const unit = product.unit || t("common.oneItem");
    const cartQuantity = quantity ?? cartItem?.quantity ?? 0;
    const selectorQuantity = cartQuantity > 0 ? cartQuantity : 1;
    const cartItemTotal = product.price * selectorQuantity;
    const incrementProduct = onIncrement || onAddToCart || onPress;

    if (variant === "cart") {
      return (
        <TouchableOpacity
          activeOpacity={0.92}
          disabled={!onPress}
          onPress={onPress}
          style={[styles.cartRow, style]}
        >
          <View style={styles.cartContent}>
            <Image
              style={styles.cartImage}
              source={{ uri: getProductImage(product) }}
            />

            <View style={styles.cartDetails}>
              <Text style={styles.cartName} numberOfLines={1}>
                {product.name}
              </Text>
              <Text style={styles.cartUnit} numberOfLines={1}>
                {formatPrice(product.price, currencySymbol, true)}
                {" \u2022 "}
                {unit}
              </Text>
              <View style={styles.cartPriceRow}>
                <Text style={styles.cartPrice}>
                  {formatPrice(cartItemTotal, currencySymbol, true)}
                </Text>
                {comparisonPrice ? (
                  <Text style={styles.cartOriginalPrice}>
                    {formatPrice(comparisonPrice, currencySymbol, true)}
                  </Text>
                ) : null}
              </View>
            </View>

            <ValueSelector
              variant="cart"
              value={selectorQuantity}
              onIncrement={incrementProduct}
              onDecrement={onDecrement}
              style={styles.quantitySelector}
            />
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableNativeFeedback onPress={onPress}>
        <View
          style={[
            styles.catalogCard,
            !isAvailable ? styles.disabledCatalogCard : null,
            style,
          ]}
          key={product.id + index}
        >
          <View style={styles.catalogImageWrap}>
            <Image
              style={styles.catalogImage}
              source={{ uri: getProductImage(product) }}
            />
          </View>

          <View style={styles.catalogBody}>
            <Text bold style={styles.catalogName} numberOfLines={1}>
              {product.name}
            </Text>
            <Text size={12} color={colors.textGrey} numberOfLines={1}>
              {productSubtitle ||
                (isAvailable
                  ? t("common.freshGroceries")
                  : t("common.outOfStock"))}
            </Text>

            <View style={styles.catalogFooter}>
              <Text bold style={styles.catalogPrice}>
                {formatPrice(product.price, currencySymbol)}
              </Text>
              {cartQuantity > 0 ? (
                <ValueSelector
                  value={cartQuantity}
                  disabled={!isAvailable}
                  onIncrement={incrementProduct}
                  onDecrement={onDecrement}
                />
              ) : (
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityLabel={t("accessibility.addProductToCart", {
                    productName: product.name,
                  })}
                  activeOpacity={0.78}
                  disabled={!isAvailable}
                  onPress={incrementProduct}
                  style={[
                    styles.addButton,
                    !isAvailable ? styles.disabledAddButton : null,
                  ]}
                >
                  <Plus width={14} height={14} color={colors.white} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </TouchableNativeFeedback>
    );
  }

  return null;
};

export const ItemCardPlaceholder: FC<{
  variant?: ItemCardVariant;
  style?: StyleProp<ViewStyle>;
}> = ({ variant = "catalog", style }) => {
  if (variant === "cart") {
    return (
      <View style={[styles.cartContent, style]}>
        <ShimmerPlaceholder
          LinearGradient={LinearGradient}
          style={styles.cartImage}
        />
        <View style={styles.cartDetails}>
          <ShimmerPlaceholder
            style={styles.cartTitleShimmer}
            LinearGradient={LinearGradient}
          />
          <Margin mt={8} />
          <ShimmerPlaceholder
            style={styles.cartMetaShimmer}
            LinearGradient={LinearGradient}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.catalogCard, style]}>
      <ShimmerPlaceholder
        LinearGradient={LinearGradient}
        style={styles.catalogImageWrap}
      />
      <View style={styles.catalogBody}>
        <ShimmerPlaceholder
          style={styles.catalogTitleShimmer}
          LinearGradient={LinearGradient}
        />
        <Margin mt={12} />
        <ShimmerPlaceholder
          style={styles.catalogSubtitleShimmer}
          LinearGradient={LinearGradient}
        />
        <Margin mt={24} />
        <ShimmerPlaceholder
          style={styles.catalogPriceShimmer}
          LinearGradient={LinearGradient}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  catalogCard: {
    flex: 1,
    minHeight: 238,
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 10,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  disabledCatalogCard: {
    opacity: 0.58,
  },
  catalogImageWrap: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  catalogImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  ratingBadge: {
    position: "absolute",
    right: 0,
    top: 0,
    minWidth: 70,
    height: 48,
    paddingHorizontal: 12,
    borderTopRightRadius: 22,
    borderBottomLeftRadius: 22,
    backgroundColor: "rgba(31, 31, 31, 0.42)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  ratingStar: {
    color: "#FFC329",
    fontSize: 25,
    lineHeight: 28,
    marginRight: 7,
  },
  ratingText: {
    color: colors.white,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "800",
  },
  catalogBody: {
    paddingTop: 12,
    paddingHorizontal: 2,
    flex: 1,
  },
  catalogName: {
    color: colors.grey100,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "800",
  },
  catalogFooter: {
    marginTop: 12,
    flexDirection: "row",
    minHeight: 42,
    alignItems: "center",
    justifyContent: "space-between",
  },
  catalogPrice: {
    color: colors.grey100,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "900",
  },
  addButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  disabledAddButton: {
    backgroundColor: colors.borderGreyDark,
  },
  addButtonText: {
    color: colors.white,
    fontSize: 38,
    lineHeight: 42,
    fontWeight: "300",
    marginTop: -2,
  },
  cartRow: {
    width: "100%",
    minHeight: 122,
    flexDirection: "row",
    alignItems: "stretch",
  },
  cartContent: {
    flex: 1,
    minHeight: 122,
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderGrey,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 1,
  },
  cartImage: {
    width: 86,
    height: 92,
    borderRadius: 6,
    backgroundColor: "#F7F5EF",
  },
  cartDetails: {
    flex: 1,
    marginLeft: 14,
    paddingRight: 8,
  },
  cartName: {
    color: colors.primary,
    fontSize: 14,
    lineHeight: 19,
    fontWeight: "800",
  },
  cartUnit: {
    color: colors.grey,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
    fontWeight: "700",
  },
  cartPriceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 8,
  },
  cartPrice: {
    color: colors.primary,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "900",
  },
  cartOriginalPrice: {
    color: colors.grey,
    fontSize: 13,
    lineHeight: 18,
    marginLeft: 5,
    textDecorationLine: "line-through",
    fontWeight: "700",
  },
  quantitySelector: {
    alignSelf: "flex-end",
  },
  catalogTitleShimmer: {
    width: "82%",
    height: 28,
    borderRadius: 8,
  },
  catalogSubtitleShimmer: {
    width: "62%",
    height: 22,
    borderRadius: 8,
  },
  catalogPriceShimmer: {
    width: "54%",
    height: 34,
    borderRadius: 8,
  },
  cartTitleShimmer: {
    width: "70%",
    height: 18,
    borderRadius: 6,
  },
  cartMetaShimmer: {
    width: "46%",
    height: 18,
    borderRadius: 6,
  },
  container: {
    borderColor: colors.borderGrey,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    justifyContent: "space-between",
    height: 130,
  },
  detailShimmer: { maxWidth: "95%" },
  imgLoader: { height: 102 },
  details: {
    justifyContent: "center",
    alignItems: "flex-start",
    flex: 1,
    paddingLeft: 12,
  },
  image: {
    width: 100,
    height: "100%",
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  viewMore: {
    position: "absolute",
    right: 0,
    top: 0,
    height: 30,
    maxWidth: 30,
    alignSelf: "flex-end",
  },
});

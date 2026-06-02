import React, { useEffect, useMemo, useRef } from "react";
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Sparkles } from "lucide-react-native";
import { colors } from "@theme";
import {
  AppButton,
  BackButton,
  Image,
  Margin,
  Text,
  ValueSelector,
} from "@components";
import { routes } from "@navigation/routes";
import {
  GenericMainStackRouteProps,
  GenericMainStackScreenProps,
} from "@navigation/types";
import { EToastTypes, IProduct, ProductCategory } from "@constants/types";
import { addProductToCart, decrementProductInCart } from "@store/actions";
import { getAllProducts, getCartProductById } from "@store/shop/selectors";
import { AppState } from "@store/root.reducer";
import { useProductAiDetails, useTranslation } from "@hooks";
import { canAddProductQuantity, formatPrice, showToast } from "@util";
import { CATEGORY_OPTIONS } from "@constants";
import { getProductCategory } from "@util/products";

const DETAIL_GREEN = "#009A2B";

const ProductDetails = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigation = useNavigation<GenericMainStackScreenProps<routes.PDP>>();
  const { params } = useRoute<GenericMainStackRouteProps<routes.PDP>>();
  const allProducts = useSelector(getAllProducts);
  const product = params?.product;
  const cartItem = useSelector((state: AppState) =>
    product ? getCartProductById(product.id)(state) : undefined,
  );
  const {
    data,
    errorUpdatedAt = 0,
    isError: hasDetailsError,
    isLoading,
  } = useProductAiDetails(product);
  const lastDetailsErrorToastRef = useRef(0);

  const category = product
    ? getProductCategory({
        ...product,
        category: data?.product.category ?? product.category,
      })
    : "pantry";
  const categoryLabel = getCategoryLabel(category, t);
  const relatedProducts = useMemo(() => {
    if (!product) {
      return [];
    }

    return allProducts
      .filter((item) => {
        return item.id !== product.id && getProductCategory(item) === category;
      })
      .slice(0, 6);
  }, [allProducts, category, product]);

  useEffect(() => {
    const errorToastKey = errorUpdatedAt || (hasDetailsError ? 1 : 0);

    if (
      !hasDetailsError ||
      !errorToastKey ||
      lastDetailsErrorToastRef.current === errorToastKey
    ) {
      return;
    }

    lastDetailsErrorToastRef.current = errorToastKey;
    showToast({
      title: t("product.detailsLoadErrorTitle"),
      message: t("product.detailsLoadErrorMessage"),
      type: EToastTypes.ERROR,
    });
  }, [errorUpdatedAt, hasDetailsError, t]);

  if (isLoading) {
    return <ProductDetailsSkeleton />;
  }

  const aiProduct = data?.product;
  const pdp = data?.pdp;
  const productName =
    aiProduct?.name || product?.name || t("product.thisProduct");
  const price = aiProduct?.price ?? product?.price;
  const heroImage =
    aiProduct?.image ||
    product?.image ||
    `https://placehold.co/600x600/png?text=${encodeURIComponent(productName)}`;
  const unit = product?.unit || t("common.oneItem");
  const description =
    pdp?.description ||
    product?.description ||
    t("product.descriptionFallback", { productName });
  const badges = pdp?.badges ?? [];
  const nutritionHighlights = pdp?.nutritionHighlights ?? [];
  const servingSuggestions = pdp?.servingSuggestions ?? [];
  const cartQuantity = cartItem?.quantity ?? 0;
  const cartLineTotal = price !== undefined ? price * cartQuantity : undefined;
  const isSoldOut =
    product?.quantity_available === 0 || aiProduct?.quantity_available === 0;
  const notifyStockLimit = (cartProduct: IProduct) => {
    showToast({
      title: t("product.stockLimitTitle"),
      message: t("product.stockLimitMessage", {
        count: cartProduct.quantity_available ?? 0,
        productName: cartProduct.name,
      }),
      type: EToastTypes.ERROR,
    });
  };
  const incrementProduct = () => {
    if (!product) {
      return;
    }

    if (
      isSoldOut ||
      !canAddProductQuantity({ product, currentQuantity: cartQuantity })
    ) {
      notifyStockLimit(product);
      return;
    }

    dispatch(addProductToCart({ product }));
  };
  const decrementProduct = () => {
    if (product) {
      dispatch(decrementProductInCart({ productId: product.id }));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Margin style={styles.back}>
          <BackButton />
        </Margin>

        <View style={styles.imageStage}>
          <Image
            resizeMode="cover"
            style={styles.productImage}
            source={{ uri: heroImage }}
          />
        </View>

        <View style={styles.headerRow}>
          <View style={styles.titleColumn}>
            <Text style={styles.category}>{categoryLabel.toUpperCase()}</Text>
            <Text style={styles.title}>{productName}</Text>
            <Text style={styles.unit}>{unit}</Text>
          </View>
          <Text style={styles.price}>
            {price !== undefined
              ? formatPrice(price, t("common.currencySymbol"), true)
              : "-"}
          </Text>
        </View>

        <Text style={styles.description}>{description}</Text>

        {badges.length ? (
          <View style={styles.badgesWrap}>
            {badges.map((badge) => (
              <View key={badge} style={styles.badge}>
                <Sparkles
                  width={12}
                  height={12}
                  strokeWidth={2.4}
                  color="#0A2113"
                />
                <Text style={styles.badgeText}>{badge}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {product && cartQuantity > 0 ? (
          <View style={styles.detailsCartActionRow}>
            <View>
              <Text style={styles.detailsTotalLabel}>{t("cart.total")}</Text>
              <Text style={styles.detailsTotalPrice}>
                {cartLineTotal !== undefined
                  ? formatPrice(cartLineTotal, t("common.currencySymbol"), true)
                  : "-"}
              </Text>
            </View>
            <ValueSelector
              value={cartQuantity}
              disabled={!product}
              onIncrement={incrementProduct}
              onDecrement={decrementProduct}
              style={styles.detailsQuantitySelector}
            />
          </View>
        ) : (
          <AppButton
            fullWidth
            iconLeft={Plus}
            br={20}
            bold
            textSize={15}
            label={t("product.addToBasket")}
            disabled={!product || isSoldOut}
            onPress={incrementProduct}
            style={styles.addButton}
          />
        )}

        {relatedProducts.length ? (
          <View style={styles.relatedSection}>
            <Text style={styles.relatedTitle}>
              {t("product.moreInCategory", {
                category: categoryLabel.toUpperCase(),
              })}
            </Text>
            <FlatList
              horizontal
              data={relatedProducts}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <RelatedProductCard
                  product={item}
                  onPress={() =>
                    navigation.navigate(routes.PDP, { product: item })
                  }
                />
              )}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.relatedList}
            />
          </View>
        ) : null}

        <DetailSection
          title={t("product.nutritionHighlights")}
          items={nutritionHighlights}
        />
        <DetailSection
          title={t("product.servingSuggestions")}
          items={servingSuggestions}
        />
        {pdp?.storageTip ? (
          <View style={styles.detailCard}>
            <Text style={styles.detailTitle}>{t("product.storageTip")}</Text>
            <Text style={styles.detailText}>{pdp.storageTip}</Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

const getCategoryLabel = (
  category: ProductCategory,
  t: (name: string) => string,
) => {
  const option = CATEGORY_OPTIONS.find((item) => item.key === category);

  return option ? t(option.labelKey) : category;
};

const RelatedProductCard = ({
  product,
  onPress,
}: {
  product: IProduct;
  onPress: () => void;
}) => {
  const { t } = useTranslation();

  const getPlaceholderImage = (
    name: string,
    arg1: string,
  ): string | undefined => {
    return `https://placehold.co/200x200/png?text=${encodeURIComponent(
      product.name,
    )}`;
  };

  return (
    <TouchableOpacity
      accessibilityRole="button"
      activeOpacity={0.82}
      onPress={onPress}
      style={styles.relatedCard}
    >
      <Image
        resizeMode="cover"
        source={{
          uri:
            product.image ||
            getPlaceholderImage(product.name, t("product.thisProduct")),
        }}
        style={styles.relatedImage}
      />
      <Text style={styles.relatedName} numberOfLines={1}>
        {product.name}
      </Text>
      <Text style={styles.relatedPrice}>
        {formatPrice(product.price, t("common.currencySymbol"), true)}
      </Text>
    </TouchableOpacity>
  );
};

const DetailSection = ({
  title,
  items,
}: {
  title: string;
  items: Array<string>;
}) => {
  if (!items.length) {
    return null;
  }

  return (
    <View style={styles.detailCard}>
      <Text style={styles.detailTitle}>{title}</Text>
      {items.map((item) => (
        <View key={item} style={styles.detailRow}>
          <View style={styles.detailBullet} />
          <Text style={styles.detailText}>{item}</Text>
        </View>
      ))}
    </View>
  );
};

const ProductDetailsSkeleton = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Margin style={styles.back}>
          <BackButton />
        </Margin>

        <Shimmer style={styles.imageStage} />
        <View style={styles.headerRow}>
          <View style={styles.titleColumn}>
            <Shimmer style={styles.categoryShimmer} />
            <Shimmer style={styles.titleShimmer} />
            <Shimmer style={styles.unitShimmer} />
          </View>
          <Shimmer style={styles.priceShimmer} />
        </View>
        <Shimmer style={styles.descriptionShimmerWide} />
        <Shimmer style={styles.descriptionShimmer} />
        <View style={styles.badgesWrap}>
          <Shimmer style={styles.badgeShimmer} />
          <Shimmer style={styles.badgeShimmer} />
          <Shimmer style={styles.badgeShimmerWide} />
        </View>
        <Shimmer style={styles.buttonShimmer} />
        <Shimmer style={styles.relatedHeaderShimmer} />
        <View style={styles.skeletonRelatedRow}>
          <Shimmer style={styles.relatedCard} />
          <Shimmer style={styles.relatedCard} />
          <Shimmer style={styles.relatedCard} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const Shimmer = ({ style }: { style: StyleProp<ViewStyle> }) => (
  <ShimmerPlaceholder
    LinearGradient={LinearGradient}
    style={[styles.shimmer, style]}
  />
);

export default ProductDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFEFA",
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 28,
  },
  back: {
    marginBottom: 10,
  },
  imageStage: {
    width: "100%",
    height: 230,
    borderRadius: 20,
    backgroundColor: colors.lightBrownish,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginTop: 22,
  },
  titleColumn: {
    flex: 1,
    paddingRight: 12,
  },
  category: {
    color: DETAIL_GREEN,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "900",
    letterSpacing: 0,
    marginBottom: 6,
  },
  title: {
    color: "#0A2113",
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "900",
  },
  unit: {
    color: "#5C6B5F",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "800",
    marginTop: 6,
  },
  price: {
    color: DETAIL_GREEN,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "900",
    marginTop: 4,
  },
  description: {
    color: "#5C6B5F",
    fontSize: 15,
    lineHeight: 24,
    fontWeight: "700",
    marginTop: 18,
  },
  badgesWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 18,
    marginBottom: 12,
  },
  badge: {
    height: 30,
    borderRadius: 15,
    backgroundColor: "#F8F0CF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginRight: 8,
    marginBottom: 8,
  },
  badgeText: {
    color: "#0A2113",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "900",
    marginLeft: 6,
  },
  addButton: {
    height: 50,
    backgroundColor: DETAIL_GREEN,
    borderColor: DETAIL_GREEN,
    marginTop: 12,
    marginBottom: 30,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  detailsCartActionRow: {
    minHeight: 58,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#DADFD1",
    backgroundColor: colors.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: 12,
    marginBottom: 30,
  },
  detailsTotalLabel: {
    color: "#5C6B5F",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "800",
  },
  detailsTotalPrice: {
    color: DETAIL_GREEN,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "900",
    marginTop: 2,
  },
  detailsQuantitySelector: {
    width: 128,
    height: 42,
    borderRadius: 18,
    paddingHorizontal: 8,
  },
  relatedSection: {
    marginBottom: 22,
  },
  relatedTitle: {
    color: "#5C6B5F",
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "900",
    marginBottom: 12,
  },
  relatedList: {
    paddingRight: 16,
  },
  relatedCard: {
    width: 122,
    minHeight: 126,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#DADFD1",
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    marginRight: 10,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
  },
  relatedImage: {
    width: 44,
    height: 44,
    marginBottom: 8,
  },
  relatedName: {
    color: "#0A2113",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "900",
    textAlign: "center",
  },
  relatedPrice: {
    color: DETAIL_GREEN,
    fontSize: 14,
    lineHeight: 19,
    fontWeight: "900",
    marginTop: 5,
  },
  detailCard: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E9ECE4",
    backgroundColor: colors.white,
    padding: 14,
    marginBottom: 12,
  },
  detailTitle: {
    color: "#0A2113",
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "900",
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 8,
  },
  detailBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: DETAIL_GREEN,
    marginTop: 8,
    marginRight: 10,
  },
  detailText: {
    flex: 1,
    color: "#5C6B5F",
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "700",
  },
  shimmer: {
    borderRadius: 8,
  },
  categoryShimmer: {
    width: 82,
    height: 16,
    marginBottom: 10,
  },
  titleShimmer: {
    width: 160,
    height: 34,
    marginBottom: 10,
  },
  unitShimmer: {
    width: 58,
    height: 18,
  },
  priceShimmer: {
    width: 82,
    height: 32,
    marginTop: 4,
  },
  descriptionShimmerWide: {
    width: "100%",
    height: 18,
    marginTop: 20,
    marginBottom: 10,
  },
  descriptionShimmer: {
    width: "86%",
    height: 18,
  },
  badgeShimmer: {
    width: 96,
    height: 30,
    marginRight: 8,
    marginBottom: 8,
  },
  badgeShimmerWide: {
    width: 132,
    height: 30,
  },
  buttonShimmer: {
    width: "100%",
    height: 50,
    borderRadius: 20,
    marginTop: 12,
    marginBottom: 30,
  },
  relatedHeaderShimmer: {
    width: 150,
    height: 20,
    marginBottom: 12,
  },
  skeletonRelatedRow: {
    flexDirection: "row",
  },
});

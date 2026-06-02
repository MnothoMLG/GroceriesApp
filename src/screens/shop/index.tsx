import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { ChevronDown, MapPin } from "lucide-react-native";
import {
  Text as AppText,
  AppButton,
  Center,
  ItemCard,
  ItemCardPlaceholder,
  Input,
} from "@components";
import { useLoading, useTranslation } from "@hooks";
import { useDispatch, useSelector } from "react-redux";
import {
  addProductToCart,
  decrementProductInCart,
  fetchProductsRequest,
  GET_PRODUCTS_LOADING_KEY,
} from "@store/actions";
import { getAllProducts, getCartItems } from "@store/shop/selectors";
import {
  CATEGORY_OPTIONS,
  CategoryOption,
  EButtonVariants,
  EToastTypes,
  IProduct,
  ProductCategory,
  SEARCH_DEBOUNCE_MS,
} from "@constants";
import { colors } from "@theme";
import {
  canAddProductQuantity,
  filterProducts,
  getCartQuantityForProduct,
  getProductListData,
  showToast,
} from "@util";
import { routes } from "@navigation/routes";
import { useNavigation } from "@react-navigation/native";
import { GenericMainStackScreenProps } from "@navigation/types";

const Home = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation<GenericMainStackScreenProps<routes.PDP>>();
  const loading = useLoading(GET_PRODUCTS_LOADING_KEY);
  const products = useSelector(getAllProducts);
  const cartItems = useSelector(getCartItems);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<ProductCategory>("all");
  const didMountSearch = useRef(false);

  useEffect(() => {
    dispatch(fetchProductsRequest());
  }, []);

  useEffect(() => {
    if (!didMountSearch.current) {
      didMountSearch.current = true;
      setDebouncedSearch(searchQuery);
      return;
    }

    setSearchLoading(true);

    const searchTimeout = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
      setSearchLoading(false);
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(searchTimeout);
  }, [searchQuery]);

  const filteredProducts = useMemo(() => {
    return filterProducts({
      products,
      search: debouncedSearch,
      category: selectedCategory,
    });
  }, [products, debouncedSearch, selectedCategory]);

  const isListLoading = loading || searchLoading;
  const productListData = useMemo(
    () => getProductListData(filteredProducts, isListLoading),
    [filteredProducts, isListLoading],
  );

  const renderCategoryPill = ({ item }: { item: CategoryOption }) => {
    const selected = item.key === selectedCategory;
    const Icon = item.Icon;

    return (
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityState={{ selected }}
        activeOpacity={0.78}
        onPress={() => setSelectedCategory(item.key)}
        style={[
          styles.categoryPill,
          selected ? styles.categoryPillActive : null,
        ]}
      >
        <Icon
          width={16}
          height={16}
          strokeWidth={2.4}
          color={selected ? colors.white : colors.primary}
        />
        <AppText ml={4} color={selected ? colors.white : colors.primary}>
          {t(item.labelKey)}
        </AppText>
      </TouchableOpacity>
    );
  };

  const renderAddressCard = () => (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={t("accessibility.selectDeliveryAddress")}
      activeOpacity={0.78}
      onPress={() =>
        showToast({
          title: t("shop.addressToastTitle"),
          message: t("shop.addressToastMessage"),
          type: EToastTypes.SUCCESS,
        })
      }
      style={styles.addressButton}
    >
      <View style={styles.addressIcon}>
        <MapPin width={18} height={18} color={colors.primary} />
      </View>
      <View style={styles.addressCopy}>
        <AppText style={styles.addressLabel}>{t("cart.deliveryTitle")}</AppText>
        <AppText style={styles.addressText} numberOfLines={1}>
          {t("cart.deliveryLine")}
        </AppText>
      </View>
      <ChevronDown width={18} height={18} color={colors.primary} />
    </TouchableOpacity>
  );

  const notifyStockLimit = (product: IProduct) => {
    showToast({
      title: t("product.stockLimitTitle"),
      message: t("product.stockLimitMessage", {
        count: product.quantity_available ?? 0,
        productName: product.name,
      }),
      type: EToastTypes.ERROR,
    });
  };

  const addProduct = (product: IProduct) => {
    const currentQuantity = getCartQuantityForProduct(cartItems, product.id);

    if (!canAddProductQuantity({ product, currentQuantity })) {
      notifyStockLimit(product);
      return;
    }

    dispatch(addProductToCart({ product }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <AppText style={styles.headerKicker}>{t("shop.deliverTo")}</AppText>
          {renderAddressCard()}
        </View>
      </View>

      <View style={styles.searchWrap}>
        <Input
          search
          testID="search-input"
          value={searchQuery}
          placeholder={t("shop.search")}
          style={styles.searchInput}
          onClear={() => {
            setSearchQuery("");
          }}
          onChangeText={(text) => {
            setSearchQuery(text);
          }}
        />
      </View>

      <View style={styles.categoriesWrap}>
        <FlatList
          data={CATEGORY_OPTIONS}
          horizontal
          keyExtractor={(item) => item.key}
          renderItem={renderCategoryPill}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContent}
        />
        {searchLoading ? (
          <AppText style={styles.searchingText}>{t("shop.searching")}</AppText>
        ) : null}
      </View>

      <FlatList<IProduct | undefined>
        data={productListData}
        style={styles.list}
        numColumns={2}
        keyExtractor={(item, index) => (item ? String(item.id) : String(index))}
        columnWrapperStyle={styles.productRow}
        contentContainerStyle={styles.items}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) =>
          isListLoading || !item ? (
            <ItemCardPlaceholder style={styles.productCard} />
          ) : (
            <ItemCard
              index={index}
              product={item}
              style={styles.productCard}
              onAddToCart={() => {
                addProduct(item);
              }}
              onIncrement={() => {
                addProduct(item);
              }}
              onDecrement={() => {
                dispatch(decrementProductInCart({ productId: item.id }));
              }}
              onPress={() => {
                navigation.navigate(routes.PDP, { product: item });
              }}
            />
          )
        }
        ListEmptyComponent={
          !isListLoading ? (
            <Center>
              <AppText mt={56} mb={22}>
                {t("common.noResults")}
              </AppText>
              <AppButton
                variant={EButtonVariants.SECONDARY}
                label={` ${t("common.refresh")} `}
                br={5}
                style={styles.rfrsh}
                onPress={() => dispatch(fetchProductsRequest())}
                loading={isListLoading}
              />
            </Center>
          ) : null
        }
      />
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.screenBackground,
    paddingTop: 14,
  },
  header: {
    paddingHorizontal: 20,
  },
  headerText: {
    width: "100%",
  },
  headerKicker: {
    color: colors.grey70,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "800",
    marginBottom: 7,
  },
  addressButton: {
    minHeight: 62,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.softBorder,
    backgroundColor: colors.white,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 1,
  },
  addressIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  addressCopy: {
    flex: 1,
  },
  addressLabel: {
    color: colors.dark,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "900",
  },
  addressText: {
    color: colors.grey70,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 2,
    fontWeight: "600",
  },
  searchWrap: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 16,
  },
  searchInput: {
    height: 52,
    borderRadius: 14,
    borderColor: colors.softBorder,
    backgroundColor: colors.white,
  },
  categoriesWrap: {
    paddingBottom: 14,
  },
  categoriesContent: {
    paddingHorizontal: 20,
  },
  categoryPill: {
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.softBorder,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    marginRight: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  categoryPillActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  searchingText: {
    color: colors.grey70,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "700",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  items: {
    paddingHorizontal: 20,
    paddingTop: 2,
    paddingBottom: 116,
  },
  productRow: {
    justifyContent: "space-between",
  },
  productCard: {
    flex: 0,
    width: "48%",
    marginBottom: 16,
  },
  rfrsh: { width: 90 },
  list: { flex: 1, width: "100%" },
});

import React, { useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, View } from "react-native";
import { Store, Truck } from "lucide-react-native";
import { colors } from "@theme";
import { InfoCard, Text, ItemCard, AppButton, Margin } from "@components";
import { useNavigation } from "@react-navigation/native";
import { routes } from "@navigation/routes";
import { GenericMainStackScreenProps } from "@navigation/types";
import { useDispatch, useSelector } from "react-redux";
import {
  addProductToCart,
  decrementProductInCart,
  removeProductFromCart,
} from "@store/actions";
import { getCartItems, getCartTotal } from "@store/shop/selectors";
import { EToastTypes, ICartItem } from "@constants/types";
import { useTranslation } from "@hooks";
import { formatPrice, showToast } from "@util";
import { EmptyCart } from "./components/empty";
import { PaymentSummary } from "./components/summary";
import { HealthCoach } from "./components/healthCoach";
import {
  CHECKOUT_MINIMUM,
  DELIVERY_FEE,
  FREE_DELIVERY_THRESHOLD,
} from "@constants";

const MyCart = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigation = useNavigation<GenericMainStackScreenProps<routes.CART>>();
  const cartItems = useSelector(getCartItems);
  const cartTotal = useSelector(getCartTotal);
  const canCheckout = cartTotal >= CHECKOUT_MINIMUM;
  const checkoutRemaining = Math.max(CHECKOUT_MINIMUM - cartTotal, 0);
  const freeDeliveryRemaining = Math.max(
    FREE_DELIVERY_THRESHOLD - cartTotal,
    0,
  );
  const freeDeliveryProgress = Math.min(cartTotal / FREE_DELIVERY_THRESHOLD, 1);
  const deliveryDiscount =
    cartTotal >= FREE_DELIVERY_THRESHOLD ? DELIVERY_FEE : 0;
  const currencySymbol = t("common.currencySymbol");
  const [activeRemoveProductId, setActiveRemoveProductId] = useState<
    number | null
  >(null);

  const navigateToShop = () => {
    navigation.navigate(routes.SHOP);
  };

  const renderCartItem = ({
    item,
    index,
  }: {
    item: ICartItem;
    index: number;
  }) => {
    const { product } = item;
    const showRemoveAction = activeRemoveProductId === product.id;

    return (
      <ItemCard
        index={index}
        product={product}
        variant="cart"
        quantity={item.quantity}
        showRemoveAction={showRemoveAction}
        onPress={() => {
          setActiveRemoveProductId(showRemoveAction ? null : product.id);
        }}
        onIncrement={() => {
          dispatch(addProductToCart({ product }));
        }}
        onDecrement={() => {
          dispatch(decrementProductInCart({ productId: product.id }));
        }}
        onRemove={() => {
          dispatch(removeProductFromCart({ productId: product.id }));
          setActiveRemoveProductId(null);
        }}
      />
    );
  };

  const isCartEmpty = cartItems.length === 0;
  const freeDeliveryMessage =
    freeDeliveryRemaining > 0
      ? t("cart.freeDeliveryProgress", {
          amount: formatPrice(freeDeliveryRemaining, currencySymbol),
        })
      : t("cart.freeDeliveryUnlocked");

  return (
    <SafeAreaView style={styles.container}>
      {isCartEmpty ? (
        <EmptyCart navigateToShop={navigateToShop} />
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => String(item.product.id)}
            renderItem={renderCartItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListHeaderComponent={
              <Margin mt={24} mb={16}>
                <Text mb={12} color={colors.primary} bold size={14}>
                  {t("cart.deliveryAddress")}
                </Text>
                <InfoCard
                  icon={<Store width={24} height={24} color={colors.primary} />}
                  title={t("cart.deliveryTitle")}
                  description={t("cart.deliveryLine")}
                  meta={t("cart.deliveryDistance")}
                />

                <Text color={colors.primary} bold mt={16}>
                  {t("cart.items")}
                </Text>
              </Margin>
            }
            ItemSeparatorComponent={() => <Margin mb={16} />}
            ListFooterComponent={
              <View>
                <HealthCoach cartItems={cartItems} />

                <View style={styles.freeDeliveryCard}>
                  <View style={styles.freeDeliveryHeader}>
                    <Truck
                      width={26}
                      height={26}
                      strokeWidth={2.6}
                      color={colors.primary}
                    />
                    <Text ml={16} bold size={14}>
                      {freeDeliveryMessage}
                    </Text>
                  </View>
                  <View style={styles.progressTrack}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${freeDeliveryProgress * 100}%` },
                      ]}
                    />
                  </View>
                </View>

                <PaymentSummary
                  subtotal={cartTotal}
                  deliveryFee={DELIVERY_FEE}
                  deliveryDiscount={deliveryDiscount}
                  currencySymbol={currencySymbol}
                />
              </View>
            }
          />

          <View style={styles.checkoutWrap}>
            <AppButton
              disabled={!canCheckout}
              activeOpacity={0.85}
              onPress={() =>
                showToast({
                  title: t("cart.checkoutToastTitle"),
                  message: t("cart.checkoutToastMessage"),
                  type: EToastTypes.SUCCESS,
                })
              }
              label={
                canCheckout
                  ? t("cart.proceed")
                  : t("cart.topUp", {
                      amount: formatPrice(checkoutRemaining, currencySymbol),
                    })
              }
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default MyCart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFEFA",
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 126,
  },
  freeDeliveryCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderGrey,
    borderRadius: 16,
    padding: 16,
    marginTop: 32,
  },
  freeDeliveryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  progressTrack: {
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.borderGrey,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 8,
    backgroundColor: colors.success,
  },
  checkoutWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
  },
  checkoutText: {
    color: colors.white,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "800",
  },
  checkoutTotal: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "800",
    marginLeft: 10,
  },
});

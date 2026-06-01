import React, { useEffect, useRef } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ProductDetailsScreen, CartScreen, ShopScreen } from "@screens";
import { MainStackParamList } from "./types";
import { noHeader } from "@config";
import { routes } from "./routes";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { CustomTabBar } from "@components/tabBar";
import { useSelector } from "react-redux";
import { getCartTotal } from "@store/shop/selectors";
import { showToast } from "@util";
import { EToastTypes } from "@constants/types";
import { useTranslation } from "@hooks";

const MainStackNav = createStackNavigator<MainStackParamList>();

const Tab = createBottomTabNavigator<MainStackParamList>();

export const MainStack = () => {
  return (
    <MainStackNav.Navigator initialRouteName={routes.SHOP_TAB}>
      <MainStackNav.Screen
        {...noHeader}
        name={routes.SHOP_TAB}
        component={HomeTabNav}
      />
      <MainStackNav.Group screenOptions={{ presentation: "modal" }}>
        <MainStackNav.Screen
          {...noHeader}
          name={routes.PDP}
          component={ProductDetailsScreen}
        />
      </MainStackNav.Group>
    </MainStackNav.Navigator>
  );
};

const HomeTabNav = () => {
  const { t } = useTranslation();

  return (
    <>
      <CartThresholdNotifier />
      <Tab.Navigator tabBar={(props: any) => <CustomTabBar {...props} />}>
        <Tab.Screen {...noHeader} name={routes.SHOP} component={ShopScreen} />
        <Tab.Screen
          options={{ title: t("tabs.cart") }}
          name={routes.CART}
          component={CartScreen}
        />
      </Tab.Navigator>
    </>
  );
};

const CartThresholdNotifier = () => {
  const { t } = useTranslation();
  const cartTotal = useSelector(getCartTotal);
  const notifiedRef = useRef(false);

  useEffect(() => {
    if (cartTotal >= 10 && !notifiedRef.current) {
      showToast({
        type: EToastTypes.SUCCESS,
        title: t("cart.freeDelivery"),
        message: t("cart.thresholdReached"),
        topOffset: 48,
      });
      notifiedRef.current = true;
      return;
    }

    if (cartTotal < 10) {
      notifiedRef.current = false;
    }
  }, [cartTotal]);

  return null;
};

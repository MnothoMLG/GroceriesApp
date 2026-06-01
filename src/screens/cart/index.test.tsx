import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import MyCart from ".";
import {
  addProductToCart,
  decrementProductInCart,
  removeProductFromCart,
} from "@store/actions";
import { getCartItems, getCartTotal } from "@store/shop/selectors";
import { routes } from "@navigation/routes";

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
}));

jest.mock("lucide-react-native", () => {
  const { Text } = require("react-native");
  const Icon = ({ children }: any) => <Text>{children || "icon"}</Text>;

  return {
    ChevronLeft: Icon,
    Clock: Icon,
    MapPin: Icon,
    ShoppingBag: Icon,
    ShoppingCart: Icon,
    Store: Icon,
    Truck: Icon,
  };
});

jest.mock("@store/actions", () => ({
  addProductToCart: jest.fn((payload) => ({
    type: "addProductToCart",
    payload,
  })),
  decrementProductInCart: jest.fn((payload) => ({
    type: "decrementProductInCart",
    payload,
  })),
  removeProductFromCart: jest.fn((payload) => ({
    type: "removeProductFromCart",
    payload,
  })),
}));

jest.mock("@store/shop/selectors", () => ({
  getCartItems: jest.fn(),
  getCartTotal: jest.fn(),
}));

jest.mock("./components/healthCoach", () => {
  const { Text: RNText, View } = require("react-native");

  return {
    HealthCoach: () => (
      <View>
        <RNText>AI Health Coach</RNText>
      </View>
    ),
  };
});

jest.mock("@components", () => {
  const { Text: RNText, TouchableOpacity, View } = require("react-native");

  return {
    AppButton: ({ disabled, label, onPress }: any) => (
      <TouchableOpacity disabled={disabled} onPress={onPress}>
        <RNText>{label}</RNText>
      </TouchableOpacity>
    ),
    InfoCard: ({ description, meta, title }: any) => (
      <View>
        <RNText>{title}</RNText>
        <RNText>{description}</RNText>
        {meta ? <RNText>{meta}</RNText> : null}
      </View>
    ),
    Margin: ({ children }: any) => <View>{children}</View>,
    ItemCard: ({
      product,
      quantity,
      onIncrement,
      onDecrement,
      onRemove,
      onPress,
      showRemoveAction,
    }: any) => (
      <View>
        <TouchableOpacity onPress={onPress}>
          <RNText>{product.name}</RNText>
          <RNText>Qty {quantity}</RNText>
        </TouchableOpacity>
        <TouchableOpacity onPress={onIncrement}>
          <RNText>Increase</RNText>
        </TouchableOpacity>
        <TouchableOpacity onPress={onDecrement}>
          <RNText>Decrease</RNText>
        </TouchableOpacity>
        {showRemoveAction ? (
          <TouchableOpacity onPress={onRemove}>
            <RNText>Remove</RNText>
          </TouchableOpacity>
        ) : null}
      </View>
    ),
    Text: ({ children }: any) => <RNText>{children}</RNText>,
  };
});

const banana = {
  id: 1,
  name: "Banana",
  price: 3.15,
  image: "https://placehold.co/200x200/png?text=banana",
};

describe("MyCart", () => {
  const mockDispatch = jest.fn();
  const mockNavigate = jest.fn();
  const mockGoBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    (useNavigation as jest.Mock).mockReturnValue({
      canGoBack: () => false,
      goBack: mockGoBack,
      navigate: mockNavigate,
    });
  });

  it("renders an empty cart state", () => {
    (useSelector as unknown as jest.Mock).mockImplementation((selector) => {
      if (selector === getCartItems) return [];
      if (selector === getCartTotal) return 0;
    });

    const { getByText } = render(<MyCart />);

    expect(getByText("Your cart is empty")).toBeTruthy();

    fireEvent.press(getByText("Start Shopping"));
    expect(mockNavigate).toHaveBeenCalledWith(routes.SHOP);
  });

  it("renders cart items and dispatches quantity actions", () => {
    (useSelector as unknown as jest.Mock).mockImplementation((selector) => {
      if (selector === getCartItems) return [{ product: banana, quantity: 2 }];
      if (selector === getCartTotal) return 6.3;
    });

    const { getByText, queryByText } = render(<MyCart />);

    expect(getByText("Banana")).toBeTruthy();
    expect(getByText("Qty 2")).toBeTruthy();
    expect(getByText("Add R 3.70 more for free delivery")).toBeTruthy();
    expect(getByText("AI Health Coach")).toBeTruthy();
    expect(getByText("Payment Summary")).toBeTruthy();
    expect(getByText("R 8.30")).toBeTruthy();
    expect(getByText("Proceed to Checkout")).toBeTruthy();
    expect(queryByText("Remove")).toBeNull();

    fireEvent.press(getByText("Increase"));
    expect(addProductToCart).toHaveBeenCalledWith({ product: banana });

    fireEvent.press(getByText("Decrease"));
    expect(decrementProductInCart).toHaveBeenCalledWith({ productId: 1 });
  });

  it("reveals and dispatches remove action for a cart item", () => {
    (useSelector as unknown as jest.Mock).mockImplementation((selector) => {
      if (selector === getCartItems) return [{ product: banana, quantity: 1 }];
      if (selector === getCartTotal) return 3.15;
    });

    const { getByText } = render(<MyCart />);

    fireEvent.press(getByText("Banana"));
    fireEvent.press(getByText("Remove"));

    expect(removeProductFromCart).toHaveBeenCalledWith({ productId: 1 });
  });
});

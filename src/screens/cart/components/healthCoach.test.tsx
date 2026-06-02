import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import { HealthCoach } from "./healthCoach";
import { ICartItem } from "@constants/types";

const mockUseBasketHealthCoach = jest.fn();
const mockShowToast = jest.fn();

jest.mock("@hooks", () => ({
  useBasketHealthCoach: (...args: unknown[]) => mockUseBasketHealthCoach(...args),
  useTranslation: () => ({
    t: (key: string) =>
      ({
        "cart.healthCoachCta": "Get tips",
        "cart.healthCoachEmpty": "No tips available for this basket yet.",
        "cart.healthCoachErrorMessage":
          "We could not load basket tips right now.",
        "cart.healthCoachErrorTitle": "Health coach unavailable",
        "cart.healthCoachRefresh": "Refresh health coach tips",
        "cart.healthCoachSubtitle": "Personalised tips for your basket",
        "cart.healthCoachTitle": "AI Health Coach",
      })[key] ?? key,
  }),
}));

jest.mock("@util", () => ({
  showToast: (...args: unknown[]) => mockShowToast(...args),
}));

jest.mock("lucide-react-native", () => {
  const { Text } = require("react-native");
  const Icon = ({ children }: any) => <Text>{children || "icon"}</Text>;

  return {
    Leaf: Icon,
    RefreshCw: Icon,
    Sparkles: Icon,
  };
});

jest.mock("react-native-shimmer-placeholder", () => {
  const { View } = require("react-native");

  return ({ style }: any) => <View style={style} />;
});

jest.mock("expo-linear-gradient", () => ({
  LinearGradient: "LinearGradient",
}));

jest.mock("@components", () => {
  const { Text: RNText, TouchableOpacity } = require("react-native");

  return {
    AppButton: ({ disabled, label, onPress }: any) => (
      <TouchableOpacity disabled={disabled} onPress={onPress}>
        <RNText>{label}</RNText>
      </TouchableOpacity>
    ),
    Text: ({ children }: any) => <RNText>{children}</RNText>,
  };
});

const banana = {
  id: 1,
  name: "Banana",
  price: 3.15,
};

const strawberry = {
  id: 2,
  name: "Strawberries",
  price: 3.5,
};

const cartItems: Array<ICartItem> = [
  { product: banana, quantity: 2 },
  { product: strawberry, quantity: 1 },
];

describe("HealthCoach", () => {
  const refetch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseBasketHealthCoach.mockReturnValue({
      data: undefined,
      isError: false,
      isFetching: false,
      isLoading: false,
      refetch,
    });
  });

  it("renders the CTA and keeps the basket query disabled until pressed", () => {
    const { getByText } = render(<HealthCoach cartItems={cartItems} />);

    expect(getByText("AI Health Coach")).toBeTruthy();
    expect(getByText("Personalised tips for your basket")).toBeTruthy();
    expect(getByText("Get tips")).toBeTruthy();
    expect(refetch).not.toHaveBeenCalled();
    expect(mockUseBasketHealthCoach).toHaveBeenCalledWith(
      [banana, banana, strawberry],
      false,
    );

    fireEvent.press(getByText("Get tips"));

    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("shows a loading state after tips have been requested", () => {
    mockUseBasketHealthCoach.mockReturnValue({
      data: undefined,
      isError: false,
      isFetching: true,
      isLoading: false,
      refetch,
    });

    const { getByText, getByTestId } = render(
      <HealthCoach cartItems={cartItems} />,
    );

    fireEvent.press(getByText("Get tips"));

    expect(getByTestId("health-coach-loading")).toBeTruthy();
  });

  it("renders returned recommendations and allows refresh", () => {
    mockUseBasketHealthCoach.mockReturnValue({
      data: {
        actions: [],
        highlights: [],
        recommendations: [
          "Add Greek yogurt for protein.",
          "Try fresh mint with berries.",
          "Wash berries just before eating.",
          "This fourth tip should not render.",
        ],
        score: 72,
        status: "good",
        summary: "Balanced basket.",
        swaps: [],
        title: "Good basket",
      },
      isError: false,
      isFetching: false,
      isLoading: false,
      refetch,
    });

    const { getByLabelText, getByText, queryByText } = render(
      <HealthCoach cartItems={cartItems} />,
    );

    fireEvent.press(getByText("Get tips"));

    expect(getByText("Add Greek yogurt for protein.")).toBeTruthy();
    expect(getByText("Try fresh mint with berries.")).toBeTruthy();
    expect(getByText("Wash berries just before eating.")).toBeTruthy();
    expect(queryByText("This fourth tip should not render.")).toBeNull();

    fireEvent.press(getByLabelText("Refresh health coach tips"));
    expect(refetch).toHaveBeenCalledTimes(2);
  });

  it("shows an empty state when no suggestions are returned", () => {
    mockUseBasketHealthCoach.mockReturnValue({
      data: undefined,
      errorUpdatedAt: 12,
      isError: true,
      isFetching: false,
      isLoading: false,
      refetch,
    });

    const { getByText } = render(<HealthCoach cartItems={cartItems} />);

    fireEvent.press(getByText("Get tips"));

    expect(getByText("No tips available for this basket yet.")).toBeTruthy();
    expect(mockShowToast).toHaveBeenCalledWith({
      title: "Health coach unavailable",
      message: "We could not load basket tips right now.",
      type: "error",
    });
  });
});

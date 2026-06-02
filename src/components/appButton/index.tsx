import React, { FC } from "react";
import { Text } from "../text";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from "react-native";
import { colors } from "@theme";
import { SvgProps } from "react-native-svg";
import { EButtonVariants } from "@constants/types";
import * as Animatable from "react-native-animatable";

export interface AppButtonProps extends TouchableOpacityProps {
  label?: string;
  fullWidth?: boolean;
  rounded?: boolean;
  loading?: boolean;
  variant?: EButtonVariants;
  br?: number;
  bold?: boolean;
  textSize?: number;
  textColor?: string;
  iconRight?: FC<SvgProps>;
  iconLeft?: FC<SvgProps>;
}

export const AppButton: FC<AppButtonProps> = ({
  label,
  children,
  fullWidth,
  style,
  loading,
  textSize,
  textColor,
  br = 16,
  bold,
  rounded,
  variant = EButtonVariants.PRIMARY,
  disabled,
  iconLeft: IconLeft,
  iconRight: IconRight,
  ...props
}) => {
  return (
    <TouchableOpacity
      style={[
        bodyStyle.base,
        variantBodyStyle[variant],
        fullWidth ? bodyStyle.fullWidth : null,
        style,
        { borderRadius: br || 0 },
        disabled ? bodyStyle.disabled : null,
        IconRight && { justifyContent: "space-between" },
      ]}
      {...props}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "primary" ? colors.white : colors.primary}
          size="small"
        />
      ) : label ? (
        <>
          {IconLeft ? (
            <IconLeft
              color={
                textColor ||
                (variant === EButtonVariants.PRIMARY
                  ? colors.white
                  : colors.primary)
              }
              width={19}
              height={19}
              strokeWidth={1}
            />
          ) : null}
          <Text
            ml={IconLeft ? 8 : 0}
            mr={IconRight ? 8 : 0}
            color={textColor || textStyle[variant]}
            size={textSize || 14}
            bold={bold}
          >
            {label}
          </Text>

          {IconRight ? (
            <IconRight
              color={
                textColor ||
                (variant === EButtonVariants.PRIMARY
                  ? colors.white
                  : colors.primary)
              }
              width={textSize || 19}
              height={19}
              strokeWidth={1}
            />
          ) : null}
        </>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
};
const textStyle: Record<EButtonVariants, string> = {
  [EButtonVariants.PRIMARY]: colors.white,
  [EButtonVariants.SECONDARY]: colors.primary,
  [EButtonVariants.TERTIARY]: colors.primary,
  [EButtonVariants.LINK]: colors.primary,
};

const bodyStyle = StyleSheet.create({
  base: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 16,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  tertiary: {
    borderStyle: "dashed",
    borderColor: colors.primary,
    borderWidth: 1,
    backgroundColor: colors.white,
  },
  secondary: {
    borderColor: colors.primary,
    borderWidth: 1,
    backgroundColor: colors.transparent,
    paddingHorizontal: 12,
  },
  link: {
    backgroundColor: colors.transparent,
    paddingHorizontal: 0,
  },
  fullWidth: {
    width: "100%",
  },
  disabled: {
    opacity: 0.5,
    backgroundColor: colors.primary,
  },
});

const variantBodyStyle: Record<EButtonVariants, ViewStyle> = {
  [EButtonVariants.PRIMARY]: bodyStyle.primary,
  [EButtonVariants.SECONDARY]: bodyStyle.secondary,
  [EButtonVariants.TERTIARY]: bodyStyle.tertiary,
  [EButtonVariants.LINK]: bodyStyle.link,
};

export const AnimatedButton =
  Animatable.createAnimatableComponent(TouchableOpacity);

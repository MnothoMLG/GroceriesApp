import { colors } from "@theme";
import { FC } from "react";
import { TextProps, Text as RnText } from "react-native";

interface Props extends TextProps {
  bold?: boolean;
  align?: "auto" | "left" | "right" | "center" | "justify";
  xtraBold?: boolean;
  size?: number;
  wrap?: "nowrap" | "wrap";
  color?: string;
  ml?: number;
  fw?: string | number;
  mb?: number;
  mt?: number;
  mr?: number;
  lh?: number;
}
export const Text: FC<Props> = ({
  size,
  align,
  wrap,
  lh,
  color,
  mb,
  mt,
  ml,
  mr,
  bold,
  xtraBold,
  children,
  style,
  ...props
}) => (
  <RnText
    {...props}
    style={[
      {
        fontSize: size || 13,
        flexWrap: wrap,
        textAlign: align || "left",
        marginLeft: ml,
        marginRight: mr,
        marginBottom: mb,
        marginTop: mt,
        lineHeight: lh || (size ? size * 1.4 : 18.2),
        color: color || colors.grey100,
        fontWeight: bold ? "bold" : xtraBold ? "800" : "normal",
      },
      style,
    ]}
  >
    {children}
  </RnText>
);

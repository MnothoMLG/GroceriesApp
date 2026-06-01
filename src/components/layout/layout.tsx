import { SafeAreaView, View, ViewProps, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { FC, ReactNode } from 'react';

export const Center: FC<ViewProps> = ({ children, style }) => (
  <View style={[{ justifyContent: 'center', alignItems: 'center' }, style]}>
    {children}
  </View>
);

type RowJustify = NonNullable<ViewStyle['justifyContent']>;
type RowAlign = NonNullable<ViewStyle['alignItems']>;

export function Margin({
  mb,
  ml,
  mr,
  mt,
  children,
  style,
}: {
  [key: string]: number | Element | ViewStyle | ReactNode; //could just extend ViewProps
  style?: ViewStyle;
  children?: ReactNode;
}) {
  return (
    <View
      style={[
        {
          marginTop: mt as number,
          marginBottom: mb as number,
          marginLeft: ml as number,
          marginRight: mr as number,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

interface RowProps extends ViewProps {
  mt?: number;
  mb?: number;
  bg?: string;
  fullWidth?: boolean;
  justify?: RowJustify;
  align?: RowAlign;
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
}

export const Row: FC<RowProps> = ({
  fullWidth,
  mt,
  mb,
  align,
  justify,
  bg,
  children,
}) => {
  return (
    <View
      style={{
        width: fullWidth ? '100%' : 'auto',
        flexDirection: 'row',
        marginTop: mt,
        marginBottom: mb,
        backgroundColor: bg || 'transparent',
        justifyContent: justify,
        alignItems: align,
      }}
    >
      {children}
    </View>
  );
};
export const Column: FC<RowProps> = ({
  fullWidth,
  mt,
  mb,
  align,
  justify,
  bg,
  children,
}) => {
  return (
    <View
      style={{
        width: fullWidth ? '100%' : 'auto',
        flexDirection: 'column',
        marginTop: mt,
        marginBottom: mb,
        backgroundColor: bg,
        justifyContent: justify,
        alignItems: align,
      }}
    >
      {children}
    </View>
  );
};

export function Padding({
  pb,
  pl,
  pr,
  pt,
  p,
  children,
  style,
}: {
  [key: string]: number | ReactNode | ViewStyle;
  style?: ViewStyle;
  children?: ReactNode;
}) {
  return (
    <View
      style={[
        {
          paddingTop: (p || pt) as number,
          paddingBottom: (p || pb) as number,
          paddingLeft: (p || pl) as number,
          paddingRight: (p || pr) as number,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export const Footer: FC<ViewProps> = ({ children }) => {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      style={{
        position: 'absolute',
        width: '100%',
        bottom: insets.bottom,
        padding: 20,
      }}
    >
      {children}
    </SafeAreaView>
  );
};

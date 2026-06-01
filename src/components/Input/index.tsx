/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import {
  TextInput,
  View,
  TextInputProps,
  TouchableOpacity,
  ViewStyle,
  StyleProp,
} from 'react-native';
import styles from './Styles';
import { Text } from '@components/text';
import { CrossIcon } from '../../assets';
import { colors } from '@theme';
import { useIsFocused } from '@react-navigation/native';
import { Row } from '@components/layout/layout';

interface IProps extends TextInputProps {
  style?: Record<string, unknown> | Record<string, unknown>[];
  wrapperStyle?: StyleProp<ViewStyle>;
  error?: string;
  centerText?: boolean;
  label?: string;
  left?: ReactNode;
  required?: boolean;
  light?: boolean;
  disabled?: boolean;
  search?: boolean;
  placeholder?: string;
  placeholderTextColor?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  onClear?: () => void;
  onChangeText?: (v: string) => void;
}

export const Input = ({
  style = {},
  label,
  light,
  centerText,
  wrapperStyle,
  search,
  left,
  required,
  error,
  disabled,
  onClear,
  ...props
}: IProps) => {
  const textChanged = (text: string): void => {
    props.onChangeText && props.onChangeText(text);
  };
  const [focused, setFocused] = useState(false);
  const [touched, setTouched] = useState(false);
  const [value, setValue] = useState('');
  const erronus = error && touched;
  const searchRef: any = useRef(null);
  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused && props?.autoFocus) {
      searchRef?.current?.focus();
    }
  }, [isFocused]);

  return (
    <View style={wrapperStyle}>
      {label && (
        <Row mb={8}>
          <Text
            color={light ? colors.white : colors.grey70}
            style={styles.leftAlign}
            bold
          >
            {label}
          </Text>
          {required && (
            <Text bold style={styles.required}>
              *
            </Text>
          )}
        </Row>
      )}
      <View
        style={[
          styles.container,
          style,
          !!erronus && styles.errorInput,
          focused && styles.focused,
          disabled && styles.disabled,
        ]}
      >
        {!!left && (
          <TouchableOpacity style={styles.search}>{left}</TouchableOpacity>
        )}
        <TextInput
          placeholderTextColor={colors.grey}
          style={[
            styles.input,
            centerText && styles.centerText,
            disabled && { color: colors.grey70 },
            //ToDO: Fix-Me erronus  == struggled getting the bold on and off on errors
          ]}
          ref={searchRef}
          placeholder={props.placeholder || ''}
          cursorColor={colors.primary}
          selectionColor={`${colors.primary}A1`}
          editable={!disabled}
          {...props}
          onChangeText={(text: string) => {
            textChanged(text);
            setValue(text);
          }}
          value={props.value || value}
          onFocus={() => {
            setFocused(true);
            props?.onFocus && props?.onFocus?.();
          }}
          onBlur={() => {
            setFocused(false);
            setTouched(true);
            props?.onBlur && props?.onBlur?.();
          }}
        />

        {search && (
          <TouchableOpacity
            onPress={() => {
              setValue('');
              textChanged('');
              onClear?.();
            }}
            style={styles.search}
          >
            {value ? (
              <CrossIcon width={20} height={20} color={colors.grey100} />
            ) : null}
          </TouchableOpacity>
        )}
      </View>
      {erronus && (
        <Text
          mt={8}
          size={13}
          align='left'
          style={styles.leftAlign}
          color={colors.danger}
        >
          {error}
        </Text>
      )}
    </View>
  );
};
export default Input;

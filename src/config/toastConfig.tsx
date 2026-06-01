import { View, StyleSheet } from "react-native";
import { Text } from "@components/text";
import { colors } from "@theme";

interface ToastProps {
  text2?: string;
  text1?: string;
}
export const toastConfig = {
  success: ({ text2, text1 }: ToastProps) => (
    <View style={[styles.successContainer, styles.shadow]}>
      <Text ml={16} bold size={16}>
        {text1}
      </Text>
      {!!text2 && (
        <Text color={colors.textGrey} ml={16} size={12}>
          {text2}
        </Text>
      )}
    </View>
  ),
  error: ({ text2, text1 }: ToastProps) => (
    <View style={[styles.errorContainer, styles.shadow]}>
      <Text ml={16} bold size={16}>
        {text2}
      </Text>

      {!!text1 && (
        <Text ml={16} size={12}>
          {text1}
        </Text>
      )}
    </View>
  ),
};

const styles = StyleSheet.create({
  successContainer: {
    borderLeftColor: colors.success,
    borderLeftWidth: 12,
    backgroundColor: colors.white,
    minHeight: 56,
    marginTop: 70,
    justifyContent: "center",
    alignSelf: "center",
    width: "94%",
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  errorContainer: {
    borderLeftColor: colors.danger,
    backgroundColor: colors.white,
    alignSelf: "center",
    justifyContent: "center",
    minHeight: 56,
    borderLeftWidth: 12,
    width: "94%",
  },
});

import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { colors } from "@theme";
import { useNavigation } from "@react-navigation/native";
import { X } from "lucide-react-native";

export const BackButton = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.back}>
      <TouchableOpacity
        onPress={() => {
          navigation.canGoBack() && navigation.goBack();
        }}
      >
        <X width={30} height={24} color={colors.black} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  back: {
    width: "100%",
    alignItems: "flex-end",
    backgroundColor: colors.white,
    height: 40,
    paddingTop: 8,
  },
});

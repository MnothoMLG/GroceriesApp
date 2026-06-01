import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Clock, MapPin } from "lucide-react-native";
import { colors } from "@theme";

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  meta?: string;
}

export const InfoCard = ({
  icon,
  title,
  description,
  actionLabel,
  meta,
}: InfoCardProps) => (
  <View style={styles.infoCard}>
    <View style={styles.infoIcon}>{icon}</View>
    <View style={styles.infoBody}>
      <Text style={styles.infoTitle}>{title}</Text>
      <Text style={styles.infoDescription} numberOfLines={1}>
        {description}
      </Text>
      {meta ? (
        <View style={styles.metaRow}>
          <MapPin width={13} height={13} color={colors.grey} />
          <Text style={styles.metaText}>{meta}</Text>
        </View>
      ) : (
        <View style={styles.metaRow}>
          <Clock width={13} height={13} color={colors.grey} />
          <Text style={styles.metaText}>Ready today</Text>
        </View>
      )}
    </View>
    {actionLabel ? (
      <TouchableOpacity activeOpacity={0.72} style={styles.changeButton}>
        <Text style={styles.changeText}>{actionLabel}</Text>
      </TouchableOpacity>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  infoCard: {
    minHeight: 86,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E9ECE4",
    backgroundColor: colors.white,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  infoIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F7F4F0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  infoBody: {
    flex: 1,
  },
  infoTitle: {
    color: colors.primary,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "800",
  },
  infoDescription: {
    color: colors.grey70,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 2,
    fontWeight: "600",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  metaText: {
    color: colors.grey,
    fontSize: 12,
    lineHeight: 16,
    marginLeft: 4,
    fontWeight: "600",
  },
  changeButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  changeText: {
    color: "#8AAD44",
    fontSize: 10,
    lineHeight: 14,
    fontWeight: "900",
  },
});

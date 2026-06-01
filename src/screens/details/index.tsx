import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";
import { useRoute } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { Leaf, Lightbulb, PackageCheck, Sparkles } from "lucide-react-native";
import { colors } from "@theme";
import { AppButton, BackButton, Image, Margin, Text } from "@components";
import { routes } from "@navigation/routes";
import { GenericMainStackRouteProps } from "@navigation/types";
import { EButtonVariants } from "@constants/types";
import { addProductToCart } from "@store/actions";
import { useProductAiDetails, useTranslation } from "@hooks";
import { formatPrice } from "@util";

const ProductDetails = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { params } = useRoute<GenericMainStackRouteProps<routes.PDP>>();
  const product = params?.product;
  const { data, isLoading } = useProductAiDetails(product);

  if (isLoading) {
    return <ProductDetailsSkeleton />;
  }

  const pdp = data?.pdp;
  const aiProduct = data?.product;
  const productName = product?.name || t("product.thisProduct");
  const title = pdp?.title || productName;
  const shortDescription =
    pdp?.shortDescription ||
    product?.description ||
    t("product.descriptionFallback", { productName });
  const heroImage =
    data?.aiImages?.[0]?.url ||
    aiProduct?.image ||
    product?.image ||
    `https://placehold.co/600x600/png?text=${encodeURIComponent(productName)}`;
  const price = aiProduct?.price ?? product?.price;
  const category =
    aiProduct?.category || product?.category || t("common.freshGroceries");
  const availableQuantity = product?.quantity_available;
  let availability: string;

  if (availableQuantity === undefined) {
    availability = t("common.available");
  } else if (availableQuantity > 0) {
    availability = t("product.availableCount", { count: availableQuantity });
  } else {
    availability = t("common.outOfStock");
  }

  const benefits = pdp?.benefits ?? [];
  const servingIdeas = pdp?.servingIdeas ?? [];
  const tags = pdp?.tags ?? [];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Margin style={styles.back}>
          <BackButton />
        </Margin>

        <View style={styles.hero}>
          <Image style={styles.heroImage} source={{ uri: heroImage }} />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.6)", "#000"]}
            style={styles.gradient}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
          >
            <Text style={styles.heroTitle}>{title}</Text>
            <Text style={styles.heroSubtitle} numberOfLines={2}>
              {shortDescription}
            </Text>
          </LinearGradient>
        </View>

        <View style={styles.body}>
          <View style={styles.statsRow}>
            <StatCard
              label={t("product.price")}
              value={
                price !== undefined
                  ? formatPrice(price, t("common.currencySymbol"))
                  : "-"
              }
            />
            <StatCard label={t("product.unit")} value={product?.unit || "-"} />
            <StatCard label={t("product.stock")} value={availability} />
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.sectionHeader}>
              <Sparkles width={18} height={18} color={colors.primary} />
              <Text style={styles.sectionTitle}>{t("product.aiSummary")}</Text>
            </View>
            <Text style={styles.bodyText}>
              {pdp?.aiSummary || shortDescription}
            </Text>
          </View>

          <View style={styles.healthCard}>
            <View style={styles.sectionHeader}>
              <Leaf width={18} height={18} color={colors.success} />
              <Text style={styles.sectionTitle}>
                {t("product.healthLabel")}
              </Text>
            </View>
            <Text style={styles.healthText}>
              {pdp?.healthLabel || category}
            </Text>
          </View>

          <DetailList
            title={t("product.benefits")}
            icon={
              <PackageCheck width={18} height={18} color={colors.primary} />
            }
            items={benefits}
          />

          <DetailList
            title={t("product.servingIdeas")}
            icon={<Lightbulb width={18} height={18} color={colors.primary} />}
            items={servingIdeas}
          />

          {pdp?.storageTip ? (
            <View style={styles.summaryCard}>
              <Text style={styles.sectionTitle}>{t("product.storageTip")}</Text>
              <Text style={styles.bodyText}>{pdp.storageTip}</Text>
            </View>
          ) : null}

          {tags.length > 0 ? (
            <View style={styles.tagsWrap}>
              {tags.map((tag) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          ) : null}

          {pdp?.disclaimer ? (
            <Text style={styles.disclaimer}>{pdp.disclaimer}</Text>
          ) : null}

          <AppButton
            variant={EButtonVariants.SECONDARY}
            label={t("product.addToCart")}
            disabled={!product || availableQuantity === 0}
            onPress={() => {
              if (product) {
                dispatch(addProductToCart({ product }));
              }
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const StatCard = ({ label, value }: { label: string; value: string }) => {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
};

const DetailList = ({
  title,
  icon,
  items,
}: {
  title: string;
  icon: React.ReactNode;
  items: Array<string>;
}) => {
  if (!items.length) {
    return null;
  }

  return (
    <View style={styles.summaryCard}>
      <View style={styles.sectionHeader}>
        {icon}
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {items.map((item) => (
        <View key={item} style={styles.listItem}>
          <View style={styles.bullet} />
          <Text style={styles.listText}>{item}</Text>
        </View>
      ))}
    </View>
  );
};

const ProductDetailsSkeleton = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Margin style={styles.back}>
          <BackButton />
        </Margin>

        <Shimmer style={styles.hero} />
        <View style={styles.body}>
          <View style={styles.statsRow}>
            <Shimmer style={styles.statShimmer} />
            <Shimmer style={styles.statShimmer} />
            <Shimmer style={styles.statShimmer} />
          </View>
          <Shimmer style={styles.titleShimmer} />
          <Shimmer style={styles.textShimmerWide} />
          <Shimmer style={styles.textShimmer} />
          <Shimmer style={styles.sectionShimmer} />
          <Shimmer style={styles.sectionShimmer} />
          <Shimmer style={styles.buttonShimmer} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const Shimmer = ({ style }: { style: StyleProp<ViewStyle> }) => (
  <ShimmerPlaceholder
    LinearGradient={LinearGradient}
    style={[styles.shimmer, style]}
  />
);

export default ProductDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFEFA",
  },
  content: {
    padding: 20,
    paddingBottom: 36,
  },
  back: {
    position: "absolute",
    left: 20,
    top: 28,
    zIndex: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.22,
    shadowRadius: 4,
  },
  hero: {
    width: "100%",
    height: 390,
    borderRadius: 28,
    overflow: "hidden",
    backgroundColor: "#F6F3ED",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    minHeight: 150,
    justifyContent: "flex-end",
    padding: 20,
  },
  heroTitle: {
    color: colors.white,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "900",
  },
  heroSubtitle: {
    color: "rgba(255,255,255,0.88)",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700",
    marginTop: 6,
  },
  body: {
    paddingTop: 20,
  },
  statsRow: {
    flexDirection: "row",
    marginHorizontal: -4,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    minHeight: 78,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E9ECE4",
    backgroundColor: colors.white,
    padding: 12,
    marginHorizontal: 4,
  },
  statLabel: {
    color: colors.grey70,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "800",
  },
  statValue: {
    color: colors.grey100,
    fontSize: 14,
    lineHeight: 19,
    fontWeight: "900",
    marginTop: 6,
  },
  summaryCard: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E9ECE4",
    backgroundColor: colors.white,
    padding: 16,
    marginBottom: 14,
  },
  healthCard: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DCEEDF",
    backgroundColor: "#F5FCF6",
    padding: 16,
    marginBottom: 14,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    color: colors.grey100,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "900",
    marginLeft: 8,
  },
  bodyText: {
    color: colors.grey70,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "600",
  },
  healthText: {
    color: colors.success,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "900",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 8,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: 8,
    marginRight: 10,
  },
  listText: {
    flex: 1,
    color: colors.grey70,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "600",
  },
  tagsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  tag: {
    borderRadius: 8,
    backgroundColor: colors.primary10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: colors.primary,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "800",
  },
  disclaimer: {
    color: colors.grey,
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 18,
  },
  shimmer: {
    borderRadius: 8,
  },
  statShimmer: {
    flex: 1,
    height: 78,
    marginHorizontal: 4,
  },
  titleShimmer: {
    width: "70%",
    height: 28,
    marginBottom: 14,
  },
  textShimmerWide: {
    width: "100%",
    height: 18,
    marginBottom: 10,
  },
  textShimmer: {
    width: "78%",
    height: 18,
    marginBottom: 18,
  },
  sectionShimmer: {
    width: "100%",
    height: 116,
    marginBottom: 14,
  },
  buttonShimmer: {
    width: "100%",
    height: 50,
  },
});

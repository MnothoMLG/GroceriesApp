import React from 'react';
import { StyleSheet } from 'react-native';
import { colors } from '@theme';
import { AppButton } from '../appButton';
import { EButtonVariants } from '@constants/types';
import { ArrowRightIcon } from '@assets/icons';
import { useNavigation } from '@react-navigation/native';

export const BackButton = () => {
  const navigation = useNavigation();

  return (
    <AppButton
      br={20}
      onPress={() => {
        navigation.canGoBack() && navigation.goBack();
      }}
      variant={EButtonVariants.SECONDARY}
      style={styles.back}
    >
      <ArrowRightIcon width={30} height={12} color={colors.black} />
    </AppButton>
  );
};

const styles = StyleSheet.create({
  back: {
    marginHorizontal: 24,
    width: 40,
    backgroundColor: colors.white,
    height: 40,
    transform: [{ rotate: '180deg' }],
  },
});

import React, { FC } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '@theme';
import { Center } from '@components/layout/layout';
import { Text } from '@components/text';
import { useTranslation } from '@hooks';

interface Props {
  loadingText?: string;
  size?: number | 'large' | 'small' | undefined;
  noLoadingText?: boolean;
}

export const Loader: FC<Props> = ({
  loadingText,
  size = 'large',
  noLoadingText,
}) => {
  const { t } = useTranslation();
  return (
    <Center style={styles.wrapper}>
      <ActivityIndicator color={colors.primary} size={size} />
      {!noLoadingText && (
        <Text mt={16} color={colors.grey70}>
          {loadingText ?? t('common.wait')}
        </Text>
      )}
    </Center>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    flex: 1,
  },
});

import React, { useState } from 'react';
import {
  Image as RnImage,
  ActivityIndicator,
  ImageProps,
  View,
  StyleSheet,
} from 'react-native';

export const Image = (props: ImageProps) => {
  const [loading, setLoading] = useState(false);

  return (
    <View style={props.style}>
      <RnImage
        {...props}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => {
          setLoading(false);
        }}
      />
      {loading ? <ActivityIndicator style={styles.indicatorStyle} /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  indicatorStyle: { position: 'absolute', top: '50%', alignSelf: 'center' },
});

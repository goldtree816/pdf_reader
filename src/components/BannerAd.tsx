import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  BannerAd as GoogleBannerAd,
  BannerAdSize,
  TestIds,
} from 'react-native-google-mobile-ads';

const PRODUCTION_BANNER_ID = 'ca-app-pub-6741963315615698/6978203749';

const BannerAd = () => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return null;
  }

  return (
    <View style={styles.container}>
      <GoogleBannerAd
        unitId={__DEV__ ? TestIds.ADAPTIVE_BANNER : PRODUCTION_BANNER_ID}
        size={BannerAdSize.LARGE_ANCHORED_ADAPTIVE_BANNER}
        onAdLoaded={() => {
          console.log('Home banner ad loaded.');
        }}
        onAdFailedToLoad={error => {
          setHasError(true);
          console.warn(
            `Home banner ad failed (code: ${error.code}, message: ${error.message})`,
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#17191B',
    paddingBottom: 8,
    paddingTop: 8,
    width: '100%',
  },
});

export default BannerAd;

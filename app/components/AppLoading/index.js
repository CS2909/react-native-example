import React, { useState, useEffect } from 'react';
import { Image, Text, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { Asset } from 'expo-asset';
import { AppLoading } from 'expo';

export default function Loading() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
  });

  const _cacheSplashResourcesAsync = async () => {
    const gif = [require('../../../assets/images/ami.gif'), require('../../../assets/images/ami.gif')];
    const gifRes =  gif.map(gif => {
      return Asset.fromModule(gif).downloadAsync();
    });
    setIsReady(true);
    await Promise.all(gifRes);
  };

  const _cacheResourcesAsync = async () => {
    SplashScreen.hideAsync();
    const images = [
      require('../../../assets/images/splash.png'),
    ];
    const cacheImages = images.map(image => {
      return Asset.fromModule(image).downloadAsync();
    });
    setIsReady(true);
    await Promise.all(cacheImages);
  };

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', }}>
        <Image
          source={require('../../../assets/images/ami.gif')}
          onLoad={() => _cacheResourcesAsync}
        />
      </View>
    );
  }
  return null;
}

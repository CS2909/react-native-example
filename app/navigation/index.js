import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { AsyncStorage, Platform, StatusBar, StyleSheet, View } from 'react-native';
import 'react-native-gesture-handler';
import useCachedResources from '../hooks/useCachedResources';
import BottomTabNavigator from '../navigation/BottomTabNavigator';
import LinkingConfiguration from '../navigation/LinkingConfiguration';
import LoginScreen from '../screens/LoginScreen';
import { updateAuth } from '../share/actions/common';
import { useDispatch, useSelector } from 'react-redux';

const Stack = createStackNavigator();

export default function Navigation() {
  const dispatch = useDispatch();
  const dataReducer = useSelector((state) => state.commonReducer);
  const isLoadingComplete = useCachedResources();
  const { isAuth } = dataReducer;
  const StorageKey = '@MyApp:CustomGoogleOAuthKey';

  React.useEffect(() => {
    appLoading();
  });

  const appLoading = () => {
    setTimeout(
      (async () => {
        let cachedAuth = await getCachedAuthAsync();
        if (isAuth !== cachedAuth) {
          dispatch(updateAuth(cachedAuth));
        }
      }), 3000);
  };

  const getCachedAuthAsync = async () => {
    let value = await AsyncStorage.getItem(StorageKey);
    let authState = JSON.parse(value);
    return !!authState && checkIfTokenExpired(authState);
  };

  const checkIfTokenExpired = ({ accessTokenExpirationDate }) => {
    return new Date(accessTokenExpirationDate) < new Date();
  };

  return (
    <View style={styles.container}>
      {Platform.OS === 'ios' && <StatusBar barStyle="dark-content"/>}
      <NavigationContainer linking={LinkingConfiguration}>
        <Stack.Navigator>
          {
            isAuth ? <Stack.Screen name="Root" component={BottomTabNavigator}/> :
            <Stack.Screen name="Login" component={LoginScreen}/>
          }
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(244,244,244)',
    justifyContent: 'center'
  },
});

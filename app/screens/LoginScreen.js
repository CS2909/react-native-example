import React, { useEffect, useState } from 'react';
import { AsyncStorage, Button, StyleSheet, Text, View, ScrollView } from 'react-native';
import * as AppAuth from 'expo-app-auth';

export default function Login() {
  let [authState, setAuthState] = useState(null);

  useEffect(() => {
    (async () => {
      let cachedAuth = await getCachedAuthAsync();
      if (cachedAuth && !authState) {
        setAuthState(cachedAuth);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerText}>
        <Text>Login with Google</Text>
      </View>
      <Button
        title="Sign In with Google "
        onPress={async () => {
          const _authState = await signInAsync();
          setAuthState(_authState);
        }}
      />
      <Button
        title="Sign Out "
        onPress={async () => {
          await signOutAsync(authState);
          setAuthState(null);
        }}
      />
      <ScrollView>
        <Text>
          {JSON.stringify(authState, null, 2)}
        </Text>
        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    marginBottom: 15,
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  }
});

let config = {
  issuer: 'https://accounts.google.com',
  scopes: ['profile', 'email'],
  clientId: '603386649315-vp4revvrcgrcjme51ebuhbkbspl048l9.apps.googleusercontent.com',

  // clientId: '205995943899-5okt50lnv2eh5nhb5knuqk1mrcvbp4vo.apps.googleusercontent.com',
  // clientId: '205995943899-huar85phopugmmmthpnt59b5g3lbr2gk.apps.googleusercontent.com',
};

let options = {
  isClientIdProvided: true,
};

let StorageKey = '@MyApp:CustomGoogleOAuthKey';

export async function signInAsync() {
  let authState = await AppAuth.authAsync(config, options);
  await cacheAuthAsync(authState);
  return authState;
}

async function cacheAuthAsync(authState) {
  return await AsyncStorage.setItem(StorageKey, JSON.stringify(authState));
}

export async function getCachedAuthAsync() {
  let value = await AsyncStorage.getItem(StorageKey);
  let authState = JSON.parse(value);
  if (authState) {
    if (checkIfTokenExpired(authState)) {
      return refreshAuthAsync(authState);
    } else {
      return authState;
    }
  }
  return null;
}

function checkIfTokenExpired({ accessTokenExpirationDate }) {
  return new Date(accessTokenExpirationDate) < new Date();
}

async function refreshAuthAsync({ refreshToken }) {
  let authState = await AppAuth.refreshAsync(config, refreshToken);
  console.log('refreshAuth', authState);
  await cacheAuthAsync(authState);
  return authState;
}

export async function signOutAsync({ accessToken }) {
  try {
    await AppAuth.revokeAsync(config, {
      token: accessToken,
      isClientIdProvided: true,
    });
    await AsyncStorage.removeItem(StorageKey);
    return null;
  } catch (e) {
    alert(`Failed to revoke token: ${e.message}`);
  }
}

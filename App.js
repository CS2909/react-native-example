import * as React from 'react';
import { Provider } from 'react-redux';
import 'react-native-gesture-handler';
import store from './app/share/store';
import Navigation from './app/navigation';

export default function App() {

  return (
    <Provider store={store}>
      <Navigation/>
    </Provider>
  );
}

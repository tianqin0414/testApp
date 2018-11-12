/** @format */

import { AppRegistry, } from 'react-native';
// import App from './App';
import App from './app/FoodView';
// import App from './app/flexTest';
// import App from './app/ScrewViewTest';
// import App from './app/mapTest';
import { name as appName, } from './app.json';

AppRegistry.registerComponent(appName, () => App);

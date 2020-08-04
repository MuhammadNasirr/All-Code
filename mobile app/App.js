import React, { Component } from 'react';
import SplashScreen from 'react-native-splash-screen';
import Routes from './src/navigation/AppNavigator'
import {  AsyncStorage } from 'react-native';
import { Provider } from 'react-redux';
import Store from './src/store/store'
import stripe from 'tipsi-stripe';

stripe.setOptions({
	// publishableKey: 'sk_live_fY32vIKPPvKo850ULgJOJDrN00HvpmFIiG'
	publishableKey: 'pk_live_OseSpcRCy79LpPz9mVvR2K3F00OZbLFiBh' 	//old
	// publishableKey: 'pk_test_eO3HrYXTupxPBUbaX6MDO2kt00eZUG5uDm'		//old
  });
  
export default class App extends Component {

	componentDidMount() {
		SplashScreen.hide();
	}
	render() {
		return (
			<Provider store={Store}>
				<Routes />
			</Provider>
		);
	}
}

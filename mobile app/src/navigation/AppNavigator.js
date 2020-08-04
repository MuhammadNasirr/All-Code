import { createStackNavigator, createAppContainer,createSwitchNavigator, createDrawerNavigator } from 'react-navigation';
import Login from '../View/LoginView/login';
import SignUp from '../View/SignUpView/signUp';
import PassRecovery from '../View/PassRecovery/PassRecovery';
import Home from '../View/Home/Home';
import Profile from '../View/Profile/profile';
import AffiliateProfile from '../View/Profile/affiliateProfile';
import Settings from '../View/Setting/Setting';
import payment from '../View/PaymentScreen/Payment';
import OnBoarding from '../View/OnBoarding/OnBoarding';
import HomeInner from '../View/HomeInner/HomeInner';
import AffiliationCode from '../View/AffiliationCode/AffiliationCode';
import { Dimensions } from 'react-native';

import NavigationMenu from '../View/NavigationMenu/NavigationMenu';
import NonAuthDrawer from '../View/NavigationMenu/NonAuthMenu';
import ChangePassword from '../View/ChangePassword/ChangePassword';
import NonAuthPayment from '../View/PaymentScreen/NonAuthPayment';
import Notifications from '../View/Notifications/Notifications';
import ChangeLocation from '../View/ChangeLocation/ChangeLocation';

const AuthStack = createStackNavigator(
	{
		LoginScreen: { screen: Login },
		NonAuthHome: { screen: Home },
		SignUpScreen: { screen: SignUp },
		PassRecoverycreen: { screen: PassRecovery },
		NonAuthPayment: { screen: NonAuthPayment }
	},
	{
		initialRouteName: 'NonAuthHome'
	}
);
const onBoardingStack = createStackNavigator(
	{
		OnBoarding: {
			screen: OnBoarding,
		},
	},
	{
		initialRouteName: 'OnBoarding'
	}
);

const NonAuthDrawers = createDrawerNavigator(
	{
		Item1: {
			screen: AuthStack
		}
	},
	{
		drawerPosition: 'left',
		contentComponent: NonAuthDrawer,
		drawerWidth: Dimensions.get('window').width - 100
	}
);

const MainStack = createStackNavigator(
	{
		HomeInner: HomeInner,
		Settings: Settings,
		Profile: Profile,
		AffiliateProfile: AffiliateProfile,
		payment: payment,
		chnagePassword: ChangePassword,
		Notifications: Notifications,
		ChangeLocation: ChangeLocation,
		AffiliationCode: AffiliationCode
	},
	{
		initialRouteName: 'HomeInner'
	}
);

const Drawernav = createDrawerNavigator(
	{
		Item1: {
			screen: MainStack
		}
	},
	{
		drawerPosition: 'left',
		contentComponent: NavigationMenu,
		drawerWidth: Dimensions.get('window').width - 100
	}
);

const AppNavigator = createSwitchNavigator(
	{
		Main: Drawernav,
		onBoardingScreen: onBoardingStack,
		Auth: NonAuthDrawers,
	},
	{
		initialRouteName: 'onBoardingScreen',
		headerMode: 'none'
	}
);

const Routes = createAppContainer(AppNavigator);

export default Routes;

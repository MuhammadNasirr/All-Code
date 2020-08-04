import React, { Component } from 'react';
import { StyleSheet, View, Dimensions, Text, Image, AsyncStorage, ScrollView } from 'react-native';
import { Button, Input, Icon } from 'react-native-elements';
import SvgUri from 'react-native-svg-uri';
import AppIntroSlider from 'react-native-app-intro-slider';
import LottieView from 'lottie-react-native';
import { OnBoarding2, OnBoarding1, OnBoardingOne } from '../../Components/svg'
const slides = [
	{
		key: 'somethun',
		title: 'Welcome to Gimonii',
		text:
			'Gimonii is an app that offers gifts, makes you money and donates to many associations and people need help all over the world',
		image: OnBoardingOne,
		Lottieimage: require('../../1973-giftbox.json'),
		// backgroundColor: '#59b2ab',
	},
	{
		key: 'somethun-dos',
		title: 'Become Gimonii member',
		text:
		'Register, get your personal code and communicate it around you. Each person using your code to\nregister, give you back 1€ as well as 1€ has a fund of help that redistributes to associations.',
		Lottieimage: require('../../star.json'),
		image: OnBoarding1,
		// backgroundColor: '#febe29',
	},
	{
		key: 'somethun1',
		title: 'Get the lucky Gift',
		text:
			'With Gimonii, you can easily help others, have chance to get lucky present everyday and make money. Thanks to you!',
		image: OnBoarding2,
		Lottieimage: require('../../4191-present-for-you.json'),
		// backgroundColor: '#22bcb5',
	}
];

class OnBoarding extends Component {
	static navigationOptions = {
		header: null,
		gesturesEnabled: false,
		drawerLockMode: 'locked-closed'
	};
	constructor(props) {
		super(props);
		this.state = {
			enable: false
		}
		AsyncStorage.getItem('onboardingdone').then((onboardingdone) => {
			console.log(onboardingdone, "async")
			if (onboardingdone == null) {

				this.setState({ enable: true })

			} else this.props.navigation.navigate('Auth');
		})
	}
	componentWillMount() {


	}

	_renderItem = (item) => {
		return (
			<View style={styles.container}>
				<View style={{ width: '100%', height: '100%',borderWidth:0, alignItems: 'center',marginTop: Dimensions.get('window').width < Dimensions.get('window').height ? '25%' : 0,backgroundColor: '#FAFAFA', }}>
					{
						item.Lottieimage ?<View style={{width:'100%',alignItems:'center',borderWidth:0}}><LottieView style={{ height: 300,width:300 ,marginTop:-20}} source={item.Lottieimage} autoPlay loop /></View>:
							<SvgUri width="100%" height="100%" style={[styles.image, { marginTop: Dimensions.get('window').width < Dimensions.get('window').height ? 20 : 0 }]} svgXmlData={item.image} />

					}
					<View style={[styles.viewContainer, { marginTop: Dimensions.get('window').width < Dimensions.get('window').height ? 20 : 0, }]}>
						<Text style={styles.welcometext}>{item.title}</Text>
						<Text style={styles.subText}>{item.text}</Text>
					</View>
				</View>
			</View>
		);
	};
	componentDidMount() {
		// AsyncStorage.getItem('onboardingdone').then((onboardingdone)=>{
		// console.log(onboardingdone,"componentDidMount onboarding")
		// 	if (onboardingdone != null) {
		// 		this.props.navigation.navigate('Auth');
		// 	}
		// })
		AsyncStorage.getItem('userData').then((user) => {
			if (user != null) {
				this.props.navigation.navigate('Main');
			}
		});
	}

	_onDone = () => {
		console.log("OnDone")
		let onboardingdone = 'done'
		AsyncStorage.setItem('onboardingdone', onboardingdone);
		this.props.navigation.navigate('Auth');
	};
	_onSkip = () => {
		console.log("_onSkip")
		let onboardingdone = 'done'
		AsyncStorage.setItem('onboardingdone', onboardingdone);
		this.props.navigation.navigate('Auth');
	};
	render() {
		return (
			<View style={{ width: '100%', height: '100%', flex: 1 }}>
				{
					this.state.enable &&
					<AppIntroSlider
						skipLabel="Skip"
						doneLabel="Start"
						nextLabel="Next"
						prevLabel="Back"
						showSkipButton
						showPrevButton
						skipLabelStyle={{ color: '#fff' }}
						buttonTextStyle={{ color: '#F88735', fontFamily: 'SFProDisplay-Regular', fontSize: 14 }}
						activeDotStyle={{ backgroundColor: '#F88735' }}
						renderItem={this._renderItem}
						slides={slides}
						onDone={this._onDone}
						onSkip={this._onSkip}
					/>
				}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#FAFAFA',
		borderWidth: 0,
		borderColor: '#000',
		justifyContent: 'center',
		flex: 1,
		alignItems: 'center',
		height: '100%',
		// minHeight:700
	},
	viewContainer: {
		// height: '40%',
		width: '95%',
		// marginTop:'20%',
		alignItems:'center',
		justifyContent: 'flex-end',
		alignItems: 'center',
	},
	dot1: {
		position: 'absolute',
		left: '44.8%',
		right: '53.07%',
		top: '81.56%',
		bottom: '17.24%',
		backgroundColor: '#F88735',
		borderRadius: 50
	},
	dot2: {
		position: 'absolute',
		left: '48.8%',
		right: '48.53%',
		top: '81.41%',
		borderRadius: 50,
		bottom: '17.09%',
		borderColor: '#9BA4A6',
		borderWidth: 1
	},
	dot3: {
		position: 'absolute',
		left: '53.07%',
		right: '44.27%',
		top: '81.41%',
		borderRadius: 50,
		bottom: '17.09%',
		borderColor: '#9BA4A6',
		borderWidth: 1
	},
	image: {
		position: 'relative',
		// left:10,
		width: '100%',
		height: 230,
		// left: 12,
		// top: 50
	},
	welcometext: {
		// position: 'absolute',
		// height: 26,
		// left: ' 22.93%',
		textAlign: 'center',
		// right: '22.93%',
		// top: '52%',

		fontFamily: 'SFProDisplay-Regular',
		fontSize: 22,
		// lineHeight: 26,
		height: 40,
		letterSpacing: 0.5,
		color: '#F88735'
	},
	subText: {
		// position: 'absolute',
		width: '90%',
		// bottom: '24.89%',
		fontFamily: 'SFProDisplay-Regular',
		fontSize: 14,
		// lineHeight: 24,
		textAlign: 'center',
		letterSpacing: 0.5,
		color: '#656970'
	},
	nextbtn: {
		position: 'absolute',
		height: 16,
		left: '86.93%',
		right: '4%',
		top: '92%',
		fontFamily: 'SF Pro Display',
		fontSize: 14,
		lineHeight: 16,
		textAlign: 'right',
		color: '#F88735'
	},
	skipbtn: {
		position: 'absolute',
		height: 16,
		left: '4.0%',
		right: '80%',
		top: '92%',
		// fontFamily: 'SF Pro Display',
		fontSize: 14,
		lineHeight: 16,
		color: 'rgba(0, 0, 0, 0.698399)'
	}
});

export default OnBoarding;

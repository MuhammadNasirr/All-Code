import React, { Component } from 'react';
import {
	StyleSheet,
	Share,
	View,
	Text,
	Image,
	Linking,
	TouchableOpacity,
	ActivityIndicator,
	AsyncStorage,
	Platform,
	SafeAreaView,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { Icon, Input, SocialIcon } from 'react-native-elements';
import { fetchGifts, getUser } from '../../actions';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import iphone from '../../assets/images/item1.png';
import path from '../../assets/images/Path-6-Copy.png';
import CountDown from 'react-native-countdown-component';
import SvgUri from 'react-native-svg-uri';
import Modal from 'react-native-modal';
import { fireBase } from '../../firebase/firebase';
import { TwitterIcon, InstaIcon, FBIcon, DrawerIcon } from '../../Components/svg'
import star from '../../assets/images/star.png';
import { sendGridEmail } from 'react-native-sendgrid';
import InstaImage from '../../assets/images/insta-icon.png'
import { Header } from '../../Components';
import English from "../../en";
import { withNavigationFocus } from 'react-navigation';
import moment from "moment"
import French from "../../fr"
const SENDGRIDAPIKEY = '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';
const FROMEMAIL = 'giomini@gmail.com';
const TOMEMAIL = 'ishaqashraf90@gmail.com';
const SUBJECT = 'You have a new message';
if (Platform.OS === 'ios') {
	var font1 = 'RobotoCondensed-Regular';
} else {
	var font1 = 'RobotoCondensed-Regular';
}
var firstDigit = '';
var secondDigit = '';
var firstDigitM = '';
var secondDigitM = '';
var firstDigitH = '';
var secondDigitH = '';
class HomeInner extends Component {
	static navigationOptions = {
		header: null
	};

	constructor(props) {
		super(props);
		this.state = {
			participate: true,
			affiliationModal: false,
			affiliationCode: '',
			myAffiliation: '',
			time: {},
			seconds: 1000,
			todayGift: '',
			todayGiftLoading: false,
			totalMembers: 0,
			funds: 0,
			modal2: false,
			frenchLanguage: false,
			asyncLanguage: null,
			winner: false,

		};
		this.updateCode = this.updateCode.bind(this);
		this.timer = 0;
		this.startTimer = this.startTimer.bind(this);
		this.countDown = this.countDown.bind(this);

	}

	snapshotToArray = snapshot => Object.entries(snapshot).map(e => Object.assign(e[1], { uid: e[0] }));

	getSelectedGift = () => {
		this.setState({ todayGiftLoading: true });
		console.warn('will')
		const db = fireBase.database();
		db.ref("TodayGift").on("value", snapshot => {
			if (snapshot.val()) {
				let todayGift = this.snapshotToArray(snapshot.val())
				console.warn(((todayGift[0].selectedAt + (60 * 60 * 24 * 1000)) - Date.now()) / 1000, "timerrr")
				this.setState({
					todayGift: todayGift[0],
					seconds: ((todayGift[0].selectedAt + (60 * 60 * 24 * 1000)) - Date.now()) / 1000,
					todayGiftLoading: false,
				});
			}
			else {
				this.setState({
					todayGift: '',
					todayGiftLoading: false,
				});
			}
		})
	}
	secondsToTime(secs) {
		let hours = Math.floor(secs / (60 * 60));

		let divisor_for_minutes = secs % (60 * 60);
		let minutes = Math.floor(divisor_for_minutes / 60);

		let divisor_for_seconds = divisor_for_minutes % 60;
		let seconds = Math.ceil(divisor_for_seconds);

		let obj = {
			h: hours,
			m: minutes,
			s: seconds
		};

		return obj;
	}
	share = async (item) => {
		try {
			const result = await Share.share({
				title: item.name,
				message: item.description
			});

			if (result.action === Share.sharedAction) {
				if (result.activityType) {
					// shared with activity type of result.activityType
				} else {
					// shared
				}
			} else if (result.action === Share.dismissedAction) {
				// dismissed
			}
		} catch (error) {
			alert(error.message);
		}
	};
	componentWillReceiveProps(newProps) {

		AsyncStorage.getItem('language').then(a => {
			this.setState({ asyncLanguage: a })
			// console.warn(a, "recieve async props Home Inner")
		})
		if (newProps.language) {
			this.setState({ asyncLanguage: newProps.language })
			this.getFunds()
		}
		console.log(newProps.user, "currentUser")
		if (newProps.user != null) {
			AsyncStorage.getItem("userData").then(uid => {
				this.setState({ id: uid });
			})
			if (newProps.user.affiliationCode === '' && this.state.affiliationModal == false) {
				// console.warn("recieve Home Inner")
				this.setState({ affiliationModal: !this.state.affiliationModal, id: newProps.user.id });
			}
		}
		if (newProps.navigation.state.params) {
			if (newProps.navigation.state.params.payment == true) {
				this.setState({ modal2: !this.state.modal2 })
			}
		}
	}
	onSubmit = () => {
		const ContactDetails = 'Contact Data: Muhammad Ishaq  Mail: ishaqashraf90@gmail.com  ';
		const sendRequest = sendGridEmail(SENDGRIDAPIKEY, TOMEMAIL, FROMEMAIL, SUBJECT, ContactDetails);
		sendRequest
			.then((response) => {
				alert('Congratulation You win a Gift Email has been send');
				// console.warn('Success', response);
			})
			.catch((error) => {
				// console.log(error);
			});
	};
	updateCode = () => {
		const me = this;
		const { id, affiliationCode } = this.state;
		debugger
		AsyncStorage.getItem("user")
		if (affiliationCode !== '') {
			var leadsRef = fireBase.database().ref('Users');
			leadsRef.once('value', function (snapshot) {
				var arr = me.snapshotToArray(snapshot.val())
				const found = arr.some((el) => el.myAffiliation == affiliationCode && el.uid != id);
				const myAffiliationUser = arr.filter((el) => el.myAffiliation == affiliationCode)
				const currentUser = arr.filter((el) => el.uid == id)
				const currentUserObj = currentUser[0]
				const myAffiliationUserObj = myAffiliationUser[0]
				if (!found) {
					alert('wrong affiliation code');
				} else {

					fireBase.database().ref('/Users/' + id).update({
						affiliationCode,
					}).then(res => {
						fireBase.database().ref('Notifications/')
							.push({ "type": "useAffiliation", "user": currentUserObj, "id": myAffiliationUserObj.uid, "createdAt": Date.now() })


						// console.log("referal uid user", myAffiliationUserObj.uid)
						fireBase.database().ref('/Users/' + myAffiliationUserObj.uid).update({
							points: myAffiliationUserObj.points + 1,
						});
						me.hideModal();
						me.getCode();
						me.props.getUser();
					});
				}
			});
		} else {
			alert('you must enter code');
		}
	};
	getTotalMembers = () => {
		var me = this;
		var leadsRef = fireBase.database().ref(`Users`);
		leadsRef.once('value', function (snapshot) {
			var arr = Object.values(snapshot.val());
			// console.warn(arr.length, "arr")
			me.setState({ totalMembers: arr.length - 1 })
		});
	}
	getFunds = () => {
		var me = this;
		var leadsRef = fireBase.database().ref(`Funds`);
		leadsRef.once('value', function (snapshot) {
			var arr = Object.values(snapshot.val());
			me.state.asyncLanguage == 'fr' ? arr[0] = arr[0] * 0.9 : arr[0] = arr[0]
			// console.warn(arr, "Funds")
			me.setState({ funds: arr[0] })
		});
	}
	getCode = () => {
		const me = this;
		let currentID = '';
		const { id, affiliationCode } = this.state;
		AsyncStorage.getItem('userData').then((user) => {
			if (user != null) {
				// console.log(user)
				currentID = user

			}
		});
		if (affiliationCode == '') {
			var leadsRef = fireBase.database().ref(`Users`);
			leadsRef.once('value', function (snapshot) {
				var arr = Object.values(snapshot.val());
				// console.warn(arr.length, "arr")
				arr.map((el) => {
					if (el.id == currentID) {
						me.setState({ affiliationCode: el.affiliationCode, myAffiliation: el.myAffiliation })
						// console.log(el.affiliationCode, "current user")
					} else console.log("no record")
				});

			});
		} else {
			alert('you must enter code');
		}
	};

	hideModal = () => {
		this.setState({ affiliationModal: !this.state.affiliationModal, affiliationCode: '' });
	};
	// componentWillUpdate(){
	// 	console.warn('will update')
	// }
	componentDidMount() {
		this.props.fetchGifts();
		let timeLeftVar = this.secondsToTime(this.state.seconds);
		this.setState({ time: timeLeftVar });
		this.startTimer();
		this.getCode();
		this.getSelectedGift();
		this.getTotalMembers();
		this.getFunds();
		this.props.getUser()
		
		this.props.navigation.addListener('willFocus', () => {
			console.warn("willl")
			this.getSelectedGift();
		})
		// console.warn("Mount Home Inner")
		// this.setState({ seconds: this.state.todayGift.selectedAt + 60 * 60 * 24 * 1000 })
		// console.log(this.state.todayGift.selectedAt + 60 * 60 * 24 * 1000,"timer ")
	}
	startTimer() {
		if (this.timer == 0 && this.state.seconds > 0) {
			this.timer = setInterval(this.countDown, 1000);
		}
	}
	componentDidUpdate() {
		var num = this.state.time.s;
		firstDigit = num.toString().split('')[0];
		secondDigit = num.toString().split('')[1];
		var numM = this.state.time.m;
		firstDigitM = numM.toString().split('')[0];
		secondDigitM = numM.toString().split('')[1];
		var numH = this.state.time.h;
		firstDigitH = numH.toString().split('')[0];
		secondDigitH = numH.toString().split('')[1];
		// if(this.props.navigation.state.params){

		// }
		// AsyncStorage.getItem('language').then(a => {
		// 	this.setState({ asyncLanguage: a })
		// 	console.warn(a, "update async props")
		// })
		// firstDigit === '0' ?this.onSubmit():null
	}
	countDown() {
		// Remove one second, set state so a re-render happens.
		let seconds = this.state.seconds - 1;
		this.setState({
			time: this.secondsToTime(seconds),
			seconds: seconds
		});

		// Check if we're at zero.
		if (seconds == 0) {
			clearInterval(this.timer);
		}
	}
	_renderItem = ({ item }) => (
		<View style={styles.productBox}>
			<Image source={path} style={styles.path} />
			<Image source={iphone} style={styles.productImg} />
			<View style={styles.productTxtBox}>
				<Text style={styles.productPrice}>{item.price}</Text>
				<Text style={styles.productName}>{item.name}</Text>
				<Text style={styles.productDes}>{item.description}</Text>
			</View>
		</View>
	);

	render() {
		// console.log(this.state.seconds, "second")
		const { todayGift, totalMembers, funds, frenchLanguage, asyncLanguage } = this.state;

		const item = { name: 'gift1', description: asyncLanguage == 'fr' ? `J’adore Gimonii, utilise mon code personnel ${this.state.myAffiliation} pour créer ton compte et participer. Amuse-toi! https://play.google.com/store/apps/details?id=com.gimonii` : `I love Gimonii. Use my affiliation code ${this.state.myAffiliation} to create an account and participate. Enjoy!  https://play.google.com/store/apps/details?id=com.gimonii` };
		// const params = this.props.navigation.state.params;
		// if (this.props.loading)
		// 	return (
		// 		<View style={styles.loader}>
		// 			<ActivityIndicator size="large" color="#FF984C" />
		// 		</View>
		// 	);

		return (
			<View
				style={{
					backgroundColor: '#fff',
					justifyContent: 'flex-start',
					alignItems: 'center',
					width: '100%',
					height: '100%'
				}}
			>
				<Header
					rightImg={DrawerIcon}
					homeLogo={true}
					navigation={this.props.navigation}
					drawerIcon={true}
					rightIcon={true}
				/>
				{this.props.loading && this.state.todayGiftLoading ?

					<View style={styles.loader}>
						<ActivityIndicator size="large" color="#F56464" />
					</View>
					:
					<SafeAreaView style={{ backgroundColor: '#fff', width: '100%', height: '100%' }}>

						<View style={styles.container}>
							<LinearGradient
								colors={['#F28B19', '#EA3838']}
								start={{ x: 0, y: 1 }}
								end={{ x: 2, y: 2 }}
								locations={[0, 0.5]}
								style={styles.linearGradient}
							>
								<View style={styles.winSec}>
									<View style={{ paddingLeft: '7%', width: '50%' }}>
										<Text style={[styles.winText, { fontSize: 16, fontWeight: '100' }]}>{asyncLanguage == "fr" ? French.MEMBERS : English.MEMBERS}</Text>
										<Text style={[styles.winText, { fontSize: 30, fontWeight: 'bold' }]}>2458</Text>
									</View>
									<View style={styles.verticalBorder} />
									<View style={{ paddingRight: '7%', width: '50%' }}>
										<Text style={[styles.winText, { fontSize: 16, fontWeight: '100' }]}>
											{asyncLanguage == 'fr' ? French.AIDS_FUNDS : English.AIDS_FUNDS}
										</Text>
										<Text style={[styles.winText, { fontSize: 30, fontWeight: 'bold' }]}>{asyncLanguage == "fr" ? "€" : "$"} {funds}</Text>
									</View>
								</View>
							</LinearGradient>


							<View
								style={[
									styles.textFieldContainer,
									{ marginTop: 20, width: '100%', alignItems: 'center' }
								]}
							>
								<LinearGradient
									colors={['#EE6228', '#EA3838']}
									start={{ x: 0, y: 1.1 }}
									end={{ x: 3, y: 1 }}
									locations={[0, 0.5]}
									style={styles.linearGradientRound}
								>
									<Text style={{ fontSize: 24, color: '#fff', fontFamily: 'Roboto', fontWeight: 'bold' }}>
										{asyncLanguage == "fr" ? "€" : "$"}{asyncLanguage == "fr" ? todayGift.price * 0.9 : todayGift.price}
									</Text>
								</LinearGradient>
								<View style={{ width: '80%', height: '45%', padding: 0, margin: 0, marginTop: -30, justifyContent: 'center', alignItems: 'center' }}>
									<Image source={{ uri: todayGift.imgUrl }} style={styles.productImg} />
								</View>
								<Text
									style={{
										textAlign: 'center',
										fontSize: 14,
										margin: 10,
										color: '#000',
										fontFamily: 'SFProDisplay-Bold'
									}}
								>
									{todayGift.title}
								</Text>
								<Text
									style={{
										textAlign: 'center',
										color: '#16021A',
										width: '70%',
										marginBottom: 20,
										fontFamily: 'SFProDisplay-Regular'
									}}
								>
									{todayGift.description}
								</Text>
							</View>

						</View>
						<View
							style={{
								// position: 'relative',
								alignItems: 'center',
								justifyContent: 'center',
								flexDirection: 'row',
								bottom: Platform.OS == 'ios' ? 80 : 50
							}}
						>
							<Text style={styles.nextwin}>{asyncLanguage == 'fr' ? French.NEXT_WIN : English.NEXT_WIN}</Text>
							<View style={{ flexDirection: 'row' }}>
								<View style={{ alignItems: 'center', marginRight: 10 }}>
									<View style={{ flexDirection: 'row' }}>
										<LinearGradient
											colors={['#EE6128', '#ED592B']}
											start={{ x: 0, y: 1.1 }}
											end={{ x: 3, y: 1 }}
											locations={[0, 0.5]}
											style={{
												width: 30,
												borderRadius: 2,
												marginRight: 2,
												height: 60,
												backgroundColor: '#ED592B',
												alignItems: 'center',
												justifyContent: 'center'
											}}
										>
											<Text
												style={{ color: '#fff', textAlign: 'center', fontSize: 37, fontFamily: font1 }}
											>
												{secondDigitH ? firstDigitH : 0}
												{/* 0 */}
											</Text>
										</LinearGradient>
										<LinearGradient
											colors={['#ED5C2A', '#EC532D']}
											start={{ x: 0, y: 1.1 }}
											end={{ x: 3, y: 1 }}
											locations={[0, 0.5]}
											style={{
												width: 30,
												borderRadius: 2,
												marginRight: 2,
												height: 60,
												backgroundColor: '#ED592B',
												alignItems: 'center',
												justifyContent: 'center'
											}}
										>
											<Text
												style={{ color: '#fff', textAlign: 'center', fontSize: 37, fontFamily: font1 }}
											>
												{secondDigitH ? secondDigitH : firstDigitH}
												{/* 0 */}
											</Text>
										</LinearGradient>
									</View>
									<Text
										style={{
											color: '#16021A',
											fontFamily: font1,
											fontWeight: 'normal',
											marginTop: 2,
											fontSize: 10
										}}
									>
										{asyncLanguage == 'fr' ? French.HOURS : English.HOURS}
									</Text>
								</View>
								<View style={{ alignItems: 'center', marginRight: 10 }}>
									<View style={{ flexDirection: 'row' }}>
										<LinearGradient
											colors={['#EC542D', '#EC4B30']}
											start={{ x: 0, y: 1.1 }}
											end={{ x: 3, y: 1 }}
											locations={[0, 0.5]}
											style={{
												width: 30,
												borderRadius: 2,
												marginRight: 2,
												height: 60,
												backgroundColor: '#ED592B',
												alignItems: 'center',
												justifyContent: 'center'
											}}
										>
											<Text
												style={{ color: '#fff', textAlign: 'center', fontSize: 37, fontFamily: font1 }}
											>
												{secondDigitM ? firstDigitM : "0"}
												{/* 0 */}
											</Text>
										</LinearGradient>
										<LinearGradient
											colors={['#EC4F2F', '#EB4632']}
											start={{ x: 0, y: 1.1 }}
											end={{ x: 3, y: 1 }}
											locations={[0, 0.5]}
											style={{
												width: 30,
												borderRadius: 2,
												marginRight: 2,
												height: 60,
												backgroundColor: '#ED592B',
												alignItems: 'center',
												justifyContent: 'center'
											}}
										>
											<Text
												style={{ color: '#fff', textAlign: 'center', fontSize: 37, fontFamily: font1 }}
											>
												{secondDigitM ? secondDigitM : firstDigitM}
												{/* 0 */}
											</Text>
										</LinearGradient>
									</View>
									<Text
										style={{
											color: '#16021A',
											fontFamily: font1,
											fontWeight: 'normal',
											marginTop: 2,
											fontSize: 10
										}}
									>
										{asyncLanguage == 'fr' ? French.MINUTES : English.MINUTES}
									</Text>
								</View>
								<View style={{ alignItems: 'center', marginRight: 10 }}>
									<View style={{ flexDirection: 'row' }}>
										<LinearGradient
											colors={['#EB4632', '#EA3E35']}
											start={{ x: 0, y: 1.1 }}
											end={{ x: 3, y: 1 }}
											locations={[0, 0.5]}
											style={{
												width: 30,
												borderRadius: 2,
												marginRight: 2,
												height: 60,
												backgroundColor: '#ED592B',
												alignItems: 'center',
												justifyContent: 'center'
											}}
										>
											<Text
												style={{ color: '#fff', textAlign: 'center', fontSize: 37, fontFamily: font1 }}
											>
												{secondDigit ? firstDigit : "0"}
												{/* 0 */}
											</Text>
										</LinearGradient>
										<LinearGradient
											colors={['#EB4134', '#EA3837']}
											start={{ x: 0, y: 1.1 }}
											end={{ x: 3, y: 1 }}
											locations={[0, 0.5]}
											style={{
												width: 30,
												borderRadius: 2,
												marginRight: 2,
												height: 60,
												backgroundColor: '#ED592B',
												alignItems: 'center',
												justifyContent: 'center'
											}}
										>
											<Text
												style={{ color: '#fff', textAlign: 'center', fontSize: 37, fontFamily: font1 }}
											>
												{secondDigit ? secondDigit : firstDigit}
												{/* 0 */}
											</Text>
										</LinearGradient>
									</View>
									<Text
										style={{
											color: '#16021A',
											fontFamily: font1,
											fontWeight: 'normal',
											marginTop: 2,
											fontSize: 10
										}}
									>
										{asyncLanguage == 'fr' ? French.SECONDS : English.SECONDS}
									</Text>
								</View>
							</View>
						</View>
						<View style={{ flexDirection: 'row', justifyContent: 'flex-end', bottom: Platform.OS == 'ios' ? 80 : 50, right: 20 }}>
							<TouchableOpacity style={{ margin: 7 }} onPress={() => Linking.openURL('https://www.instagram.com/gimoniiofficiel/')}>
								<Image style={{ width: 40, height: 40 }} source={InstaImage} />
							</TouchableOpacity>
							<TouchableOpacity style={{ marginTop: 7 }} onPress={() => Linking.openURL('https://www.facebook.com/Gimonii-Officiel-1074996835972072/')}>
								<SvgUri width="40" height="40" svgXmlData={FBIcon} />
							</TouchableOpacity>
							<TouchableOpacity style={{ marginLeft: 12, marginTop: 7 }} onPress={() => Linking.openURL('https://twitter.com/gimoniiofficiel')}>
								<SvgUri width="40" height="40" svgXmlData={TwitterIcon} />
							</TouchableOpacity>
						</View>
					</SafeAreaView>}
				<Modal
					backdropColor={'black'}
					backdropOpacity={0.1}
					animationIn="zoomInDown"
					avoidKeyboard={true}
					style={{
						// height:'100%',backgroundColor:'rgba(0,0,0,0.2)'
					}}
					animationOut="zoomOutUp"
					animationInTiming={1000}
					// onBackButtonPress={this.setState({isModalVisible:false})}
					animationOutTiming={1000}
					backdropTransitionInTiming={1000}
					backdropTransitionOutTiming={1000}
					isVisible={this.state.affiliationModal}
				>
					<View
						style={{
							backgroundColor: '#fff',
							height: 280,
							alignItems: 'center',
							justifyContent: 'space-around',
							borderRadius: 5
						}}
					>
						<Text style={styles.affHead}>{asyncLanguage == 'fr' ? French.AFFILIATION_CODE : English.AFFILIATION_CODE}</Text>
						<Text style={styles.affsubHead}>
							{asyncLanguage == 'fr' ? French.AFFILIATION_CODE_TEXT : English.AFFILIATION_CODE_TEXT}
						</Text>
						<Input
							containerStyle={{
								height: 50,
								width: '90%',
								marginTop: 5,
								backgroundColor: '#fff',
								color: '#000',
								borderWidth: 1,
								borderColor: '#d3d3d3'
							}}
							inputStyle={{ fontSize: 14, paddingTop: 8, fontFamily: 'SFProDisplay-Regular' }}
							autoCapitalize="none"
							inputContainerStyle={{ borderBottomWidth: 0 }}
							underlineColorAndroid="transparent"
							placeholderTextColor="#d5d5d5"
							onChangeText={(affiliationCode) => this.setState({ affiliationCode })}
							value={this.state.affiliationCode}
							keyboardType="email-address"
							placeholder={asyncLanguage == 'fr' ? French.AFFILIATION_CODE : English.AFFILIATION_CODE}
						/>
						<TouchableOpacity onPress={() => this.updateCode()} style={{ width: '90%' }}>
							<LinearGradient
								colors={['#FF984C', '#F56464']}
								start={{ x: 0, y: 1 }}
								end={{ x: 2, y: 2 }}
								locations={[0, 0.5]}
								style={styles.linearGradients}
							>
								<Text style={{ color: '#fff', fontFamily: 'SFProDisplay-Regular' }}>{asyncLanguage == 'fr' ? French.START_GIMONII : English.START_GIMONII}</Text>
							</LinearGradient>
						</TouchableOpacity>
					</View>
				</Modal>
				<Modal
					backdropColor={'black'}
					backdropOpacity={0.1}
					style={{
						height: '100%'
					}}
					animationIn="zoomInDown"
					animationOut="zoomOutUp"
					animationInTiming={1000}
					animationOutTiming={1000}
					backdropTransitionInTiming={1000}
					backdropTransitionOutTiming={1000}
					isVisible={this.state.modal2}
				>
					<View
						style={{
							backgroundColor: '#fff',
							height: 350,
							alignItems: 'center',
							justifyContent: 'space-around',
							borderRadius: 5
						}}
					>
						<Image source={star} style={styles.payimg} />
						<Text style={styles.payHead}>{asyncLanguage == 'fr' ? French.THANKS_FOR_ORDER : English.THANKS_FOR_ORDER}</Text>
						<Text style={styles.paysubHead}>
							{asyncLanguage == 'fr' ? French.THANKS_FOR_ORDER_TEXT : English.THANKS_FOR_ORDER_TEXT}
						</Text>

						<TouchableOpacity onPress={() => { this.setState({ modal2: !this.state.modal2 }) }} style={{ width: '90%' }}>
							<LinearGradient
								colors={['#FF984C', '#F56464']}
								start={{ x: 0, y: 1 }}
								end={{ x: 2, y: 2 }}
								locations={[0, 0.5]}
								style={styles.linearGradients}
							>
								<Text style={{ color: '#fff' }}>Let's Gimonii</Text>
							</LinearGradient>
						</TouchableOpacity>
					</View>
				</Modal>
				<Modal
					backdropColor={'transparent'}
					backdropOpacity={0.1}
					animationInTiming={1000}
					animationOutTiming={1000}
					backdropTransitionInTiming={1000}
					backdropTransitionOutTiming={1000}
					onBackdropPress={() => this.setState({ winner: false })}
					isVisible={this.state.winner}
					style={{ marginBottom: 0, justifyContent: 'flex-end', marginLeft: 10, marginRight: 10 }}
				>
					<View
						style={{
							alignItems: 'center',
							justifyContent: 'space-around',
							borderRadius: 5,
							width: '100%',
							marginBottom: 20
						}}
					>
						<LinearGradient
							colors={['rgba(234,56,55,1)', 'rgba(237,89,43,0.8)']}
							start={{ x: 0, y: 0 }}
							end={{ x: 0, y: 2 }}
							locations={[0, 0.5]}
							style={{
								width: '100%',
								borderRadius: 6,
								// marginRight: 2,
								height: 50,
								// backgroundColor: '#ED592B',
								alignItems: 'center',
								justifyContent: 'center',
								flexDirection: 'row'
							}}
						>
							<Text style={{ width: '90%', textAlign: 'center', color: '#fff', fontWeight: 'bold', fontFamily: 'SFProDisplay-Regular' }}>
								{todayGift.selectedAt ? "The first winner will be on " + moment(((todayGift.selectedAt + (60 * 60 * 24 * 1000)))).format("DD MMMM YYYY") : 'The first winning will be on 7th may 2020'}
								{/* {'The first winning will be on 7th may 2020'} */}
							</Text>
							<TouchableOpacity style={{ marginTop: -20 }} onPress={() => this.setState({ winner: false })}>
								<Icon name="closecircle" type="antdesign" size={16} color="#fff" />
							</TouchableOpacity>
						</LinearGradient>
					</View>
				</Modal>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		// justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#fff'
	},
	textView: {
		justifyContent: 'center',
		padding: 10
	},
	borderRight: {
		borderRightColor: 'orange',
		borderRightWidth: 0.5
	},
	textCenter: {
		textAlign: 'center',
		color: 'orange',
		fontSize: 18
	},
	nextwin: {
		color: '#EA3838',
		height: 87,
		// marginTop: -2,
		fontFamily: font1,
		fontStyle: 'normal',
		fontSize: 14,
		lineHeight: 17,
		// textAlignVertical: 'center',
		paddingTop: 20,
		borderRadius: 2,
		textAlign: 'center',
		width: 55,
		backgroundColor: 'transparent'
	},
	path: {
		position: 'absolute',
		left: '38.13%',
		right: '25.87%',
		top: '65.03%',
		bottom: '51.87%'
	},
	loader: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	linearGradient: {
		width: '100%',
		height: '25%',
		justifyContent: 'center'
	},
	linearGradientRound: {
		width: 100,
		height: 100,
		// marginTop:-10,
		borderRadius: 1000,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: -50,
		marginLeft: -200,
		zIndex: 2
	},
	time: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		width: '80%',
		alignItems: 'center',
		backgroundColor: '#fff',
		elevation: 5,
		margin: 20,
		borderRadius: 5,
		position: 'absolute',
		top: 400
	},
	winSec: {
		justifyContent: 'space-around',
		alignItems: 'center',
		flexDirection: 'row'
		// marginTop: 20
	},
	winText: {
		textAlign: 'center',
		fontFamily: 'Roboto',
		color: '#fff'
	},
	verticalBorder: {
		height: 70,
		borderLeftColor: '#fff',
		borderLeftWidth: 2,
		opacity: 0.5
	},
	productContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
		// flex: 1
	},
	productBox: {
		backgroundColor: '#fff',
		justifyContent: 'center',
		// alignItems: 'center',
		width: '40%',
		height: 250,
		margin: 10,
		marginLeft: '6%',
		elevation: 3,
		borderRadius: 5
	},
	productImg: {
		width: '65%',
		height: '100%',
		// marginTop: Platform.OS == "ios" ? -50 : -30
	},
	productTxtBox: {
		marginLeft: 10
	},
	productPrice: {
		color: '#FB9A05',
		fontFamily: 'SFProDisplay-Regular',
		fontSize: 18,
		fontWeight: 'bold',
		marginTop: 10,
		textAlign: 'left'
	},
	productName: {
		color: '#000',
		fontFamily: 'SFProDisplay-Regular',
		fontSize: 14,
		marginTop: 10
	},
	productDes: {
		fontSize: 12,
		fontFamily: 'SFProDisplay-Regular',
		marginTop: 5
	},
	affHead: {
		fontFamily: 'SFProDisplay-Regular',
		fontSize: 20,
		lineHeight: 32,
		textAlign: 'center',
		color: '#000'
	},
	affsubHead: {
		fontFamily: 'SFProDisplay-Regular',
		fontSize: 16,
		width: '90%',
		lineHeight: 24,
		textAlign: 'center'
	},
	linearGradients: {
		// bottom: 16,
		borderRadius: 4,
		marginTop: 10,
		// width:"80%",
		alignItems: 'center',
		height: 50,
		justifyContent: 'center'
	},
	payimg: {
		width: 150,
		height: 150,
		marginTop: 30
	},
	payHead: {
		fontFamily: 'SFProDisplay-Regular',
		fontSize: 20,
		lineHeight: 32,
		textAlign: 'center',
		color: '#F88735'
	},
	paysubHead: {
		fontFamily: 'SFProDisplay-Regular',
		fontSize: 16,
		width: '90%',
		lineHeight: 24,
		textAlign: 'center'
	},
});

const mapStateToProps = ({ gift, auth }) => {
	const { data, loading } = gift;
	const { user, language } = auth;
	return { data, loading, user, language };
};

export default connect(mapStateToProps, {
	fetchGifts,
	getUser
})(HomeInner);
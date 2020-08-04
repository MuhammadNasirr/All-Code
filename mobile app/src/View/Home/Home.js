import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	Text,
	Image,
	ScrollView,
	TouchableOpacity,
	TouchableHighlight,
	FlatList,
	ActivityIndicator,
	AsyncStorage,
	Share,
	Platform,
	Alert,
	SafeAreaView
} from 'react-native';
import { Icon, Button, Input } from 'react-native-elements';
import { fetchGifts, getUser, changeLanguage } from '../../actions';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import iphone from '../../assets/images/item1.png';
import star from '../../assets/images/star.png';
import CountDown from 'react-native-countdown-component';
import { sendGridEmail } from 'react-native-sendgrid';
import stripe from 'tipsi-stripe';
import axios from 'axios';
import Modal from 'react-native-modal';
import { fireBase } from '../../firebase/firebase';
import moment from 'moment';
import { Header } from '../../Components';
import English from "../../en"
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
class Home extends Component {
	static navigationOptions = {
		header: null
	};

	constructor(props) {
		super(props);
		this.state = {
			participate: true,
			modalVisible: false,
			cardData: {},
			affiliationModal: false,
			affiliationCode: '',
			checkVerify: false,
			confirmPay: false,
			id: '',
			asyncLanguage: 'fr',
			loader: false,
			modal2: false,
			time: {},
			seconds: 1000,
			todayGift: '',
			todayGiftLoading: false,
			totalMembers: 0,
			funds: 0,
			winner: false
		};
		this.updateCode = this.updateCode.bind(this);
		this.timer = 0;
		this.startTimer = this.startTimer.bind(this);
		this.countDown = this.countDown.bind(this);
	}
	snapshotToArray = snapshot => Object.entries(snapshot).map(e => Object.assign(e[1], { uid: e[0] }));

	getSelectedGift = () => {
		this.setState({ todayGiftLoading: true });
		const db = fireBase.database();
		db.ref("TodayGift").on("value", snapshot => {
			if (snapshot.val()) {
				let todayGift = this.snapshotToArray(snapshot.val())
				console.log(((todayGift[0].selectedAt + (60 * 60 * 24 * 1000)) - Date.now()) / 1000, "timerrr")
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
	convertamount = () => {
		axios.get('https://api.exchangeratesapi.io/latest?base=EUR').then(obj => {
			console.log(obj.data.rates.USD, 'usd')
		})
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

	setModalVisible(visible) {
		this.setState({ modalVisible: visible, confirmPay: !visible });
	}
	componentDidMount() {
		console.log(((1558640753680 + (60 * 60 * 24 * 1000)) - Date.now()) / 1000, 'timerrrrrrrrrrrrrrrr')
		this.convertamount()
		AsyncStorage.getItem('card').then((res) => {
			// console.warn('res', res);
			this.setState({ cardData: JSON.parse(res) });
		});
		this.props.fetchGifts();
		// this.props.changeLanguage(this.state.asyncLanguage);
		setTimeout(() => {
			this.props.getUser();
		}, 2000);
		this.setState({ checkVerify: true });
		let timeLeftVar = this.secondsToTime(this.state.seconds);
		this.setState({ time: timeLeftVar });
		this.startTimer();
		this.getSelectedGift();
		this.getTotalMembers();
		this.getFunds();

		AsyncStorage.getItem('language').then(a => {
			if (a == null) {
				AsyncStorage.setItem('language', 'fr')
			}
			this.setState({ asyncLanguage: a })
			console.warn(a, "check async props")
		})
	}
	startTimer() {
		if (this.timer == 0 && this.state.seconds > 0) {
			this.timer = setInterval(this.countDown, 1000);
		}
	}
	getTotalMembers = () => {
		var me = this;
		var leadsRef = fireBase.database().ref(`Users`);
		leadsRef.once('value', function (snapshot) {
			var arr = Object.values(snapshot.val());
			console.warn(arr.length, "arr")
			me.setState({ totalMembers: arr.length - 1 })
		});
	}
	getFunds = () => {
		var me = this;
		var leadsRef = fireBase.database().ref(`Funds`);
		leadsRef.once('value', function (snapshot) {
			var arr = Object.values(snapshot.val());
			console.warn(arr, "Funds")
			// arr[0] = arr[0]*0.9
			me.state.asyncLanguage == 'fr' ? arr[0] = arr[0] * 0.9 : arr[0] = arr[0]
			me.setState({ funds: arr[0] })
			console.log(arr[0], 'funds rate')
			// axios.get('https://api.exchangeratesapi.io/latest?base=EUR').then(obj => {


			// })
		});
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
	componentWillReceiveProps(newProps) {
		console.log(newProps, 'reducer props')
		AsyncStorage.getItem('language').then(a => {
			this.setState({ asyncLanguage: a })
			console.warn(a, "check async home")
			this.props.changeLanguage(this.state.asyncLanguage)

		})
		if (newProps.language) {
			this.setState({ asyncLanguage: newProps.language })
			this.getFunds()
		}
		if (newProps.navigation.state.params) {
			if (newProps.navigation.state.params.payment == true) {
				this.setState({ modal2: !this.state.modal2 });
			}
		}
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

	_renderItem = ({ item }) => (
		<TouchableOpacity
			// onPress={() => this.props.navigation.navigate('HomeInner', { iphone, item })}
			style={styles.productBox}
		>
			<Image source={iphone} style={styles.productImg} />
			{/* <Icon name="share" color="black" onPress={() => this.share(item)} /> */}
			<View style={styles.productTxtBox}>
				<Text style={styles.productPrice}>{item.price}</Text>
				<Text style={styles.productName}>{item.name}</Text>
				<Text style={styles.productDes}>{item.description}</Text>
			</View>
		</TouchableOpacity>
	);

	updateCode = () => {
		const me = this;
		const { id, affiliationCode } = this.state;
		if (affiliationCode !== '') {
			var leadsRef = fireBase.database().ref('Users');
			leadsRef.once('value', function (snapshot) {
				var arr = Object.values(snapshot.val());
				const found = arr.some((el) => el.affiliationCode == affiliationCode);
				if (!found) {
					alert('wrong affiliation code');
				} else {
					fireBase.database().ref('/Users/' + id).update({
						affiliationCode
					});
					me.hideModal();
				}
			});
		} else {
			alert('you must enter code');
		}
	};

	hideModal = () => {
		this.setState({ affiliationModal: !this.state.affiliationModal, affiliationCode: '' });
	};

	makePayment = async () => {
		this.setState({ loader: true });
		if (this.state.cardData != null) {
			try {
				// const params = {
				// 	number: '4242424242424242',
				// 	expMonth: 12,
				// 	expYear: 24,
				// 	cvc: '223',
				// 	name: 'Test User',
				// 	currency: 'usd',
				// 	addressLine1: '123 Test Street',
				// 	addressLine2: 'Apt. 5',
				// 	addressCity: 'Test City',
				// 	addressState: 'Test State',
				// 	addressCountry: 'Test Country',
				// 	addressZip: '55555'
				// };
				const token = await stripe.createTokenWithCard(this.state.cardData);
				// console.warn('onsubmit', token);
				const body = {
					amount: 400,
					tokenId: token.tokenId
				};
				const headers = {
					'Content-Type': 'application/json'
				};
				axios
					.post('https://gimonii.herokuapp.com/api/doPayment', body, { headers })
					.then((res) => {
						// alert('payment success');
						this.setState({ loader: false });
						this.setModalVisible(false);
						// console.warn('res', res);
					})
					.catch((error) => {
						this.setModalVisible(false);
						// console.warn('err', error);
					});
			} catch (error) {
				this.setModalVisible(false);
				alert(error);
			}
		} else {
			alert('please add card from setting page');
			this.setState({ loader: false, modalVisible: !this.state.modalVisible });
		}
	};

	render() {
		const { todayGift, totalMembers, funds, asyncLanguage, winner } = this.state;
		// console.warn('affilation model', this.state.affiliationModal);
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
					// rightImg={require('../../assets/images/menu.png')}
					homeLogo={true}
					navigation={this.props.navigation}
					// homeRightIcon={true}
					drawerIcon={true}
				/>
				{this.state.todayGiftLoading ?

					<View style={styles.loader}>
						<ActivityIndicator size="large" color="#F56464" />
					</View>
					:
					<SafeAreaView style={{ height: '100%' }}>
						<View style={styles.container}>
							<LinearGradient
								colors={['#F28B19', '#EA3838']}
								start={{ x: 0, y: 1 }}
								end={{ x: 2, y: 2 }}
								locations={[0, 0.5]}
								style={styles.linearGradient}
							>
								<View style={styles.winSec}>
									<View style={{ paddingLeft: '7%' }}>
										<Text style={[styles.winText, { fontSize: 14, fontWeight: '100' }]}>{asyncLanguage == "fr" ? French.MEMBERS : English.MEMBERS}</Text>

										<Text style={[styles.winText, { fontSize: 28, fontWeight: 'bold' }]}>2458</Text>
									</View>
									<View style={styles.verticalBorder} />
									<View style={{ paddingRight: '7%' }}>
										<Text style={[styles.winText, { fontSize: 14, fontWeight: '100' }]}>
											{asyncLanguage == "fr" ? French.AIDS_FUNDS : English.AIDS_FUNDS}
										</Text>

										<Text style={[styles.winText, { fontSize: 28, fontWeight: 'bold' }]}>{asyncLanguage == "fr" ? "€" : "$"} {funds}</Text>
									</View>
								</View>
							</LinearGradient>
							{this.state.participate ? (
								<View style={styles.participateBox}>
									<Text style={{ fontFamily: 'SFProDisplay-Regular', fontSize: 12 }}>{asyncLanguage == "fr" ? French.SUBSCRIPION_TO_PARTICIPATE : English.SUBSCRIPION_TO_PARTICIPATE}</Text>
									<TouchableOpacity
										onPress={() => {
											this.props.navigation.navigate('LoginScreen');
											// this.setModalVisible(true);
										}}
										style={[styles.textFieldContainer]}
									>
										<LinearGradient
											colors={['#FF984C', '#F56464']}
											start={{ x: 0, y: 1 }}
											end={{ x: 2, y: 2 }}
											locations={[0, 0.5]}
											style={[styles.linearGradients, { width: 120, height: 35 }]}
										>
											<Text
												style={{
													color: '#fff',
													fontSize: 16,
													lineHeight: 19,
													fontFamily: 'SFProDisplay-Regular'
												}}
											>
												{asyncLanguage == "fr" ? French.PARTICIPATE : English.PARTICIPATE}
											</Text>
										</LinearGradient>
									</TouchableOpacity>
									{/* <Button
									title={'Participate'}
									onPress={() => {
										this.setModalVisible(true);
									}}
									containerStyle={{ margin: 10 }}
									buttonStyle={{ backgroundColor: '#f68736', width: 120 }}
								/> */}
									{/* <Button
								title={'Win'}
								onPress={() => {
									this.onSubmit();
								}}
								containerStyle={{ margin: 10 }}
								buttonStyle={{ backgroundColor: '#f68736', width: 100 }}
							/> */}
								</View>
							) : null}
							<View style={styles.productContainer}>
								<View
									style={[
										styles.textFieldContainer,
										{ marginTop: -30, width: '100%', alignItems: 'center' }
									]}
								>
									<LinearGradient
										colors={['#EE6228', '#EA3838']}
										start={{ x: 0, y: 1.1 }}
										end={{ x: 3, y: 1 }}
										locations={[0, 0.5]}
										style={styles.linearGradientRound}
									>
										<Text
											style={{
												fontSize: 20,
												color: '#fff',
												fontFamily: 'Roboto',
												fontWeight: 'bold'
											}}
										>
											{asyncLanguage == "fr" ? "€" : "$"}{asyncLanguage == "fr" ? todayGift.price * 0.9 : todayGift.price}
										</Text>
									</LinearGradient>
									<View style={{ width: '80%', height: '45%', padding: 0, margin: 0, marginTop: -40, justifyContent: 'center', alignItems: 'center' }}>
										<Image source={{ uri: todayGift.imgUrl }} style={styles.productImg} />
									</View>
									<Text
										style={{
											textAlign: 'center',
											fontSize: 12,
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
											fontSize: 12,
											fontFamily: 'SFProDisplay-Regular'
										}}
									>
										{todayGift.description}
									</Text>
								</View>
							</View>
							<View style={styles.textFieldContainer} />

							<Modal
								animationType="slide"
								transparent={false}
								style={{ backgroundColor: '#FEF2D1', margin: 0 }}
								visible={this.state.modalVisible}
								onRequestClose={() => {
									Alert.alert('Modal has been closed.');
								}}
							>
								<View
									style={{
										height: '90%',
										marginTop: 0,
										flexDirection: 'column',
										justifyContent: 'space-between'
									}}
								>
									<TouchableOpacity
										onPress={() => {
											this.setState({ modalVisible: !this.state.modalVisible });
											// this.setModalVisible(!this.state.modalVisible);
										}}
									>
										<Icon name={'cross'} containerStyle={{ alignItems: 'flex-start' }} type="entypo" />
									</TouchableOpacity>
									<View style={styles.modal}>
										<Image source={star} style={styles.participateimg} />
										<Text
											style={{
												color: '#f68736',
												fontSize: 18,
												textAlign: 'center',
												marginTop: 20,
												fontFamily: 'SFProDisplay-Regular'
											}}
										>
											{asyncLanguage == "fr" ? French.NEED_TO_PARTICIPATE : English.NEED_TO_PARTICIPATE}
										</Text>
										{this.state.loader ? (
											<ActivityIndicator size="large" color="#0000ff" />
										) : (
												<Button
													title={asyncLanguage == "fr" ? French.PAY_SUBCIPTION : English.PAY_SUBCIPTION}
													onPress={() => {
														this.makePayment();
														// this.setModalVisible(true);
													}}
													containerStyle={{ marginTop: 150, width: '100%' }}
													buttonStyle={{ backgroundColor: '#f68736', height: 50, borderRadius: 5 }}
												/>
											)}
									</View>
								</View>
							</Modal>
						</View>
						<View
							style={{
								// position: 'absolute',
								// top: 0,
								bottom: Platform.OS == 'ios' ? 80 : 50,
								// left:20,
								alignItems: 'center',
								justifyContent: 'center',
								flexDirection: 'row'
							}}
						>
							<Text style={styles.nextwin}>{asyncLanguage == "fr" ? French.NEXT_WIN : English.NEXT_WIN}</Text>
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
												height: 50,
												backgroundColor: '#ED592B',
												alignItems: 'center',
												justifyContent: 'center'
											}}
										>
											<Text
												style={{
													color: '#fff',
													textAlign: 'center',
													fontSize: 37,
													fontFamily: font1
												}}
											>
												{secondDigitH ? firstDigitH : '0'}
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
												height: 50,
												backgroundColor: '#ED592B',
												alignItems: 'center',
												justifyContent: 'center'
											}}
										>
											<Text
												style={{
													color: '#fff',
													textAlign: 'center',
													fontSize: 37,
													fontFamily: font1
												}}
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
										{asyncLanguage == "fr" ? French.HOURS : English.HOURS}
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
												height: 50,
												backgroundColor: '#ED592B',
												alignItems: 'center',
												justifyContent: 'center'
											}}
										>
											<Text
												style={{
													color: '#fff',
													textAlign: 'center',
													fontSize: 37,
													fontFamily: font1
												}}
											>
												{secondDigitM ? firstDigitM : '0'}
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
												height: 50,
												backgroundColor: '#ED592B',
												alignItems: 'center',
												justifyContent: 'center'
											}}
										>
											<Text
												style={{
													color: '#fff',
													textAlign: 'center',
													fontSize: 37,
													fontFamily: font1
												}}
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
										{asyncLanguage == "fr" ? French.MINUTES : English.MINUTES}
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
												height: 50,
												backgroundColor: '#ED592B',
												alignItems: 'center',
												justifyContent: 'center'
											}}
										>
											<Text
												style={{
													color: '#fff',
													textAlign: 'center',
													fontSize: 37,
													fontFamily: font1
												}}
											>
												{secondDigit ? firstDigit : '0'}
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
												height: 50,
												backgroundColor: '#ED592B',
												alignItems: 'center',
												justifyContent: 'center'
											}}
										>
											<Text
												style={{
													color: '#fff',
													textAlign: 'center',
													fontSize: 37,
													fontFamily: font1
												}}
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
										{asyncLanguage == "fr" ? French.SECONDS : English.SECONDS}
									</Text>
								</View>
							</View>
						</View>
					</SafeAreaView>
				}
				<Modal
					backdropColor={'black'}
					backdropOpacity={0.1}
					animationIn="zoomInDown"
					animationOut="zoomOutUp"
					animationInTiming={1000}
					// onBackButtonPress={this.setState({isModalVisible:false})}
					animationOutTiming={1000}
					backdropTransitionInTiming={1000}
					backdropTransitionOutTiming={1000}
				// isVisible={this.state.affiliationModal}
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
						<Text style={styles.affHead}>{asyncLanguage == "fr" ? French.AFFILIATION_CODE : English.AFFILIATION_CODE}</Text>
						<Text style={styles.affsubHead}>
							{asyncLanguage == "fr" ? French.AFFILIATION_CODE_TEXT : English.AFFILIATION_CODE_TEXT}
						</Text>
						<Input
							containerStyle={{
								height: 40,
								width: '90%',
								marginTop: 5,
								backgroundColor: '#fff',
								color: '#000',
								borderWidth: 1,
								borderColor: '#d3d3d3'
							}}
							inputStyle={{ fontSize: 14, paddingTop: 12, fontFamily: 'SFProDisplay-Regular' }}
							autoCapitalize="none"
							inputContainerStyle={{ borderBottomWidth: 0 }}
							underlineColorAndroid="transparent"
							placeholderTextColor="#d5d5d5"
							onChangeText={(affiliationCode) => this.setState({ affiliationCode })}
							value={this.state.affiliationCode}
							keyboardType="email-address"
							placeholder={asyncLanguage == "fr" ? French.AFFILIATION_CODE : English.AFFILIATION_CODE}
						/>
						<TouchableOpacity onPress={() => this.updateCode()} style={{ width: '90%' }}>
							<LinearGradient
								colors={['#FF984C', '#F56464']}
								start={{ x: 0, y: 1 }}
								end={{ x: 2, y: 2 }}
								locations={[0, 0.5]}
								style={styles.linearGradients}
							>
								<Text style={{ color: '#fff', fontFamily: 'SFProDisplay-Regular' }}>{asyncLanguage == "fr" ? French.START_GIMONII : English.START_GIMONII}</Text>
							</LinearGradient>
						</TouchableOpacity>
					</View>
				</Modal>
				<Modal
					backdropColor={'black'}
					backdropOpacity={0.1}
					animationIn="zoomInDown"
					animationOut="zoomOutUp"
					animationInTiming={1000}
					// onBackButtonPress={this.setState({isModalVisible:false})}
					animationOutTiming={1000}
					backdropTransitionInTiming={1000}
					backdropTransitionOutTiming={1000}
					isVisible={this.state.confirmPay}
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
						<Text style={styles.payHead}>{asyncLanguage == "fr" ? French.THANKS_FOR_ORDER : English.THANKS_FOR_ORDER}</Text>
						<Text style={styles.paysubHead}>
							{asyncLanguage == "fr" ? French.THANKS_FOR_ORDER_TEXT : English.THANKS_FOR_ORDER_TEXT}
						</Text>

						<TouchableOpacity onPress={() => this.setState({ confirmPay: false })} style={{ width: '90%' }}>
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
					backdropColor={'black'}
					backdropOpacity={0.1}
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
						<Text style={styles.payHead}>{asyncLanguage == "fr" ? French.THANKS_FOR_ORDER : English.THANKS_FOR_ORDER}</Text>
						<Text style={styles.paysubHead}>
							{asyncLanguage == "fr" ? French.THANKS_FOR_ORDER_TEXT : English.THANKS_FOR_ORDER_TEXT}
						</Text>

						<TouchableOpacity
							onPress={() => {
								this.setState({ modal2: !this.state.modal2 });
							}}
							style={{ width: '90%' }}
						>
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
					onBackdropPress={() => this.setState({ winner: false })}
					backdropTransitionInTiming={1000}
					backdropTransitionOutTiming={1000}
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
		flex: 8,
		flexDirection: 'column',
		// justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#fff',
		height: '100%'
	},
	affHead: {
		fontFamily: 'SFProDisplay-Regular',
		fontSize: 20,
		lineHeight: 32,
		textAlign: 'center',
		color: '#000'
	},
	productImg: {
		width: '65%',
		height: '100%',
		// marginTop: Platform.OS == 'ios' ? -50 : -30
	},
	linearGradientRound: {
		width: 100,
		height: 100,
		borderRadius: 100,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: -50,
		marginLeft: -230,
		zIndex: 2,
		// marginTop:10
	},
	payHead: {
		fontFamily: 'SFProDisplay-Regular',
		fontSize: 20,
		lineHeight: 32,
		textAlign: 'center',
		color: '#F88735'
	},
	affsubHead: {
		fontFamily: 'SFProDisplay-Regular',
		fontSize: 16,
		width: '90%',
		lineHeight: 24,
		textAlign: 'center'
	},
	paysubHead: {
		fontFamily: 'SFProDisplay-Regular',
		fontSize: 16,
		width: '90%',
		lineHeight: 24,
		textAlign: 'center'
	},
	participateimg: {
		width: 200,
		height: 200,
		marginTop: 30
	},
	payimg: {
		width: 150,
		height: 150,
		marginTop: 30
	},
	textView: {
		justifyContent: 'center',
		padding: 10
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
		width: 65,
		backgroundColor: 'transparent'
	},
	borderRight: {
		borderRightColor: 'orange',
		borderRightWidth: 0.5
	},
	modal: {
		flexDirection: 'column',
		justifyContent: 'space-between',
		marginLeft: 20,
		alignItems: 'center',
		width: '90%'
	},
	textCenter: {
		textAlign: 'center',
		color: 'orange',
		fontSize: 18
	},
	loader: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	linearGradient: {
		width: '100%',
		height: '25%',
		justifyContent: 'center',
		// marginTop: 10
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
	participateBox: {
		backgroundColor: '#fff',
		borderRadius: 5,
		width: '90%',
		elevation: 5,
		shadowColor: '#000',
		shadowOffset: { width: 1, height: 2 },
		shadowOpacity: 0.5,
		shadowRadius: 2,
		alignItems: 'center',
		zIndex: 2,
		marginTop: -25,
		paddingVertical: 10
	},
	time: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		width: '80%',
		alignItems: 'center',
		fontFamily: 'SFProDisplay-Regular',
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
		fontFamily: 'SFProDisplay-Regular',
		color: '#fff'
	},
	verticalBorder: {
		height: 60,
		borderLeftColor: '#fff',
		borderLeftWidth: 0.5
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
		borderRadius: 2,
		borderWidth: 1,
		borderColor: '#ddd',
		borderBottomWidth: 0,
		shadowColor: '#000',
		shadowOffset: { width: 1, height: 2 },
		shadowOpacity: 0.5,
		shadowRadius: 2,
		elevation: 1
	},
	// productImg: {
	// 	width: 120,
	// 	height: 60,
	// 	marginLeft: 10,
	// 	marginBottom: 10
	// },
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
	}
});

const mapStateToProps = ({ gift, auth }) => {
	const { data, loading } = gift;
	const { user, language } = auth;
	return { data, loading, user, language };
};

export default connect(mapStateToProps, {
	fetchGifts,
	getUser,
	changeLanguage
})(Home);
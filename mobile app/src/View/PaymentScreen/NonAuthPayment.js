import React, { Component } from 'react';
import { StyleSheet, View, Text, Alert, ScrollView, TouchableOpacity, ActivityIndicator, AsyncStorage, Image } from 'react-native';
import { Icon, Button, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import stripe from 'tipsi-stripe';
import axios from 'axios';
import { signupUser } from '../../actions';
import { DatePicker } from 'native-base';
import { Header } from '../../Components';
import { fireBase } from '../../firebase/firebase'
import English from "../../en"
import French from "../../fr"

var monthcheck = ''
var Yearcheck = ''
var asyncLanguagelocal = ''
class NonAuthPayment extends Component {
	static navigationOptions = {
		header: null
	};

	constructor(props) {
		super(props);
		this.state = {
			card: '',
			expiryM: null,
			expiryY: null,
			cvv: '',
			asyncLanguage: null,
			participate: true,
			holder: this.props.navigation.state.params.currentUser.firstName,
			chosenDate: new Date(),
			loading: false
		};
		this.setDate = this.setDate.bind(this);
	}

	// componentDidMount(){
	// 	// AsyncStorage.getItem('card')
	// 	// .then(res => {
	// 	// 	console.warn("session",res)
	// 	// })
	// 	AsyncStorage.removeItem('card')
	// }
	setDate(newDate) {
		// debugger
		// let Month =	String(newDate).slice(4,7)
		let Year = String(newDate).slice(11, 15)
		years = parseInt(Year, 10)
		console.log(years)
		this.setState({ chosenDate: newDate, expiryM: 10, expiryY: years });

	}
	checkMonth() {
		let me = this
		monthcheck
		console.warn(monthcheck, 'monthcheck')
		const regex = /^(0[1-9]|1[0-2])$/
		if (regex.test(monthcheck)) {
		} else {
			alert(asyncLanguagelocal == "fr" ? French.INVALID_MONTH : English.INVALID_MONTH)
			me.setState({ expiryM: '' })
		}
	}

	checkYear() {
		let me = this;
		Yearcheck
		console.warn(Yearcheck, 'Yearcheck')
		const regex = /^(19[5-9]\d|20[0-4]\d|2050)$/
		if (regex.test(Yearcheck)) {
			console.warn('done')
		} else {
			alert(asyncLanguagelocal == "fr" ? French.INVALID_YEAR : English.INVALID_YEAR)
			me.setState({ expiryY: '' })
		}
	}
	onSubmit = async () => {
		const currentUser = this.props.navigation.state.params.currentUser
		console.warn("currentUser firstName", currentUser)
		const firstName = currentUser.firstName
		const email = currentUser.email
		const affiliationCode = currentUser.affiliationCode
		const myAffiliation = currentUser.myAffiliation
		const location = currentUser.location
		const password = currentUser.password
		const profilePicURL = currentUser.profilePicURL
		const { asyncLanguage } = this.state;

		try {
			this.setState({ loading: true });
			const params = {
				number: this.state.card,
				expMonth: Number(this.state.expiryM),
				expYear: Number(this.state.expiryY),
				cvc: this.state.cvv,
				name: firstName,
				currency: 'EUR',
				addressLine1: location,
				addressLine2: location,
				addressCity: location,
				addressState: location,
				addressCountry: location,
				addressZip: ''
			};
			console.warn('onsubmit', params);
			const token = await stripe.createTokenWithCard(params);
			console.warn('onsubmit', token);
			const body = {
				amount: 400,
				email: email,
				tokenId: token.tokenId,
				currency: 'EUR',
				description: 'Gimonii Membership Subscription'
			};
			const headers = {
				'Content-Type': 'application/json'
			};
			console.warn('response params', body);
			axios.post('https://www.gimonii.com/api/doPayment', body, { headers })
				.then((res) => {
					debugger
					console.warn('response payment', res);
					if (!res.data.success) {
						alert(res.data.message)
						this.setState({ loading: false });
					}
					else {
						// debugger
						const sub_Id = res.data.data.id;
						const navigation = this.props.navigation
						console.warn('subscription', sub_Id);
						this.props.signupUser({ firstName, email, sub_Id, affiliationCode, myAffiliation, location, password, profilePicURL, navigation });
						// console.warn('signupuser after');
						// AsyncStorage.getItem('postUserUid').then((uid) => {
						// 	console.warn('container user.user.uid', uid);
						// 	// var date = Date.now() + 60 * 60 * 24 * 31 * 1000
						// 	// var afterOneMonthDate = new Date(date)
						// 	// fireBase.database().ref('Users/' + uid).update({  expireSubscriptionOn: afterOneMonthDate });
						// 	// alert('uploaded');
						// 	// console.log('url', url);
						// 	this.setState({ loading: false });
						// 	this.props.navigation.navigate('NonAuthHome', { payment: true })
						// });
					}
					// AsyncStorage.removeItem('postUserUid')
					// alert('payment success');
					// console.warn('res', res);
				})
				.catch((error) => {
					debugger
					this.setState({ loading: false });
					if (error == `Error: Missing required param: card[number].`) {

						alert(asyncLanguagelocal == "fr" ? French.ERROR_MISSING_CARD_NUMBER : English.ERROR_MISSING_CARD_NUMBER)
					}
					else if (error == `Error: Request failed with status code 503`) {
						alert(asyncLanguage == "fr" ? French.ERROR_CODE_503 : English.ERROR_CODE_503)
					}
					else if (error == "Error: Could not find payment information") {
						alert(asyncLanguage == "fr" ? French.ERROR_NOT_FIND_PAYMENT : English.ERROR_NOT_FIND_PAYMENT)
					}
					else if (error == "Error: Your card's number is invalid.") {
						alert(asyncLanguage == "fr" ? French.ERROR_NUMBER_INVALID : English.ERROR_NUMBER_INVALID)
					}
					else Alert.alert(error, 'else try')
				});
		} catch (error) {
			debugger
			this.setState({ loading: false });
			if (error == `Error: Missing required param: card[number].`) {
				alert(asyncLanguage == "fr" ? French.ERROR_MISSING_CARD_NUMBER : English.ERROR_MISSING_CARD_NUMBER)
			}
			else if (error.message == "Cannot read property 'firstName' of null") {
				alert(asyncLanguage == "fr" ? French.ERROR_MISSING_NAME : English.ERROR_MISSING_NAME)
			}
			else if (error.message == "TypeError: null is not an object (evaluating 'currentUser.firstName')") {
				alert(asyncLanguage == "fr" ? "French.ERROR_MISSING_NAME" : "TypeError: null is not an object (evaluating 'currentUser.firstName')")
			}
			else if (error == "Error: Your card's expiration year is invalid.") {
				alert(asyncLanguage == "fr" ? French.ERROR_EXPIRE_YEAR : English.ERROR_EXPIRE_YEAR)
			}
			else if (error == "Error: Could not find payment information") {
				alert(asyncLanguage == "fr" ? French.ERROR_NOT_FIND_PAYMENT : English.ERROR_NOT_FIND_PAYMENT)
			}
			else if (error == "Error: Your card's number is invalid.") {
				alert(asyncLanguage == "fr" ? French.ERROR_NUMBER_INVALID : English.ERROR_NUMBER_INVALID)
			}
			else if (error == "Error: Your card number is incorrect.") {
				alert(asyncLanguage == "fr" ? French.ERROR_NUMBER_INCORRECT : English.ERROR_NUMBER_INCORRECT)
			}
			else if (error == "Error: The card number is not a valid credit card number.") {
				alert(asyncLanguage == "fr" ? French.ERROR_NUMBER_NOT_VALID : English.ERROR_NUMBER_NOT_VALID)
			}
			else if (error == "Your card was declined. Your request was in live mode, but used a known test card.") {
				alert(asyncLanguage == "fr" ? French.ERROR_TEST_CARD : English.ERROR_TEST_CARD)
			}
			else if (error == "Error: Your card was declined. Your request was in live mode, but used a known test card.") {
				alert(asyncLanguage == "fr" ? French.ERROR_TEST_CARD : English.ERROR_TEST_CARD)
			}
			else if (error == "Error: Your card was declined") {
				alert(asyncLanguage == "fr" ? French.ERROR_TEST_CARD : English.ERROR_TEST_CARD)
			}
			else {
				Alert.alert(error, 'else catch')
			}
		}
	};
	componentDidMount() {
		AsyncStorage.getItem('language').then(a => {
			this.setState({ asyncLanguage: a, asyncLanguagelocal: a })
			console.warn(a, "check async props")
		})
	}
	componentWillReceiveProps(newProps) {
		AsyncStorage.getItem('language').then(a => {
			this.setState({ asyncLanguage: a, asyncLanguagelocal: a })
			console.warn(a, "check async props")
		})
		if (newProps.language) {
			this.setState({ asyncLanguage: newProps.language, asyncLanguagelocal: newProps.language })
		}
		if (!newProps.loading) {
			this.setState({ loading: false })
		}
	}
	render() {
		monthcheck = this.state.expiryM
		Yearcheck = this.state.expiryY
		if (this.state.loading)
			return (
				<View style={styles.loader}>
					<ActivityIndicator size="large" color="#FF984C" />
				</View>
			);
		console.log(this.state.expiryM)
		const { asyncLanguage } = this.state;
		console.log(this.state.expiryY)

		return (
			<View style={{ backgroundColor: '#f1f1f1', width: '100%', justifyContent: "space-between", flexDirection: 'column', alignItems: 'center', height: '100%' }}>
				<Header title={asyncLanguage == 'fr' ? French.CHECKOUT : English.CHECKOUT} iconleft={true} navigation={this.props.navigation} />
				<ScrollView style={{ backgroundColor: '#f1f1f1', width: '100%' }}>
					<View style={styles.container}>
						<LinearGradient
							colors={['#F69046', '#FF8484']}
							start={{ x: 0, y: 1 }}
							end={{ x: 2, y: 2 }}
							locations={[0, 0.5]}
							style={styles.linearGradient}
						>
							<View style={styles.winSec}>
								<View style={styles.visa}>
									{/* <Text
										style={[
											styles.winText,
											{ fontSize: 24, fontWeight: 'bold', fontStyle: 'italic', }
										]}
									>
										Visa/MasterCard
								</Text> */}
									<View style={{ flexDirection: 'row', alignItems: 'center' }}>
										<Image style={{ width: 50, height: 35 }} resizeMode="contain" source={require("../../assets/images/visa.png")} />
										<Image style={{ marginLeft: 15, width: 50, height: 35 }} resizeMode="contain" source={require("../../assets/images/mastercard.png")} />
									</View>
									<Text style={{ marginTop: 10, fontFamily: 'SFProDisplay-Regular', color: '#fff' }}>{asyncLanguage == 'fr' ? French.CARD_NUMBER : English.CARD_NUMBER}</Text>
									<Input
										containerStyle={{
											height: 30,
											width: '100%',
											color: '#fff',
											backgroundColor: 'transparent',
											marginTop: 0,
											borderWidth: 0,
											marginBottom: 10,
											paddingLeft: 0
										}}
										editable={false}
										placeholderTextColor="#fff"
										inputStyle={{ color: '#fff', fontSize: 16, fontFamily: 'SFProDisplay-Regular' }}
										inputContainerStyle={{ borderBottomColor: '#fff' }}
										autoCapitalize="none"
										underlineColorAndroid="transparent"
										onChangeText={(card) => this.setState({ card })}
										value={this.state.card}
										type="password"
										keyboardType="number-pad"
										textContentType="newPassword"
										maxLength={16}
										placeholder={asyncLanguage == 'fr' ? French.CARD_NUMBER : English.CARD_NUMBER}
									/>
									<View style={{ flexDirection: 'row', width: '100%' }}>
										<View style={{ width: '50%' }}>
											<Text style={{ marginTop: 10, fontFamily: 'SFProDisplay-Regular', color: '#fff' }}>{asyncLanguage == 'fr' ? French.CARD_HOLDER : English.CARD_HOLDER}</Text>
											<Input
												containerStyle={{
													height: 30,
													width: '100%',
													color: '#fff',
													backgroundColor: 'transparent',
													marginTop: 0,
													borderWidth: 0,
													paddingLeft: 0
												}}
												placeholderTextColor="#eee"
												inputStyle={{ color: '#fff', fontFamily: 'SFProDisplay-Regular' }}
												inputContainerStyle={{ borderBottomColor: '#fff' }}
												autoCapitalize="none"
												underlineColorAndroid="transparent"
												onChangeText={(holder) => this.setState({ holder: holder })}
												value={this.state.holder}
												type="password"
												keyboardType="default"
												textContentType="newPassword"
												placeholder="Ruby Lawrance"
											/>
										</View>
										<View style={{ width: '50%' }}>
											<Text style={{ marginTop: 10, fontFamily: 'SFProDisplay-Regular', color: '#fff' }}>{asyncLanguage == 'fr' ? French.EXPIRES : English.EXPIRES}</Text>
											<Input
												containerStyle={{
													height: 30,
													width: '100%',
													color: '#fff',
													backgroundColor: 'transparent',
													marginTop: 0,
													borderWidth: 0,
													paddingLeft: 0
												}}
												underlineColorAndroid="transparent"
												inputContainerStyle={{ borderBottomColor: '#fff' }}
												editable={false}
												inputStyle={{ fontSize: 14, color: '#fff', fontFamily: 'SFProDisplay-Regular' }}
												placeholderTextColor="#fff"
												autoCapitalize="none"
												underlineColorAndroid="transparent"
												onChangeText={(expiryY) => this.setState({ expiryY })}
												value={this.state.expiryY != null ? this.state.expiryM.toString() + "/" + this.state.expiryY.toString() : ''}
												// maxLength={4}
												type="password"
												keyboardType="number-pad"
												textContentType="newPassword"
												placeholder={asyncLanguage == 'fr' ? French.EXPIRY_DATE : English.EXPIRY_DATE}
											/>
										</View>
									</View>
								</View>
							</View>
						</LinearGradient>
						<View style={styles.textFieldContainer}>
							<Text style={{ marginTop: 10, fontFamily: 'Roboto', color: '#6A6766' }}>{asyncLanguage == 'fr' ? French.CARD_NUMBER : English.CARD_NUMBER}</Text>
							<Input
								containerStyle={{
									height: 40,
									backgroundColor: '#fff',
									marginTop: 10,
									borderWidth: 1,
									borderColor: '#d3d3d3'
								}}
								inputStyle={{ fontSize: 14, fontFamily: 'SFProDisplay-Regular' }}
								placeholderTextColor="#d5d5d5"
								inputContainerStyle={{ borderBottomWidth: 0 }}
								autoCapitalize="none"
								underlineColorAndroid="transparent"
								onChangeText={(card) => this.setState({ card })}
								value={this.state.card}
								type="password"
								keyboardType="number-pad"
								maxLength={16}
								textContentType="newPassword"
								placeholder={asyncLanguage == 'fr' ? French.CARD_NUMBER : English.CARD_NUMBER}
							/>
						</View>
						<View style={[styles.textFieldContainer, { flexDirection: 'row' }]}>
							<View style={{ width: '50%' }}>
								<Text style={{ marginTop: 10, fontFamily: 'Roboto', color: '#6A6766' }}>{asyncLanguage == 'fr' ? French.EXPIRY_DATE : English.EXPIRY_DATE}</Text>
								<Text style={{ fontSize: 10, fontFamily: 'Roboto', color: '#6A6766' }}>MM/YYYY</Text>
								{/* <View
									style={{
										height: 40,
										backgroundColor: '#fff',
										marginTop: 10,
										width: '95%',
										borderWidth: 1,
										borderColor: '#d3d3d3'
									}}
								>
									<DatePicker
										defaultDate={new Date(2018, 4, 4)}
										minimumDate={new Date(2018, 1, 1)}
										maximumDate={new Date(2050, 12, 31)}
										locale={'en'}
										timeZoneOffsetInMinutes={undefined}
										modalTransparent={false}
										animationType={'fade'}
										androidMode={'default'}
										placeHolderText="Select date"
										textStyle={{ color: '#000', fontFamily: 'SFProDisplay-Regular',fontSize:14 }}
										placeHolderTextStyle={{ color: '#d5d5d5' }}
										onDateChange={this.setDate}
										disabled={false}
									/>
								</View> */}
								<Input
									containerStyle={{
										height: 40,
										backgroundColor: '#fff',
										marginTop: 10,
										width: '95%',
										borderWidth: 1,
										borderColor: '#d3d3d3'
									}}
									inputStyle={{ fontSize: 14, fontFamily: 'SFProDisplay-Regular' }}
									placeholderTextColor="#d5d5d5"
									inputContainerStyle={{ borderBottomWidth: 0 }}
									autoCapitalize="none"
									underlineColorAndroid="transparent"
									onChangeText={(expiryM) => this.setState({ expiryM })}
									value={this.state.expiryM != null ? this.state.expiryM.toString() : ''}
									type="password"
									maxLength={2}
									onBlur={this.checkMonth.bind(this)}
									keyboardType="number-pad"
									textContentType="newPassword"
									placeholder={asyncLanguage == 'fr' ? French.EXPIRY_MONTH : English.EXPIRY_MONTH}
								/>
								<Input
									containerStyle={{
										height: 40,
										backgroundColor: '#fff',
										marginTop: 10,
										width: '95%',
										borderWidth: 1,
										borderColor: '#d3d3d3'
									}}
									inputStyle={{ fontSize: 14, fontFamily: 'SFProDisplay-Regular' }}
									placeholderTextColor="#d5d5d5"
									inputContainerStyle={{ borderBottomWidth: 0 }}
									autoCapitalize="none"
									underlineColorAndroid="transparent"
									onChangeText={(expiryY) => this.setState({ expiryY })}
									value={this.state.expiryY != null ? this.state.expiryY.toString() : ''}
									maxLength={4}
									type="password"
									onBlur={this.checkYear.bind(this)}
									keyboardType="number-pad"
									textContentType="newPassword"
									placeholder={asyncLanguage == 'fr' ? French.EXPIRY_YEAR : English.EXPIRY_YEAR}
								/>
							</View>
							<View style={{ width: '50%' }}>
								<Text style={{ marginTop: 10, color: '#6A6766', fontFamily: 'Roboto' }}>CVC</Text>
								<Text style={{ fontSize: 10, color: '#6A6766', fontFamily: 'Roboto' }}>***</Text>

								<Input
									containerStyle={{
										height: 40,
										width: '100%',
										backgroundColor: '#fff',
										marginTop: 10,
										borderWidth: 1,
										borderColor: '#d3d3d3'
									}}
									placeholderTextColor="#d5d5d5"

									inputStyle={{ fontSize: 14, fontFamily: 'SFProDisplay-Regular' }}
									inputContainerStyle={{ borderBottomWidth: 0 }}
									autoCapitalize="none"
									underlineColorAndroid="transparent"
									onChangeText={(cvv) => this.setState({ cvv })}
									value={this.state.cvv}
									type="password"
									keyboardType="number-pad"
									maxLength={3}
									textContentType="newPassword"
									placeholder="CVC"
								/>
							</View>
						</View>
					</View>
				</ScrollView>
				<TouchableOpacity style={{ height: 50, width: '90%', marginBottom: 20 }} onPress={() => this.onSubmit()}>
					<LinearGradient
						colors={['#FF984C', '#F56464']}
						start={{ x: 0, y: 1 }}
						end={{ x: 2, y: 2 }}
						locations={[0, 0.5]}
						style={styles.linearGradients}
					>
						<Text style={{ color: '#fff', fontSize: 16, lineHeight: 19, fontFamily: 'SFProDisplay-Regular' }}>{asyncLanguage == 'fr' ? French.SUBSCRIPION : English.SUBSCRIPION}</Text>
					</LinearGradient>
				</TouchableOpacity>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		// backgroundColor: '#F3F3F3'
	},
	textView: {
		justifyContent: 'center',
		padding: 10
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
	signUpButtonStyle: {
		backgroundColor: '#f68736',
		// borderColor:'#FB9A05',
		// borderWidth:1,
		borderWidth: 0,
		marginBottom: 20,
		marginTop: 20,
		borderRadius: 3,
		height: 50
	},
	visa: {
		width: '90%',
		alignItems: 'flex-start'
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
	loader: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	linearGradient: {
		width: '90%',
		height: 200,
		borderRadius: 5,
		justifyContent: 'center',
		marginTop: 10
	},
	participateBox: {
		backgroundColor: '#fff',
		borderRadius: 5,
		width: '90%',
		elevation: 5,
		alignItems: 'center',
		zIndex: 2,
		marginTop: -20,
		paddingVertical: 10
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
		color: '#fff'
	},
	verticalBorder: {
		height: 70,
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
		borderRadius: 5
	},
	productImg: {
		width: 60,
		height: 120,
		marginLeft: 40
	},
	productTxtBox: {
		marginLeft: 10
	},
	productPrice: {
		color: '#FB9A05',
		fontSize: 18,
		fontWeight: 'bold',
		marginTop: 10,
		textAlign: 'left'
	},
	productName: {
		color: '#000',
		fontSize: 14,
		marginTop: 10
	},
	productDes: {
		fontSize: 12,
		marginTop: 5
	},
	textFieldContainer: {
		width: '90%',
		marginTop: 10
	}
});
const mapStateToProps = ({ auth }) => {
	const { language, loading } = auth;
	return { language, loading };
};

export default connect(mapStateToProps, { signupUser })(NonAuthPayment);

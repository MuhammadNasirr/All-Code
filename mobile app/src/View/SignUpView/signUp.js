import React, { Component } from 'react';
import { StyleSheet, View, Keyboard, KeyboardAvoidingView, Text, Platform, Linking, AsyncStorage, TouchableOpacity, Image, Alert } from 'react-native';
import { Button, CheckBox } from 'react-native-elements';
import { Input, Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { signupUser } from '../../actions';
import { ScrollView } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { AppLogo } from '../../Components/svg';
import { Header } from '../../Components';
import Modal from 'react-native-modal';
import { fireBase } from '../../firebase/firebase';
import English from "../../en"
import French from "../../fr"
import star from '../../assets/images/star.png';
import Geocoder from 'react-native-geocoder';
Geocoder.apiKey = 'AIzaSyDy_-t7hJN3sO8gCbC33akqZ5dk2_3nH18';
const homePlace = { description: 'Home', geometry: { location: { lat: 48.8152937, lng: 2.4597668 } } };
const workPlace = { description: 'Work', geometry: { location: { lat: 48.8496818, lng: 2.2940881 } } };
var emailcheck = ''
class SignUp extends Component {
	static navigationOptions = {
		header: null
	};

	constructor(props) {
		super(props);
		this.state = {
			firstName: '',
			email: '',
			affiliationCode: '',
			myAffiliation: '',
			location: '',
			password: '',
			asyncLanguage: null,
			rePassword: '',
			profilePicURL: '',
			modalVisible: false,
			modal2: false,
			lat: null,
			lng: null,
			showPass: false,
			showRePass: false,
			checkpassword: false,
			codeMatched: false,
			policyChecked: false,
			policyModal: false,
			codeLength: false,
			emailValid: false,
			invalidPass: false,
		};
	}
	async componentDidMount() {
		this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
		AsyncStorage.getItem('language').then(a => {
			this.setState({ asyncLanguage: a })
			console.warn(a, "check async props")
		})
		await this.getCordinates();
	}

	getCordinates = () => {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				this.setState({ lat: position.coords.latitude, lng: position.coords.longitude });
				this.getLocation();
			},
			// (error) => Alert.alert(error.message),
			{ enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
		);
	};

	getLocation = async () => {
		// console.warn('state', this.state.lat);
		const res = await Geocoder.geocodePosition({
			lat: this.state.lat,
			lng: this.state.lng
		});
		// console.warn('ress***', res);
		const add = res[0].streetName + ',' + res[0].country;
		this.setState({ location: add });
	};

	componentWillReceiveProps(newProps) {
		// console.warn('newprops?', newProps);
		// console.warn('modal', this.state.location);
		// if (newProps.navigation.state.params) {
		// 	if (newProps.navigation.state.params.payment == true) {
		// 		this.setState({ modal2: !this.state.modal2 })
		// 	}
		// }
		AsyncStorage.getItem('language').then(a => {
			this.setState({ asyncLanguage: a })
			console.warn(a, "check async props")
		})
		if (newProps.language) {
			this.setState({ asyncLanguage: newProps.language })
		}
		// if (newProps.user == 2) {
		// 	this.setState({ modalVisible: true });
		// }
	}

	onSubmit = () => {
		console.warn("ce")
		this.checkEmail()
		// const { firstName, email, affiliationCode, myAffiliation, location, password, profilePicURL } = this.state;
		// this.props.signupUser({ firstName, email, affiliationCode, myAffiliation, location, password, profilePicURL });
	};

	makePayment = () => {
		const { firstName, email, affiliationCode, myAffiliation, location, password, profilePicURL } = this.state;
		const currentUser = { firstName, email, affiliationCode, myAffiliation, location, password, profilePicURL }
		this.setState({ modalVisible: !this.state.modalVisible });
		this.props.navigation.navigate('NonAuthPayment', { currentUser: currentUser });
	};
	setLocation(location) {
		this.setState({ location: location });
	}
	componentWillUnmount() {
		this.keyboardDidHideListener.remove();
	}
	checkEmail() {
		let me = this
		const { asyncLanguage, email } = me.state;
		emailcheck
		console.warn(emailcheck)
		const regex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+[^<>()\.,;:\s@\"]{2,})$/
		if (regex.test(email)) {
			console.log('done')
			if (email != '') {
				var leadsRef = fireBase.database().ref('Users');
				leadsRef.once('value', function (snapshot) {
					var arr = Object.values(snapshot.val());
					const found = arr.some((el) => el.email == email);
					const foundUser = arr.some((el) => el.email == email && el.isDeleted == "true");
					console.warn(found)
					console.warn('foundUser', foundUser)
					if (!foundUser) {
						if (!found) {
							console.warn('s')
							me.setState({ emailValid: true, modalVisible: true })
							// this.setState({ });
						} else {
							alert(asyncLanguage == "fr" ? French.ERROR_MSG_ALREADY_USED_EMAIL : English.ERROR_MSG_ALREADY_USED_EMAIL)
							me.setState({ email: '' })
						}
					} else {
						alert("This user is not allow to sign up!")
					}
				});
			} else {
				me.setState({ email: '' })
			}
		} else {
			alert(asyncLanguage == "fr" ? French.INVALID_EMAIL : English.INVALID_EMAIL)
			me.setState({ email: '' })
		}
	}
	checkAffiliation = (myAffiliation) => {
		const me = this;
		if (myAffiliation.length < 4) {
			this.setState({ codeLength: true })
		} else this.setState({ codeLength: false })
		me.setState({ myAffiliation: myAffiliation })
		if (myAffiliation != '') {
			var leadsRef = fireBase.database().ref('Users');
			leadsRef.once('value', function (snapshot) {
				var arr = Object.values(snapshot.val());
				// var	arr = me.snapshotToArray(snapshot.val())
				const found = arr.some((el) => el.myAffiliation == myAffiliation);
				if (!found) {
					me.setState({ codeMatched: false })

				} else {
					me.setState({ codeMatched: true })

				}
			});
		} else {
			console.log('you must enter code');
		}
	};

	checkPass() {
		let me = this;
		const { password } = this.state;
		const regex = /^.{6,}$/
		if (regex.test(password)) {
			if (password != '') {
				this.setState({ invalidPass: false })
			} else {
				me.setState({ password: '' })
			}
		} else {
			me.setState({ invalidPass: true })
		}
	}

	render() {
		emailcheck = this.state.email
		// console.warn(this.state.email)
		const { firstName, emailValid, email, affiliationCode, codeMatched, myAffiliation, location, password, asyncLanguage, invalidPass } = this.state;
		// if (this.props.loading)
		// 	return (
		// 		<View style={styles.loader}>
		// 			<ActivityIndicator size="large" color="#FF984C" />
		// 		</View>
		// 	);
		return (
			<View style={{ height: '100%', backgroundColor: '#F9F7F7', width: '100%', alignItems: 'center' }}>
				<Header
					title={asyncLanguage == "fr" ? French.SIGN_UP : English.SIGN_UP}
					rightImg={AppLogo}
					iconleft={true}
					signUpRightIcon={true}
					navigation={this.props.navigation}
				/>
				<KeyboardAvoidingView style={{ flex: 1, width: '100%' }} behavior={Platform.OS == 'ios' ? "padding" : null}>
					<ScrollView style={{ height: '100%', width: '100%' }}>
						<View style={styles.container}>
							<View style={styles.textFieldContainer}>
								<Text style={{ marginTop: 10, color: '#6A6766', fontFamily: 'SFProDisplay-Regular' }}>
									{asyncLanguage == "fr" ? French.FIRST_NAME : English.FIRST_NAME}
								</Text>
								<Input
									containerStyle={styles.input}
									inputStyle={{ fontSize: 14, paddingTop: 10, fontFamily: 'SFProDisplay-Regular' }}
									inputContainerStyle={{ borderBottomWidth: 0 }}
									underlineColorAndroid="transparent"
									placeholderTextColor="#d5d5d5"
									onChangeText={(firstName) => this.setState({ firstName })}
									value={this.state.firstName}
									keyboardType="default"
									placeholder={asyncLanguage == "fr" ? French.FIRST_NAME : English.FIRST_NAME}
								/>
							</View>
							<View style={styles.textFieldContainer}>
								<Text style={{ marginTop: 10, color: '#6A6766', fontFamily: 'SFProDisplay-Regular' }}>
									Email
							</Text>
								<Input
									containerStyle={styles.input}
									inputStyle={{ fontSize: 14, paddingTop: 10, fontFamily: 'SFProDisplay-Regular' }}
									placeholderTextColor="#d5d5d5"
									inputContainerStyle={{ borderBottomWidth: 0 }}
									underlineColorAndroid="transparent"
									onChangeText={(email) => this.setState({ email })}
									value={this.state.email}
									type="text"
									autoCapitalize="none"
									keyboardType="email-address"
									placeholder="Email"
								// onBlur={this.checkEmail.bind(this)}
								/>
							</View>
							<View style={styles.textFieldContainer}>
								<Text style={{ marginTop: 10, color: '#6A6766', fontFamily: 'SFProDisplay-Regular' }}>
									{asyncLanguage == "fr" ? French.YOUR_AFFILIATION_CODE : English.YOUR_AFFILIATION_CODE}
								</Text>
								<Input
									containerStyle={[styles.input, { borderColor: this.state.codeMatched || this.state.codeLength ? "red" : "#d3d3d3" }]}
									inputStyle={{ fontSize: 14, paddingTop: 10, fontFamily: 'SFProDisplay-Regular' }}
									placeholderTextColor="#d5d5d5"
									inputContainerStyle={{ borderBottomWidth: 0 }}
									underlineColorAndroid="transparent"
									onChangeText={(myAffiliation) => {
										this.setState({ myAffiliation })
										this.checkAffiliation(myAffiliation)
									}}
									onBlur={() => this.checkAffiliation(this.state.myAffiliation)}
									value={this.state.myAffiliation}
									type="text"
									maxLength={4}
									autoCapitalize="none"
									keyboardType="number-pad"
									placeholder={asyncLanguage == "fr" ? French.AFFILIATION_CODE : English.AFFILIATION_CODE}
								/>
								{this.state.codeMatched ?
									<Text style={{ marginTop: 10, color: "red", fontFamily: 'SFProDisplay-Regular' }}>
										{asyncLanguage == "fr" ? French.AFFILIATION_ERROR : English.AFFILIATION_ERROR}
									</Text> : null}
								{this.state.codeLength ?
									<Text style={{ marginTop: 10, color: "red", fontFamily: 'SFProDisplay-Regular' }}>
										{asyncLanguage == "fr" ? French.AFFILIATION_ERROR_LENGTH : English.AFFILIATION_ERROR_LENGTH}
									</Text> : null}
							</View>
							<View style={styles.textFieldContainer}>
								<Text style={{ marginTop: 10, color: '#6A6766', fontFamily: 'SFProDisplay-Regular' }}>
									{asyncLanguage == "fr" ? French.LOCATION : English.LOCATION}
								</Text>
								<GooglePlacesAutocomplete
									placeholder={asyncLanguage == "fr" ? French.SEARCH : English.SEARCH}
									minLength={2}
									autoFocus={false}
									returnKeyType={'search'}
									keyboardAppearance={'light'}
									listViewDisplayed={false}
									fetchDetails={true}
									renderDescription={(row) => row.description}
									onPress={(data) => {
										this.setLocation(data.description);
									}}
									getDefaultValue={() => ''}
									query={{
										key: 'AIzaSyC-1dUdU_nJ8N4Zh3ijPzLF7MANu6sIkKQ',
										language: 'en',
										types: '(cities)'
									}}
									styles={{
										container: {
											// height:50
										},
										textInputContainer: {
											height: 50,
											marginTop: 10,
											margin: 0,
											width: '100%',
											backgroundColor: '#fff',
											color: '#000',
											borderWidth: 1,
											borderRadius: 3,
											borderColor: '#d3d3d3'
										},
										textInput: {
											marginLeft: 0,
											marginRight: 0,
											margin: 0,
											height: 33,
											color: '#000',
											fontSize: 14,
											fontFamily: 'SFProDisplay-Regular'
										},
										description: {
											fontWeight: 'normal'
										},
										predefinedPlacesDescription: {
											color: '#d5d5d5',
											fontWeight: 'normal'
										}
									}}
									currentLocation={false}
									currentLocationLabel="Current location"
									nearbyPlacesAPI="GooglePlacesSearch"
									GoogleReverseGeocodingQuery={{}}
									GooglePlacesSearchQuery={{
										rankby: 'distance',
										type: 'cafe'
									}}
									GooglePlacesDetailsQuery={{
										fields: 'formatted_address'
									}}
									filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']}
									debounce={200}
								/>
								{/* <Input
								containerStyle={styles.input}
								inputStyle={{ fontSize: 14, paddingTop: 10, fontFamily: 'SFProDisplay-Regular' }}
								placeholderTextColor="#d5d5d5"
								inputContainerStyle={{ borderBottomWidth: 0 }}
								underlineColorAndroid="transparent"
								onChangeText={(location) => this.setState({ location })}
								value={this.state.location}
								type="text"
								disable={true}
								keyboardType="default"
								placeholder="Location"
							/> */}
							</View>
							<View style={styles.textFieldContainer}>
								<Text style={{ marginTop: 10, color: '#6A6766', fontFamily: 'SFProDisplay-Regular' }}>
									{asyncLanguage == "fr" ? French.PASSWORD : English.PASSWORD}
								</Text>
								<Input
									containerStyle={styles.input}
									inputStyle={{ fontSize: 14, paddingTop: 10, fontFamily: 'SFProDisplay-Regular' }}
									placeholderTextColor="#d5d5d5"
									inputContainerStyle={{ borderBottomWidth: 0 }}
									underlineColorAndroid="transparent"
									onChangeText={(password) => this.setState({ password })}
									value={this.state.password}
									autoCapitalize="none"
									rightIcon={
										<Icon
											color="#FF984C"
											onPress={() => this.setState({ showPass: !this.state.showPass })}
											name="eye"
											type="entypo"
										/>
									}
									type="password"
									secureTextEntry={this.state.showPass ? false : true}
									keyboardType="default"
									onBlur={this.checkPass.bind(this)}
									textContentType="newPassword"
									placeholder={asyncLanguage == "fr" ? French.PASSWORD : English.PASSWORD}
								/>
							</View>
							{
								invalidPass ?
									<View style={[styles.textFieldContainer, { marginVertical: 10 }]}>
										<Text style={{ color: '#FF984C' }}>{asyncLanguage == "fr" ? French.Password_at_least_6_characters : English.Password_at_least_6_characters}</Text>
									</View> : null
							}
							<View style={styles.textFieldContainer}>
								<Input
									containerStyle={styles.input}
									inputStyle={{ fontSize: 14, paddingTop: 10, fontFamily: 'SFProDisplay-Regular' }}
									placeholderTextColor="#d5d5d5"
									inputContainerStyle={{ borderBottomWidth: 0 }}
									underlineColorAndroid="transparent"
									onChangeText={(rePassword) => this.setState({ rePassword })}
									value={this.state.rePassword}
									onBlur={() => this.state.password != this.state.rePassword ? this.setState({ checkpassword: true }) : this.setState({ checkpassword: false })}
									rightIcon={
										<Icon
											color="#FF984C"
											onPress={() => this.setState({ showRePass: !this.state.showRePass })}
											name="eye"
											type="entypo"
										/>
									}
									type="password"
									autoCapitalize="none"
									secureTextEntry={this.state.showRePass ? false : true}
									keyboardType="default"
									textContentType="newPassword"
									placeholder={asyncLanguage == "fr" ? French.RE_PASSWORD : English.RE_PASSWORD}
								/>
							</View>
							{this.state.checkpassword && (
								<View style={[styles.textFieldContainer, { marginVertical: 10 }]}>
									<Text style={{ color: '#FF984C' }}>{asyncLanguage == "fr" ? French.PASSWORD_ERROR : English.PASSWORD_ERROR}</Text>
								</View>
							)}
						</View>
					</ScrollView>
				</KeyboardAvoidingView>
				<View style={{ width: '90%', bottom: 10, marginTop: 10 }}>
					<View style={[{ width: '100%', marginTop: 10, flexDirection: 'row', alignItems: 'center' }]}>
						<CheckBox checkedColor={"#FF984C"} containerStyle={{ width: 30, marginLeft: -10 }} onPress={() => this.setState({ policyChecked: !this.state.policyChecked })} checked={this.state.policyChecked} />
						<TouchableOpacity onPress={() => Linking.openURL(asyncLanguage == "fr" ? 'http://www.gimonii.com/policies/fr' : 'http://www.gimonii.com/policies/en')}>
							<Text style={{ fontFamily: 'SFProDisplay-Regular', width: '60%' }}>
								{asyncLanguage == "fr" ? French.POLICY : English.POLICY}
							</Text>
						</TouchableOpacity>
					</View>
					{firstName && email && myAffiliation && codeMatched == false && !this.state.codeLength && location && password && this.state.policyChecked == true && !invalidPass && this.state.rePassword && password == this.state.rePassword ?
						<TouchableOpacity style={{ height: 60, width: '100%' }} onPress={this.onSubmit}>
							<LinearGradient
								colors={['#FF984C', '#F56464']}
								start={{ x: 0, y: 1 }}
								end={{ x: 2, y: 2 }}
								locations={[0, 0.5]}
								style={styles.linearGradient}
							>
								<Text style={{ color: '#fff', fontSize: 16, fontFamily: 'SFProDisplay-Regular' }}>
									{asyncLanguage == "fr" ? French.CREATE_ACCOUNT : English.CREATE_ACCOUNT}
								</Text>
							</LinearGradient>
						</TouchableOpacity> :
						<TouchableOpacity disabled style={[{ height: 60, width: '100%' }]}>
							<LinearGradient
								colors={['#FF984C', '#F56464']}
								start={{ x: 0, y: 1 }}
								end={{ x: 2, y: 2 }}
								locations={[0, 0.5]}
								style={[styles.linearGradient, { opacity: 0.5 }]}
							>
								<Text style={{ color: '#fff', fontSize: 16, fontFamily: 'SFProDisplay-Regular' }}>
									{asyncLanguage == "fr" ? French.CREATE_ACCOUNT : English.CREATE_ACCOUNT}
								</Text>
							</LinearGradient>
						</TouchableOpacity>
					}
				</View>
				<Modal
					animationType="slide"
					transparent={false}
					style={{ backgroundColor: '#FEF2D1', margin: 0 }}
					visible={this.state.modalVisible}
					onRequestClose={() => {
						Alert.alert(asyncLanguage == "fr" ? French.MODAL_CLOSED : English.MODAL_CLOSED);
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
									color: '#F88735',
									fontSize: 18,
									textAlign: 'center',
									marginTop: 20,
									width: '70%',
									fontFamily: 'SFProDisplay-Regular'
								}}
							>
								{asyncLanguage == "fr" ? French.NEED_TO_PARTICIPATE : English.NEED_TO_PARTICIPATE}
							</Text>
						</View>
						<TouchableOpacity
							onPress={() => {
								this.makePayment();
							}}
							style={[styles.textFieldContainer, { marginLeft: 20, marginBottom: 0 }]}
						>
							<LinearGradient
								colors={['#FF984C', '#F56464']}
								start={{ x: 0, y: 1 }}
								end={{ x: 2, y: 2 }}
								locations={[0, 0.5]}
								style={styles.linearGradient}
							>
								<Text
									style={{
										color: '#fff',
										fontSize: 16,
										lineHeight: 19,
										fontFamily: 'SFProDisplay-Regular'
									}}
								>
									{asyncLanguage == "fr" ? French.PAY_SUBCIPTION : English.PAY_SUBCIPTION}
								</Text>
							</LinearGradient>
						</TouchableOpacity>
					</View>
				</Modal>
				<Modal
					animationType="slide"
					transparent={false}
					style={{ backgroundColor: '#FEF2D1', margin: 0 }}
					visible={this.state.policyModal}
					onRequestClose={() => {
						Alert.alert(asyncLanguage == "fr" ? French.MODAL_CLOSED : English.MODAL_CLOSED);
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
								this.setState({ policyModal: !this.state.policyModal });
								// this.setModalVisible(!this.state.modalVisible);
							}}
						>
							<Icon name={'cross'} containerStyle={{ alignItems: 'flex-start' }} type="entypo" />
						</TouchableOpacity>
						<View style={styles.modal}>
							<Text
								style={{
									color: '#F88735',
									fontSize: 18,
									textAlign: 'center',
									marginTop: 20,
									width: '70%',
									fontFamily: 'SFProDisplay-Regular'
								}}
							>
								{asyncLanguage == "fr" ? French.NEED_TO_PARTICIPATE : English.NEED_TO_PARTICIPATE}
							</Text>
						</View>
						<TouchableOpacity
							onPress={() => {
								this.setState({ policyModal: !this.state.policyModal });
							}}
							style={[styles.textFieldContainer, { marginLeft: 20, marginBottom: 0 }]}
						>
							<LinearGradient
								colors={['#FF984C', '#F56464']}
								start={{ x: 0, y: 1 }}
								end={{ x: 2, y: 2 }}
								locations={[0, 0.5]}
								style={styles.linearGradient}
							>
								<Text
									style={{
										color: '#fff',
										fontSize: 16,
										lineHeight: 19,
										fontFamily: 'SFProDisplay-Regular'
									}}
								>
									{asyncLanguage == "fr" ? French.AGREED : English.AGREED}
								</Text>
							</LinearGradient>
						</TouchableOpacity>
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
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#F9F7F7',
		height: '100%'
	},
	input: {
		height: 50,
		marginTop: 10,
		width: '100%',
		backgroundColor: '#fff',
		color: '#000',
		borderWidth: 1,
		borderRadius: 3,
		borderColor: '#d3d3d3'
	},
	linearGradient: {
		// bottom: 16,
		borderRadius: 4,
		marginTop: 10,
		// width:"80%",
		alignItems: 'center',
		height: 50,
		justifyContent: 'center'
	},
	buttonStyle: {
		backgroundColor: '#f68736',
		borderRadius: 3,
		borderWidth: 0,
		height: 50
		// marginBottom: 20
	},
	loader: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	button: {
		fontSize: 15,
		color: '#fff',
		textAlign: 'center',
		marginTop: 20,
		backgroundColor: 'transparent'
	},
	textFieldContainer: {
		width: '90%'
		// marginTop: 10
	},
	textField: {
		color: '#000',
		backgroundColor: '#fff',
		fontSize: 16,
		paddingVertical: 5,
		paddingHorizontal: 0,
		textAlign: 'center'
	},
	textBoxWrapper: {
		marginVertical: 3,
		alignItems: 'center'
	},
	modal: {
		flexDirection: 'column',
		justifyContent: 'space-between',
		marginLeft: 20,
		alignItems: 'center',
		width: '90%'
	},
	participateimg: {
		width: 150,
		height: 150,
		marginTop: 30
	},
	paysubHead: {
		fontFamily: 'SFProDisplay-Regular',
		fontSize: 16,
		width: '90%',
		lineHeight: 24,
		textAlign: 'center'
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
	linearGradients: {
		// bottom: 16,
		borderRadius: 4,
		marginTop: 10,
		// width:"80%",
		alignItems: 'center',
		height: 50,
		justifyContent: 'center'
	}
});

const mapStateToProps = ({ auth }) => {
	const { loading, user, language } = auth;
	return { loading, user, language };
};

export default connect(mapStateToProps, {
	signupUser
})(SignUp);
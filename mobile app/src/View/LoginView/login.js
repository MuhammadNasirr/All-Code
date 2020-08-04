import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, AsyncStorage, ActivityIndicator } from 'react-native';
import { Button, Input, Icon } from 'react-native-elements';
// import logo from '../../assets/images/logo.png';
import { loginUser, forgetPassword, changeLanguage } from '../../actions';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import { Header } from '../../Components';
// import logo1 from '../../assets/svg/logo.svg';
import Modal from 'react-native-modal';
import { withNavigationFocus } from 'react-navigation';
import English from "../../en"
import French from "../../fr"
// import axios from 'axios';

class Login extends Component {
	static navigationOptions = {
		header: null
	};
	constructor(props) {
		super(props);
		this.state = { text: '', asyncLanguage: null, Pass: '', email: '', ForgotModal: false, invalidPass: false };
	}

	componentDidMount() {
		AsyncStorage.getItem('userData').then((user) => {
			if (user != null) {
				this.props.navigation.navigate('Main');
			}
		});
		AsyncStorage.getItem('language').then(a => {
			this.setState({ asyncLanguage: a })
			console.warn(a, "check async props")
		})
	}

	componentWillReceiveProps(newProps) {
		AsyncStorage.getItem('language').then(a => {
			this.setState({ asyncLanguage: a })
			console.warn(a, "check async Login")
		})
		if (newProps.language) {
			this.setState({ asyncLanguage: newProps.language })
		}
		// console.warn('newprops', newProps.user);
		if (newProps.user == 1) {
			this.props.navigation.navigate('HomeInner');
		}
		if (newProps.forgetLink == true) {
			this.setState({ ForgotModal: false });
			// this.props.navigation.navigate('LoginScreen');
		}
	}
	onSubmitForgot = () => {
		this.props.forgetPassword(this.state.email);
		this.setState({ ForgotModal: false });
	};

	onSubmit = () => {
		const { text, Pass, invalidPass } = this.state;
		if (text && Pass && !invalidPass) {
			this.props.loginUser(text, Pass);
			this.setState({ text: '', Pass: '' });
		} else if (text && Pass.length < 6 && invalidPass) {
			this.setState({ invalidPass: true })
		}
		else {
			alert(asyncLanguage == "fr" ? French.ERROR_EMPTY_FIELD : English.ERROR_EMPTY_FIELD)
		}
	};
	// deleteStripe = () => {
	// 	let uid = "Do1GUH6WkfgKGNBHa4uI03XEEM43";
	// 	let body = {
	// 		uid: uid
	// 	}
	// 	axios.post('http://www.gimonii.com/api/cancelsub/', body)
	// 		.then((res) => {
	// 			console.warn("stripe subs delete response", res)
	// 		}).catch(err => {
	// 			console.warn("error", err)
	// 		})
	// };

	checkPass() {
		let me = this;
		const { Pass } = this.state;
		const regex = /^.{6,}$/
		if (regex.test(Pass)) {
			if (Pass != '') {
				this.setState({ invalidPass: false })
			} else {
				me.setState({ Pass: '' })
			}
		} else {
			me.setState({ invalidPass: true })
		}
	}

	render() {
		const { asyncLanguage, invalidPass } = this.state;

		return (
			<View style={styles.container}>
				<Header
					title={asyncLanguage == "fr" ? French.SIGN_IN : English.SIGN_IN}
					iconleft={true}
					navigation={this.props.navigation}
					rightImg={require('../../assets/images/logo.png')}
					signUpRightIcon={true}
				/>
				{this.props.loading ?

					<View style={styles.loader}>
						<ActivityIndicator size="large" color="#F56464" />
					</View>
					:
					<ScrollView style={{ width: '100%', height: '100%' }}>
						<View style={{ width: '100%', height: '100%', alignItems: 'center', marginBottom: 20 }}>
							<View style={styles.textFieldContainer}>
								<Text style={{ marginTop: 10, color: '#6A6766', fontFamily: 'SFProDisplay-Regular' }}>Email</Text>
								<Input
									containerStyle={{
										height: 50,
										marginTop: 10,
										width: '100%',
										backgroundColor: '#fff',
										color: '#000',
										borderWidth: 1,
										borderRadius: 3,
										borderColor: '#d3d3d3'
									}}
									inputStyle={{ fontSize: 14, paddingTop: 10, fontFamily: 'SFProDisplay-Regular' }}
									autoCapitalize="none"
									inputContainerStyle={{ borderBottomWidth: 0 }}
									underlineColorAndroid="transparent"
									placeholderTextColor="#d5d5d5"
									onChangeText={(text) => this.setState({ text })}
									value={this.state.text}
									keyboardType="email-address"
									placeholder="Email"
								/>
							</View>
							<View style={styles.textFieldContainer}>
								<Text style={{ marginTop: 10, color: '#6A6766', fontFamily: 'SFProDisplay-Regular' }}>
									{asyncLanguage == "fr" ? French.PASSWORD : English.PASSWORD}
								</Text>
								<Input
									containerStyle={{
										height: 50,
										marginTop: 10,
										width: '100%',
										backgroundColor: '#fff',
										color: '#000',
										borderWidth: 1,
										borderRadius: 3,
										borderColor: '#d3d3d3'
									}}
									inputStyle={{ fontSize: 14, paddingTop: 10, fontFamily: 'SFProDisplay-Regular' }}
									placeholderTextColor="#d5d5d5"
									inputContainerStyle={{ borderBottomWidth: 0 }}
									secureTextEntry
									autoCapitalize="none"
									underlineColorAndroid="transparent"
									onChangeText={(Pass) => this.setState({ Pass })}
									value={this.state.Pass}
									onBlur={this.checkPass.bind(this)}
									type="password"
									keyboardType="default"
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
								<TouchableOpacity style={{ width: '50%' }} onPress={() => this.setState({ ForgotModal: true })}>
									<Text style={[{ marginTop: 10, color: '#f68736', textAlign: 'left' }]}>
										{asyncLanguage == "fr" ? French.FORGOT_PASSWORD : English.FORGOT_PASSWORD}
									</Text>
								</TouchableOpacity>
							</View>
							{/* <View style={styles.textFieldContainer}> */}
							<TouchableOpacity onPress={this.onSubmit} style={[styles.textFieldContainer]}>
								<LinearGradient
									colors={['#FF984C', '#F56464']}
									start={{ x: 0, y: 1 }}
									end={{ x: 2, y: 2 }}
									locations={[0, 0.5]}
									style={styles.linearGradient}
								>
									<Text
										style={{ color: '#fff', fontSize: 16, lineHeight: 19, fontFamily: 'SFProDisplay-Regular' }}
									>
										{asyncLanguage == "fr" ? French.NEXT : English.NEXT}
									</Text>
								</LinearGradient>
							</TouchableOpacity>
							<View style={styles.textFieldContainer}>
								<Button
									title={asyncLanguage == "fr" ? French.SIGN_UP : English.SIGN_UP}

									type="outline"
									onPress={() => this.props.navigation.navigate('SignUpScreen')}
									titleStyle={{ color: '#F88735', fontSize: 16, fontFamily: 'SFProDisplay-Regular' }}
									buttonStyle={styles.signUpButtonStyle}
								/>
							</View>
							{/* <View style={styles.textFieldContainer}>
								<Button
									title={"Cancel"}
									type="outline"
									onPress={() => this.deleteStripe()}
									titleStyle={{ color: '#F88735', fontSize: 16, fontFamily: 'SFProDisplay-Regular' }}
									buttonStyle={styles.signUpButtonStyle}
								/>
							</View> */}
						</View>
					</ScrollView>}
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
					isVisible={this.state.ForgotModal}
				>
					<View
						style={{
							backgroundColor: '#fff',
							height: 280,
							alignItems: 'center',
							justifyContent: 'space-around',
							borderRadius: 5,
							padding: 20,
							paddingTop: 10
						}}
					>
						<View
							style={{
								flexDirection: 'row',
								// alignItems: 'center',
								justifyContent: 'space-between',
								width: '100%'
							}}
						>
							<Text style={{ width: '80%' }}>
								{asyncLanguage == "fr" ? French.FORGOT_MESSAGE : English.FORGOT_MESSAGE}
							</Text>
							<Icon
								containerStyle={{ marginLeft: -20 }}
								onPress={() => this.setState({ ForgotModal: false })}
								name="cross"
								type="entypo"
								color="#FF984C"
							/>
						</View>
						<Input
							containerStyle={styles.input}
							inputStyle={{ fontSize: 14, paddingTop: 12, fontFamily: 'SFProDisplay-Regular' }}
							placeholderTextColor="#d5d5d5"
							inputContainerStyle={{ borderBottomWidth: 0 }}
							autoCapitalize="none"
							underlineColorAndroid="transparent"
							onChangeText={(email) => this.setState({ email })}
							value={this.state.email}
							type="text"
							keyboardType="email-address"
							placeholder="Email"
						/>
						<TouchableOpacity onPress={this.onSubmitForgot} style={[styles.textFieldContainer, { width: '100%' }]}>
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
									{asyncLanguage == "fr" ? French.VERIFY : English.VERIFY}
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
		justifyContent: 'flex-start',
		alignItems: 'center',
		backgroundColor: '#F9F7F7'
	},
	signUpButtonStyle: {
		backgroundColor: 'transparent',
		borderColor: '#F88735',
		borderWidth: 1,
		// borderWidth: 0,
		fontFamily: 'SFProDisplay-Regular',
		borderRadius: 3,
		height: 50
	},
	button: {
		backgroundColor: '#F88735',
		borderRadius: 3,
		borderWidth: 0,
		height: 50
	},
	input: {
		height: 50,
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
		width: "100%",
		alignItems: 'center',
		height: 50,
		justifyContent: 'center'
	},
	textFieldContainer: {
		width: '90%',
		marginTop: 10
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
	signUpBtn: {
		width: '100%',
		justifyContent: 'flex-end'
	},
	loader: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	}
});

const mapStateToProps = ({ auth }) => {
	const { loading, user, forgetLink, language } = auth;
	return { loading, user, forgetLink, language };
};

export default withNavigationFocus(connect(mapStateToProps, {
	loginUser,
	forgetPassword,
	changeLanguage
})(Login));

import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, AsyncStorage, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-elements';
import { Input, Icon } from 'react-native-elements';
import { changePassword } from '../../actions';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import { Header } from '../../Components';
import English from "../../en"
import French from "../../fr"

class ChangePassword extends Component {
	static navigationOptions = {
		header: null
	};

	constructor(props) {
		super(props);
		this.state = {
			password: '',
			asyncLanguage: null,
			checkpassword: false,
			Confirmpassword: '', Currentpassword: ''
		};
	}
	componentDidMount() {
		AsyncStorage.getItem('language').then(a => {
			this.setState({ asyncLanguage: a })
		})
	}
	componentWillReceiveProps(newProps) {
		AsyncStorage.getItem('language').then(a => {
			this.setState({ asyncLanguage: a })
		})
		if (newProps.language) {
			this.setState({ asyncLanguage: newProps.language })
		}
		if (newProps.user == 1) {
			AsyncStorage.removeItem('userData');
			this.props.navigation.navigate('Auth');
		}
	}

	onSubmit = () => {
		const { password, Confirmpassword, Currentpassword, asyncLanguage } = this.state;
		if (password !== '' || Confirmpassword !== '' || Currentpassword !== '') {
			this.props.changePassword(this.state.password);
			this.setState({ password: '', Currentpassword: '', Confirmpassword: '' });
		} else {
			alert(asyncLanguage == 'fr' ? French.ERROR_EMPTY_FIELD : English.ERROR_EMPTY_FIELD);
		}
	};

	render() {
		const { password, Confirmpassword, Currentpassword, asyncLanguage } = this.state;
		return (
			<View style={styles.container}>
				<Header title={asyncLanguage == 'fr' ? French.PASSWROD : English.PASSWROD} iconleft={true} navigation={this.props.navigation} />
				<ScrollView style={{ width: '90%' }}>
					<View style={{ width: '100%', marginBottom: 20, alignItems: 'center' }}>
						<View style={styles.textFieldContainer}>
							<Text style={{ fontFamily: 'Roboto', color: '#656970' }}>{asyncLanguage == 'fr' ? French.CURRENT_PASSWROD : English.CURRENT_PASSWROD}</Text>
							<Input
								containerStyle={styles.input}
								inputStyle={{ fontSize: 14, paddingTop: 12 }}
								placeholderTextColor="#d5d5d5"
								inputContainerStyle={{ borderBottomWidth: 0 }}
								autoCapitalize="none"
								underlineColorAndroid="transparent"
								onChangeText={(Currentpassword) => this.setState({ Currentpassword })}
								value={this.state.Currentpassword}
								type="password"
								secureTextEntry
								keyboardType="email-address"
								placeholder={asyncLanguage == 'fr' ? French.CURRENT_PASSWROD : English.CURRENT_PASSWROD}
							/>
						</View>
						<View style={styles.textFieldContainer}>
							<Text style={{ fontFamily: 'Roboto', color: '#656970' }}>{asyncLanguage == 'fr' ? French.NEW_PASSWROD : English.NEW_PASSWROD}</Text>
							<Input
								containerStyle={styles.input}
								inputStyle={{ fontSize: 14, paddingTop: 12 }}
								placeholderTextColor="#d5d5d5"
								inputContainerStyle={{ borderBottomWidth: 0 }}
								autoCapitalize="none"
								underlineColorAndroid="transparent"
								onChangeText={(password) => this.setState({ password })}
								value={this.state.password}
								type="password"
								secureTextEntry
								keyboardType="email-address"
								placeholder={asyncLanguage == 'fr' ? French.NEW_PASSWROD : English.CURRENT_PASSWROD}
							/>
						</View>
						<View style={styles.textFieldContainer}>
							<Text style={{ fontFamily: 'Roboto', color: '#656970' }}>{asyncLanguage == 'fr' ? French.CONFIRM_NEW_PASSWROD : English.CONFIRM_NEW_PASSWROD}</Text>
							<Input
								containerStyle={styles.input}
								inputStyle={{ fontSize: 14, paddingTop: 12 }}
								placeholderTextColor="#d5d5d5"
								inputContainerStyle={{ borderBottomWidth: 0 }}
								autoCapitalize="none"
								underlineColorAndroid="transparent"
								onChangeText={(Confirmpassword) => this.setState({ Confirmpassword })}
								value={this.state.Confirmpassword}
								onBlur={() => this.state.password != this.state.Confirmpassword ? this.setState({ checkpassword: true }) : this.setState({ checkpassword: false })}
								type="password"
								secureTextEntry
								keyboardType="email-address"
								placeholder={asyncLanguage == 'fr' ? French.CONFIRM_NEW_PASSWROD : English.CONFIRM_NEW_PASSWROD}
							/>
						</View>
						{this.state.checkpassword && (
							<View style={[styles.textFieldContainer, { marginVertical: 10 }]}>
								<Text style={{ color: '#FF984C' }}>{asyncLanguage == "fr" ? French.PASSWORD_ERROR : English.PASSWORD_ERROR}</Text>
							</View>
						)}
					</View>
				</ScrollView>
				{
					password && Confirmpassword && Currentpassword && password == Confirmpassword ?
						<TouchableOpacity onPress={this.onSubmit} style={[styles.textFieldContainer, { bottom: 20, width: '90%' }]}>
							{this.props.loading ? (
								<ActivityIndicator size="large" color="#FF984C" />
							) : (
									<LinearGradient
										colors={['#FF984C', '#F56464']}
										start={{ x: 0, y: 1 }}
										end={{ x: 2, y: 2 }}
										locations={[0, 0.5]}
										style={styles.linearGradient}
									>
										<Text style={{ color: '#fff' }}>{asyncLanguage == 'fr' ? French.UPDATE_NEW_PASSWROD : English.UPDATE_NEW_PASSWROD}</Text>
									</LinearGradient>
								)}
						</TouchableOpacity>
						:
						<TouchableOpacity disabled style={[styles.textFieldContainer, { bottom: 20, width: '90%' }]}>
							{this.props.loading ? (
								<ActivityIndicator size="large" color="#FF984C" />
							) : (
									<LinearGradient
										colors={['#FF984C', '#F56464']}
										start={{ x: 0, y: 1 }}
										end={{ x: 2, y: 2 }}
										locations={[0, 0.5]}
										style={[styles.linearGradient, { opacity: 0.5 }]}
									>
										<Text style={{ color: '#fff' }}>{asyncLanguage == 'fr' ? French.UPDATE_NEW_PASSWROD : English.UPDATE_NEW_PASSWROD}</Text>
									</LinearGradient>
								)}
						</TouchableOpacity>
				}

			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		// height:'100%',
		flexDirection: 'column',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: '#fff'
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
	input: {
		height: 50,
		width: '100%',
		backgroundColor: '#fff',
		color: '#000',
		borderWidth: 1,
		borderRadius: 3,
		borderColor: '#d3d3d3',
		marginTop: 5
	},
	buttonStyle: {
		backgroundColor: '#f68736',
		borderRadius: 3,
		borderWidth: 0,
		height: 50
	},
	textFieldContainer: {
		width: '100%',
		marginTop: 10,
	},
	emailText: {
		textAlign: 'center',
		fontSize: 14,
		marginTop: -100,
		marginBottom: 50
	}
});

const mapStateToProps = ({ auth }) => {
	const { user, loading, language } = auth;
	return { user, loading, language };
};

export default connect(mapStateToProps, {
	changePassword
})(ChangePassword);

import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-elements';
import { Input, Icon } from 'react-native-elements';
import { forgetPassword } from '../../actions';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import { Header } from '../../Components'

class PassRecovery extends Component {
	static navigationOptions = {
		header: null
	};

	constructor(props) {
		super(props);
		this.state = { email: '' };
	}

	componentWillReceiveProps(newProps) {
		// console.warn('new', newProps.navigation);
		if (newProps.forgetLink == true) {
			this.props.navigation.navigate('LoginScreen');
		}
	}

	onSubmit = () => {
		this.props.forgetPassword(this.state.email);
	};

	render() {
		if (this.props.loading)
		// loading
			return (
				<View style={styles.loader} >
					<ActivityIndicator size="large" color="#0000ff" />
				</View>
			);
		return (
			<View style={{flex:1}}>
				{/* Header Component */}
				<Header title="Password Recovery" rightImg={require("../../assets/images/logo.png")} navigation={this.props.navigation} iconleft={true} rightIcon={true} />
				<View style={styles.container}>

					<Text style={styles.emailText}>
						Enter your email and we'll send to you the link to reset the password.
				</Text>
					<View style={styles.textFieldContainer}>
						<Input
							containerStyle={styles.input}
							inputStyle={{ fontSize: 14, paddingTop: 12, fontFamily: 'SFProDisplay-Regular', }}
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
					</View>
					{/* <View style={styles.textFieldContainer}>
					<Text style={{color:'#f68736'}}>Resend Pin Code</Text>
				</View> */}
					<TouchableOpacity onPress={this.onSubmit} style={[styles.textFieldContainer]}>
						<LinearGradient
							colors={['#FF984C', '#F56464']}
							start={{ x: 0, y: 1 }}
							end={{ x: 2, y: 2 }}
							locations={[0, 0.5]}
							style={styles.linearGradient}
						>
							<Text style={{ color: '#fff', fontSize: 16, lineHeight: 19, fontFamily: 'SFProDisplay-Regular', }}>Verify</Text>
						</LinearGradient>
					</TouchableOpacity>

				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 2,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#fff'
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
	buttonStyle: {
		backgroundColor: '#f68736',
		borderRadius: 3,
		borderWidth: 0,
		height: 50
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
	textFieldContainer: {
		width: '80%',
		marginTop: 10
	},
	emailText: {
		textAlign: 'center',
		width: '80%',
		fontFamily: 'SFProDisplay-Regular',
		fontSize: 14,
		marginTop: -100,
		marginBottom: 50
	},
	loader: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	}
});

const mapStateToProps = ({ auth }) => {
	const { forgetLink, loading } = auth;
	return { forgetLink, loading };
};

export default connect(mapStateToProps, {
	forgetPassword
})(PassRecovery);

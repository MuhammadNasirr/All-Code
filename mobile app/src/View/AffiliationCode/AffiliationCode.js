import React, { Component } from 'react';
import { StyleSheet, KeyboardAvoidingView, Text, View, TouchableOpacity, AsyncStorage } from 'react-native';
import { Input } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { Header } from "../../Components"
import English from "../../en"
import French from "../../fr"

class AffiliationCode extends Component {
	static navigationOptions = {
		header: null
	};
	constructor(props) {
		super(props);
		this.state = {
			AffiliationCode: '',
			asyncLanguage: null,
		};
	}

	onSubmit = () => {
		this.setState({ AffiliationCode: '' });
		this.props.navigation.navigate('Home');
	};
	componentDidMount() {
		// check language
		AsyncStorage.getItem('language').then(a => {
			this.setState({ asyncLanguage: a })
		})
	}
	componentWillReceiveProps(newProps) {
		// new props recieve
		AsyncStorage.getItem('language').then(a => {
			this.setState({ asyncLanguage: a })
		})
		if (newProps.language) {
			this.setState({ asyncLanguage: newProps.language })
		}
	}
	render() {
		const { asyncLanguage } = this.state;
		return (
			<View style={{ height: '100%' }}>
				<Header title={asyncLanguage == 'fr' ? French.AFFILIATION_CODE : English.AFFILIATION_CODE} iconleft={true} navigation={this.props.navigation} />
				<KeyboardAvoidingView style={styles.container}>
					<Text style={{ marginTop: 10, fontFamily: 'SFProDisplay-Regular', width: '90%' }}>
						{asyncLanguage == 'fr' ? French.AFFILIATION_CODE_TEXT : English.AFFILIATION_CODE_TEXT}
					</Text>
					<View style={[styles.textFieldContainer, { flexDirection: 'row', alignItems: 'center', width: '100%', height: '50%', justifyContent: 'center' }]}>
						{
							this.state.AffiliationCode ? <Text style={{ fontSize: 60, fontFamily: 'SFProDisplay-Bold', color: '#FF984C' }}>{this.state.AffiliationCode}</Text> :
								<View style={{ flexDirection: 'row' }}>
									<View style={{ borderColor: '#FF984C', borderWidth: 2, width: 15, height: 15, borderRadius: 15, margin: 10 }}></View>
									<View style={{ borderColor: '#FF984C', borderWidth: 2, width: 15, height: 15, borderRadius: 15, margin: 10 }}></View>
									<View style={{ borderColor: '#FF984C', borderWidth: 2, width: 15, height: 15, borderRadius: 15, margin: 10 }}></View>
									<View style={{ borderColor: '#FF984C', borderWidth: 2, width: 15, height: 15, borderRadius: 15, margin: 10 }}></View>
								</View>
						}
					</View>
					<Input maxLength={4} inputContainerStyle={{ borderBottomWidth: 0 }} inputStyle={{ color: '#fff' }} autoFocus={true} keyboardType="number-pad" value={this.state.AffiliationCode} onChangeText={(AffiliationCode) => this.setState({ AffiliationCode })} />
					<View style={[styles.textFieldContainer, { marginBottom: 20 }]}>

						<TouchableOpacity onPress={this.onSubmit}>
							<LinearGradient
								colors={['#FF984C', '#F56464']}
								start={{ x: 0, y: 1 }}
								end={{ x: 2, y: 2 }}
								locations={[0, 0.5]}
								style={styles.linearGradient}
							>
								<Text style={{ color: '#fff' }}>{asyncLanguage == 'fr' ? French.SUBMIT : English.SUBMIT}</Text>
							</LinearGradient>
						</TouchableOpacity>
					</View>
				</KeyboardAvoidingView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: '#F9F7F7'
	},
	linearGradient: {
		bottom: 5,
		borderRadius: 4,
		marginTop: 10,
		alignItems: 'center',
		height: 50,
		justifyContent: 'center'
	},
	textFieldContainer: {
		width: '90%',
		marginTop: 10
	}
});
const mapStateToProps = ({ auth }) => {
	const { language } = auth;
	return { language };
};
export default connect(mapStateToProps)(AffiliationCode);

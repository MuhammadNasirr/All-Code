import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	Image,
	ActivityIndicator,
	Text,
	Platform,
	TouchableOpacity,
	AsyncStorage,
	Share,
	ScrollView,
	SafeAreaView
} from 'react-native';
import { Button } from 'react-native-elements';
import { Input, Icon, Card, Avatar } from 'react-native-elements';
import { connect } from 'react-redux';
import { getUser, updateUser } from '../../actions';
import ImagePicker from 'react-native-image-picker';
import { fireBase } from '../../firebase/firebase';
import RNFetchBlob from 'rn-fetch-blob';
import LinearGradient from 'react-native-linear-gradient';
import { Header } from '../../Components';
import { AffiIcon, MailIcon, CameraIcon, CodeIcon } from '../../Components/svg';
import SvgUri from 'react-native-svg-uri';
import English from "../../en"
import { withNavigationFocus } from 'react-navigation';
import French from "../../fr"
import NoProfile from '../../assets/images/noProfile.png'


class affiliateProfile extends Component {
	static navigationOptions = {
		header: null
	};

	constructor(props) {
		super(props);
		this.state = {
			id: '',
			firstName: '',
			email: '',
			affiliationCode: '',
			location: '',
			password: '',
			rePassword: '',
			avatarSource: '',
			loader: false,
			asyncLanguage: null,
			points: '',
			myAffiliation: '',
		};
	}
	componentWillReceiveProps(newProps) {
		AsyncStorage.getItem('language').then(a => {
			this.setState({ asyncLanguage: a })
		})
		if (newProps.language) {
			this.setState({ asyncLanguage: newProps.language })
		}
	}



	componentDidMount() {
		AsyncStorage.getItem('language').then(a => {
			this.setState({ asyncLanguage: a })
		})
		this.getCode();
	}



	getCode = () => {
		const me = this;
		let AffiliateCode = this.props.navigation.state.params.AffiliateCode;
		var leadsRef = fireBase.database().ref(`Users`);
		leadsRef.once('value', function (snapshot) {
			var arr = Object.values(snapshot.val());
			console.log(arr, "arr")
			arr.map((el) => {
				if (el.myAffiliation == AffiliateCode) {
					me.setState({
						email: el.email,
						affiliationCode: el.affiliationCode,
						myAffiliation: el.myAffiliation,
						avatarSource: el.profilePicURL,
						firstName: el.firstName
					})
					console.warn(el.email, "current user email")
				} else console.log("no record")
			});

		});

	};
	render() {
		const { asyncLanguage } = this.state;
		const item = { name: 'gift1', description: asyncLanguage == 'fr' ? `J’adore Gimonii, utilise mon code personnel ${this.state.myAffiliation} pour créer ton compte et participer. Amuse-toi! https://play.google.com/store/apps/details?id=com.gimonii` : `I love Gimonii. Use my affiliation code ${this.state.myAffiliation} to create an account and participate. Enjoy! https://play.google.com/store/apps/details?id=com.gimonii` }
		const users = [
			{
				name: 'Email',
				iconName: 'mail',
				subname: this.state.email,
				tabNme: 'Profile',
				url: MailIcon
			},

			{
				name: asyncLanguage == 'fr' ? French.PERSONAL_CODE : English.PERSONAL_CODE,
				iconName: 'users',
				type: 'font-awesome',
				subname: this.state.myAffiliation,
				tabNme: 'Profile',
				url: CodeIcon
			},

		];

		return (
			<SafeAreaView style={styles.container}>
				<ScrollView style={styles.textFieldContainer}>
					<LinearGradient
						colors={['#FF984C', '#F56464']}
						start={{ x: 0, y: 1 }}
						end={{ x: 2, y: 2 }}
						locations={[0, 0.5]}
						style={[styles.linearGradientcard]}
					>
						<Card containerStyle={styles.cardstyle}>
							<View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', left: -10, justifyContent: 'space-between' }}>
								<TouchableOpacity style={{ width: 30, height: 30, paddingLeft: 0, paddingVertical: 5 }} onPress={() => this.props.navigation.goBack()}>
									<Icon name="chevron-left" color="white" />
								</TouchableOpacity>
								<Text style={{ color: 'white', fontSize: 17, fontFamily: 'SFProDisplay-Regular' }}>{asyncLanguage == 'fr' ? French.PROFILE : English.PROFILE}</Text>
								<Text style={{ color: 'white', fontSize: 17, fontFamily: 'SFProDisplay-Regular' }}> </Text>
							</View>
							<View style={{ alignItems: 'center', marginVertical: 20 }}>

								<Avatar
									size={100}
									// containerStyle={{}}
									rounded
									source={this.state.avatarSource ? { uri: this.state.avatarSource } : require('../../assets/images/noProfile.png')}
									// onPress={() => this.openPicker()}
									activeOpacity={0.7}
								/>
								<Text style={{ fontSize: 16, color: '#fff', marginTop: 5 }}>
									{this.state.firstName}
								</Text>
							</View>
						</Card>
					</LinearGradient>
					<Card
						containerStyle={{
							width: '100%',
							backgroundColor: '#F9F7F7',
							marginLeft: 0,
							elevation: 0,
							marginTop: 0,
							padding: 0,
							marginRight: 0,
							borderColor: 'transparent'
						}}
					>
						{users.map((u, i) => {
							return (
								<View>
									<View key={i} style={styles.user}>
										<View style={{ flexDirection: 'row', alignItems: 'center' }}>
											<SvgUri
												style={{ width: 25, height: 25, marginHorizontal: 12 }}
												svgXmlData={u.url}
											/>
											<Text
												onPress={() => this.props.navigation.navigate(u.tabNme)}
												style={styles.name}
											>
												{u.name}
											</Text>
										</View>
										<View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
											<Text style={{ fontFamily: 'SFProDisplay-Regular' }}>{u.subname}</Text>
										</View>
									</View>
								</View>
							);
						})}
					</Card>
				</ScrollView>
			</SafeAreaView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'space-between',
		backgroundColor: '#F9F7F7',
		width: '100%'
	},
	linearGradient: {
		bottom: 16,
		borderRadius: 4,
		marginTop: 20,
		width: '90%',
		alignItems: 'center',
		height: 50,
		justifyContent: 'center'
	},
	image: {
		width: 30,
		padding: 6,
		height: 30,
		color: '#000'
	},
	linearGradientcard: {
		borderColor: 'transparent',
		borderWidth: 0,
		backgroundColor: 'transparent',
		width: '100%'
	},
	loader: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	user: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		borderBottomWidth: 1,
		borderBottomColor: 'lightgrey',
		paddingVertical: 20
	},
	Icon: {
		marginRight: 10
	},
	cardstyle: {
		backgroundColor: 'transparent',
		// marginLeft: 0,
		elevation: 0,
		// marginTop: 0,
		padding: 0,
		borderWidth: 0,
		borderColor: 'transparent'
	},
	logoutbox: {
		width: '100%',
		marginTop: 10,
		backgroundColor: '#fff',
		paddingHorizontal: 20,
		paddingVertical: 10,
		marginBottom: 20
	},
	input: {
		height: 60,
		width: '100%',
		backgroundColor: '#fff',
		color: '#000',
		borderWidth: 2,
		borderColor: '#d3d3d3'
	},
	buttonStyle: {
		backgroundColor: '#000',
		borderRadius: 0,
		height: 60
	},
	button: {
		fontSize: 15,
		color: '#fff',
		fontFamily: 'SFProDisplay-Regular',
		textAlign: 'center',
		marginTop: 20,
		backgroundColor: 'transparent'
	},
	textFieldContainer: {
		width: '100%',
		// alignItems: 'center'
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
	}
});

const mapStateToProps = ({ auth }) => {
	const { loading, user, language } = auth;
	return { loading, user, language };
};

export default withNavigationFocus(connect(mapStateToProps, {
	getUser,
	updateUser
})(affiliateProfile));

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	View,
	Text,
	StyleSheet,
	Image,
	ImageBackground,
	TouchableOpacity,
	AsyncStorage,
	Share,
	ScrollView,
	Switch,
	SafeAreaView
} from 'react-native';
import { Avatar, Button, Icon } from 'react-native-elements';
import { getUser, changeLanguage } from '../../actions';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import SvgUri from 'react-native-svg-uri';
import { HomeIcon, ProfileIcon, NotificationIcon, SettingIcon } from '../../Components/svg'
import { fireBase } from '../../firebase/firebase';
import English from "../../en"
import French from "../../fr"

var profile = ''
class NavigationMenu extends Component {
	state = {
		name: '',
		activeTab: 1,
		asyncLanguage: null,
		frenchLanguage: false,
		affiliationCode: '',
		myAffiliation: '',
		profilePicURL: '',
	};

	async componentDidMount() {

		this.getCode();
		this.getData();
		await AsyncStorage.getItem('language').then(language => {
			// console.warn(language, "async state")
			if (language == 'fr') {
				this.setState({ asyncLanguage: language, frenchLanguage: true });
			}
		})

	}
	// componentWillUnmount() {
	// 	this.getData();
	// }
	getData = () => {
		this.props.getUser()
		console.warn("run")
	}
	onChangeLanguage = (value) => {
		const { frenchLanguage } = this.state
		console.warn("language change", value)
		if (value) {
			this.props.changeLanguage('fr')
			this.getData()
			this.setState({ asyncLanguage: 'fr', frenchLanguage: value })
			AsyncStorage.setItem('language', "fr")
			// console.warn("language change IN", value)

		} else {
			this.props.changeLanguage('en')
			this.getData()
			this.setState({ asyncLanguage: 'en', frenchLanguage: value })
			AsyncStorage.setItem('language', "en")
		}

	}

	toggleActiveTab = (activeTab, tabNme) => {
		this.setState({ activeTab });
		this.props.navigation.navigate(tabNme);
		this.props.navigation.closeDrawer()
	};

	logout = () => {
		AsyncStorage.removeItem('userData')
		this.props.navigation.navigate('Auth')
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
		})
		if (newProps.user != null && newProps.user != 1) {
			const { profilePicURL } = newProps.user;
			if (profilePicURL !== '') {
				profile = profilePicURL;
			}
		}
	}

	getCode = () => {
		const me = this;
		let currentID = '';
		const { id, affiliationCode } = this.state;
		AsyncStorage.getItem('userData').then((user) => {
			if (user != null) {
				console.warn(user)
				currentID = user

			}
		});
		// if (affiliationCode == '') {
			var leadsRef = fireBase.database().ref(`Users`);
			leadsRef.once('value', function (snapshot) {
				var arr = Object.values(snapshot.val());
				console.warn(arr, "arraaaa")
				arr.map((el) => {
					if (el.id == currentID) {
						console.warn('------>',el)
						console.warn('------>',currentID)
						me.setState({ affiliationCode: el.affiliationCode, myAffiliation: el.myAffiliation })
						// console.log(el.affiliationCode, "current user")
					} else console.log("no record")
				});

			});
		// } else {
		// 	alert('you must enter code');
		// }
	};
	
	render() {
		const { asyncLanguage, frenchLanguage } = this.state;
		const item = { name: 'gift1', description: asyncLanguage == 'fr' ? `J’adore Gimonii, utilise mon code personnel ${this.state.myAffiliation} pour créer ton compte et participer. Amuse-toi ! https://play.google.com/store/apps/details?id=com.gimonii` : `I love Gimonii. Use my affiliation code ${this.state.myAffiliation} to create an account and participate. Enjoy!  https://play.google.com/store/apps/details?id=com.gimonii` }
		const email = this.props.user ? this.props.user.email : ""
		const firstName = this.props.user ? this.props.user.firstName : ""
		profile = this.props.user && this.props.user.profilePicURL != '' ? { uri: this.props.user.profilePicURL } : require("../../assets/images/noProfile.png");
		// const { navigate } = this.props.navigation;
		console.warn(this.state.myAffiliation, 'myAffiliation')
		// this.getData();
		return (
			<SafeAreaView style={styles.container}>
				<ScrollView style={{ marginTop: 0, width: '100%' }}>
					<View style={{ alignItems: 'center', marginBottom: 20 }}>
						<Avatar
							size={'large'}
							rounded
							source={profile}
							onPress={() => console.log('Works!')}
							activeOpacity={0.7}
						/>
						<Text style={{ fontSize: 16, color: '#000', marginTop: 5 }}>{firstName}</Text>
						<Text>{email}</Text>
					</View>

					<TouchableOpacity
						onPress={() => this.toggleActiveTab(1, 'HomeInner')}
						style={this.state.activeTab === 1 ? styles.active : styles.tabName}
					>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<SvgUri
								svgXmlData={HomeIcon}
								style={{ width: 25, marginHorizontal: 12 }}
							/>
							<Text style={styles.sectionHeadingStyle}>{asyncLanguage == 'fr' ? French.HOME : English.HOME}</Text>
						</View>
						<Icon name="chevron-right" color="#666666" size={20} />
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => this.toggleActiveTab(2, 'Profile')}
						style={this.state.activeTab === 2 ? styles.active : styles.tabName}
					>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<SvgUri
								svgXmlData={ProfileIcon}
								style={{ width: 25, marginHorizontal: 12 }}
							/>
							<Text style={styles.sectionHeadingStyle}>{asyncLanguage == 'fr' ? French.PROFILE : English.PROFILE}</Text>
						</View>
						<Icon name="chevron-right" color="#666666" size={20} />
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => this.toggleActiveTab(3, 'Notifications')}
						style={this.state.activeTab === 3 ? styles.active : styles.tabName}
					>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<SvgUri
								svgXmlData={NotificationIcon}
								style={{ width: 25, marginHorizontal: 12 }}
							/>
							<Text style={styles.sectionHeadingStyle}>{asyncLanguage == 'fr' ? French.NOTIFICATIONS : English.NOTIFICATIONS}</Text>
						</View>
						<Icon name="chevron-right" color="#666666" size={20} />
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => this.toggleActiveTab(4, 'Settings')}
						style={this.state.activeTab === 4 ? styles.active : styles.tabName}
					>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<SvgUri
								svgXmlData={SettingIcon}
								style={{ width: 25, marginHorizontal: 12 }}
							/>
							<Text style={styles.sectionHeadingStyle}>{asyncLanguage == 'fr' ? French.SETTINGS : English.SETTINGS}</Text>
						</View>
						<Icon name="chevron-right" color="#666666" size={20} />
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => console.log("a")}
						style={this.state.activeTab === 2 ? styles.active : styles.tabName}
					>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Icon containerStyle={{ marginHorizontal: 12, width: 25 }} color={"#F88735"} name={'language'} type={"font-awesome"} />
							<Text style={styles.sectionHeadingStyle}>{asyncLanguage == 'fr' ? French.FRENCH : English.FRENCH}</Text>
							{/* <Icon name="chevron-right" color="#666666" size={20} /> */}
						</View>
						<Switch onValueChange={this.onChangeLanguage} value={frenchLanguage} />


					</TouchableOpacity>
				</ScrollView>
				<TouchableOpacity
					onPress={() => this.share(item)}
					style={{ width: '90%', marginTop: 10 }}>
					<LinearGradient
						colors={['#F28B19', '#EA3838']}
						start={{ x: 0, y: 2 }}
						end={{ x: 2, y: 2 }}
						locations={[0, 0.5]}
						style={styles.linearGradients}
					>
						<Text style={{ color: '#fff', fontFamily: 'SFProDisplay-Regular' }}>{asyncLanguage == 'fr' ? French.SHARE : English.SHARE}</Text>
					</LinearGradient>
				</TouchableOpacity>
			</SafeAreaView>
		);
	}
}
const styles = new StyleSheet.create({
	container: {
		paddingTop: 20,
		flex: 1,
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%'
	},
	linearGradients: {
		width: '100%',
		height: 50,
		alignItems: "center",
		justifyContent: 'center',
		marginBottom: 10
	},
	backgroundimage: {
		flex: 1,
		justifyContent: 'center',
		width: null,
		height: null
	},
	navItemStyle: {
		padding: 10
	},
	navSectionStyle: {
		// backgroundColor: 'lightgrey'
	},
	sectionHeadingStyle: {
		paddingHorizontal: 5,
		fontFamily: 'SFProDisplay-Regular',
		color: '#666666',
		fontSize: 14,
		textAlignVertical: 'center'
	},
	footerContainer: {
		padding: 20
	},
	tabName: {
		paddingVertical: 20,
		alignItems: 'center',
		fontFamily: 'SFProDisplay-Regular',
		flexDirection: 'row',
		justifyContent: 'space-between',
		borderBottomWidth: 1,
		borderBottomColor: '#d3d3d3'
	},
	active: {
		backgroundColor: 'rgba(255, 255, 255, 0.5)',
		flexDirection: 'row',
		justifyContent: 'space-between',
		borderBottomWidth: 1,
		alignItems: 'center',
		borderBottomColor: '#d3d3d3',
		paddingVertical: 20
	}
});

NavigationMenu.propTypes = {
	navigation: PropTypes.object
};

const mapStateToProps = ({ auth }) => {
	const { loading, user, language } = auth;
	return { loading, user, language };
};


export default connect(mapStateToProps, {
	getUser,
	changeLanguage
})(NavigationMenu);

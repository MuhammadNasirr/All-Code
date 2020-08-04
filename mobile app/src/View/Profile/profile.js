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


class Profile extends Component {
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

		if (newProps.user != null) {
			const { firstName, email, affiliationCode, location, id, profilePicURL, points } = newProps.user;
			this.setState({ firstName, email, affiliationCode, location, id, points: points });
			if (profilePicURL !== '') {
				this.setState({ avatarSource: profilePicURL });
			}
		}
		if (newProps.user == 1) {
			this.props.navigation.navigate('Main');
		}
	}



	componentDidMount() {
		this.props.getUser();
		this.getCode();

	}


	uploadImage(uri, name, mime = 'application/octet-stream') {
		const Blob = RNFetchBlob.polyfill.Blob;
		const fs = RNFetchBlob.fs;
		window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
		window.Blob = Blob;
		console.log('uploadImage running');
		return new Promise((resolve, reject) => {
			const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
			let uploadBlob = null;

			const imageRef = fireBase.storage().ref('profile').child(name);

			fs
				.readFile(uploadUri, 'base64')
				.then((data) => {
					return Blob.build(data, { type: `${mime};BASE64` });
				})
				.then((blob) => {
					uploadBlob = blob;
					return imageRef.put(blob, { contentType: mime });
				})
				.then(() => {
					uploadBlob.close();
					return imageRef.getDownloadURL();
				})
				.then((url) => {
					console.log('resolve running');
					resolve(url);
				})
				.catch((error) => {
					console.log('rejext running');
					reject(error);
				});
		});
	}

	openPicker = () => {
		var user = fireBase.auth().currentUser;
		const options = {
			title: 'Select Avatar',
			storageOptions: {
				skipBackup: true,
				path: 'images'
			}
		};
		ImagePicker.showImagePicker(options, (response) => {
			console.log('Response = ', response);
			if (response.didCancel) {
				console.warn('User cancelled image picker');
			} else if (response.error) {
				console.warn('ImagePicker Error: ', response.error);
			} else if (response.customButton) {
				console.warn('User tapped custom button: ', response.customButton);
			} else {
				console.log('else running');
				this.setState({ loader: true });
				this.uploadImage(response.uri, response.fileName)
					.then((url) => {
						AsyncStorage.getItem('userData').then((uid) => {
							fireBase.database().ref('Users/' + uid).update({ profilePicURL: url });
							alert('uploaded');
							this.props.getUser();

							console.log('url', url);
						});
						this.setState({ avatarSource: url, loader: false });
					})
					.catch((error) => console.log(error));
				// const source = { uri: response.uri };
				// console.warn("uri",response.uri)
				// this.setState({
				// avatarSource: response.uri,
				// });
			}
		});
	};
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
	onPress = (u) => {
		if (u.route === 'AffiliateTo') {
			this.props.navigation.navigate('AffiliateProfile', { AffiliateCode: this.state.affiliationCode });
		}
	};

	onSubmit = () => {
		const { firstName, email, affiliationCode, location, id } = this.state;
		this.props.updateUser({ id, firstName, email, affiliationCode, location });
	};
	getCode = () => {
		const me = this;
		let currentID = '';
		const { id, affiliationCode } = this.state;
		AsyncStorage.getItem('userData').then((user) => {
			if (user != null) {
				console.log(user, 'usser data')
				currentID = user

			}
		});

		var leadsRef = fireBase.database().ref(`Users`);
		leadsRef.once('value', function (snapshot) {
			var arr = Object.values(snapshot.val());
			console.log(arr, "arr")
			arr.map((el) => {
				if (el.id == currentID) {
					console.warn('--->',el)
					me.setState({ points: el.points, affiliationCode: el.affiliationCode, myAffiliation: el.myAffiliation })
					console.warn(el.points, "current user points")
					console.log(el.points, "points user")
				} else console.log("no record")
			});

		});

	};
	render() {
		const { asyncLanguage } = this.state;
		const item = { name: 'gift1', description: asyncLanguage == 'fr' ? `J’adore Gimonii, utilise mon code personnel ${this.state.myAffiliation} pour créer ton compte et participer. Amuse-toi! https://play.google.com/store/apps/details?id=com.gimonii` : `I love Gimonii. Use my affiliation code ${this.state.myAffiliation} to create an account and participate. Enjoy!  https://play.google.com/store/apps/details?id=com.gimonii` }
		const users = [
			{
				name: 'Email',
				iconName: 'mail',
				subname: this.state.email,
				tabNme: 'Profile',
				url: MailIcon
			},
			{
				name: asyncLanguage == 'fr' ? French.AFFILIATE_MEMBERS : English.AFFILIATE_MEMBERS,
				iconName: 'users',
				type: 'font-awesome',
				subname: this.state.points,
				tabNme: 'Profile',
				url: AffiIcon
			},
			{
				name: asyncLanguage == 'fr' ? French.AFFILIATE_TO : English.AFFILIATE_TO,
				iconName: 'users',
				type: 'font-awesome',
				subname: this.state.affiliationCode,
				tabNme: 'Profile',
				url: CodeIcon,
				route: 'AffiliateTo'
			},
			{
				name: asyncLanguage == 'fr' ? French.PERSONAL_CODE : English.PERSONAL_CODE,
				iconName: 'users',
				type: 'font-awesome',
				subname: this.state.myAffiliation,
				tabNme: 'Profile',
				url: CodeIcon
			},
			// {
			// 	name: 'Affiliation Code',
			// 	iconName: 'grid',
			// 	type: 'simple-line-icon',
			// 	subname: this.state.affiliationCode,
			// 	tabNme: 'Profile',
			// 	url: require('../../assets/images/Rectangle7.png')
			// }
		];
		// if (this.props.loading)
		// 	return (
		// 		<View style={styles.loader}>
		// 			<ActivityIndicator size="large" color="#F56464" />
		// 		</View>
		// 	);
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
								<TouchableOpacity
									onPress={() => this.openPicker()}
									style={{
										backgroundColor: '#fff',
										justifyContent: 'center',
										alignItems: 'center',
										borderWidth: 1,
										borderColor: '#fff',
										zIndex: 2,
										width: 35,
										height: 35,
										borderRadius: 20,
										marginBottom: -30,
										marginRight: -80
									}}
								>
									<SvgUri svgXmlData={CameraIcon} />
									{/* <Icon name="camera" color={"#EA3838"} type="simple-line-icon" /> */}
								</TouchableOpacity>
								{this.state.loader ? (
									<ActivityIndicator size="large" color="#fff" />
								) : (
										<Avatar
											size={100}
											// containerStyle={{}}
											rounded
											source={this.state.avatarSource ? { uri: this.state.avatarSource } : require('../../assets/images/noProfile.png')}
											onPress={() => this.openPicker()}
											activeOpacity={0.7}
										/>
									)}
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
								<TouchableOpacity onPress={() => this.onPress(u)}>
									<View key={i} style={styles.user}>
										<View style={{ flexDirection: 'row', alignItems: 'center' }}>
											<SvgUri
												style={{ width: 25, height: 25, marginHorizontal: 12 }}
												svgXmlData={u.url}
											/>

											{/* <Image
												source={u.url}
												style={{ width: 25, height: 25, marginHorizontal: 12 }}
											/> */}
											<Text
												onPress={() => this.props.navigation.navigate(u.tabNme)}
												style={styles.name}
											>
												{u.name}
											</Text>
										</View>
										<View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
											<Text style={{ fontFamily: 'SFProDisplay-Regular' }}>{u.subname}</Text>
											{/* <Icon color={'grey'} containerStyle={styles.Icon} name={u.rightIcon} /> */}
										</View>
									</View>
								</TouchableOpacity>
							);
						})}
					</Card>
				</ScrollView>
				<TouchableOpacity style={{ width: '100%', alignItems: 'center' }} onPress={() => this.share(item)}>
					<LinearGradient
						colors={['#FF984C', '#F56464']}
						start={{ x: 0, y: 1 }}
						end={{ x: 2, y: 2 }}
						locations={[0, 0.5]}
						style={styles.linearGradient}
					>
						<Text style={{ fontFamily: 'SFProDisplay-Regular', color: '#fff' }}>{asyncLanguage == 'fr' ? French.SHARE : English.SHARE}</Text>
					</LinearGradient>
				</TouchableOpacity>
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
})(Profile));

import React, { Component } from 'react';
import { StyleSheet, Switch, View, Text, Image, ScrollView, TouchableOpacity, AsyncStorage, Alert } from 'react-native';
import { Card, ListItem, Icon } from 'react-native-elements';
import { forgetPassword } from '../../actions';
import { connect } from 'react-redux';
import { fireBase } from '../../firebase/firebase';
import Geocoder from 'react-native-geocoder';
import { Radio } from 'native-base';
import { Header } from "../../Components"
import English from "../../en"
import French from "../../fr"
import SvgUri from 'react-native-svg-uri';
import { PassIcon, LocationIcon, CodeIcon, CardIcon, InfoIcon, DeleteIcon } from '../../Components/svg'
import axios from 'axios';
import { withNavigationFocus } from 'react-navigation';

Geocoder.apiKey = 'AIzaSyDy_-t7hJN3sO8gCbC33akqZ5dk2_3nH18';


class Settings extends Component {
	static navigationOptions = {
		header: null
	};

	constructor(props) {
		super(props);
		this.state = {
			card: '',
			lat: null,
			lng: null,
			frenchLanguage: false,
			asyncLanguage: null,
			location: '',
			myAffiliation: '',
			affiliationCode: '',
		};
	}
	componentDidMount() {
		this.getCode()
		this.getCard()
		// console.warn(English.MEMBERS, "English Language")
		AsyncStorage.getItem('language').then(a => {
			this.setState({ asyncLanguage: a })
		})

		// var NY = {
		// 	lat: 40.7809261,
		// 	lng: -73.9637594
		//   };
		// const res = await Geocoder.geocodePosition(NY);
		// console.warn("loc",res)


	}
	componentWillReceiveProps(newProps) {
		AsyncStorage.getItem('language').then(a => {
			this.setState({ asyncLanguage: a })
		})
		if (newProps.language) {
			this.setState({ asyncLanguage: newProps.language })
		}
	}

	onChangeLanguage = (value) => {
		const { frenchLanguage } = this.state
		// console.warn("language change", value)

		if (value) {
			this.setState({ asyncLanguage: 'fr', frenchLanguage: value })

			AsyncStorage.setItem('language', "fr")
			// console.warn("language change IN", value)

		} else {
			this.setState({ asyncLanguage: 'en', frenchLanguage: value })
			AsyncStorage.setItem('language', "en")
		}

	}
	// getCordinates = () => {
	// 	navigator.geolocation.getCurrentPosition(
	// 		position => {
	// 			this.setState({ lat: position.coords.latitude, lng: position.coords.longitude })
	// 			this.getLocation()

	// 		},
	// 		error => Alert.alert(error.message),
	// 		{ enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
	// 	);
	// }
	componentDidUpdate() {
		// console.warn("update setting")
		setTimeout(() => {
			this.getCode()
			// console.warn("update location")
		}, 500);


	}
	getCard = () => {
		AsyncStorage.getItem('card')
			.then(res => {
				const parse = JSON.parse(res)
				const number = parse.number
				if (res != null) {
					this.setState({ card: number })
				} else {
					this.setState({ card: '.... .... .... ..' })
				}
			})
	}

	// getLocation = async () => {
	// 	const res = await Geocoder.geocodePosition({
	// 		lat: this.state.lat,
	// 		lng: this.state.lng
	// 	});
	// 	console.warn("ress***",res)
	// 	const add = res[0].streetName + ',' +res[0].country
	// 	this.setState({ location: add })
	// }
	getCode = () => {
		const me = this;
		let currentID = '';
		const { id, location } = this.state;
		AsyncStorage.getItem('userData').then((user) => {
			if (user != null) {
				// console.log(user)
				currentID = user

			}
		});
		// if (location == '') {
		var leadsRef = fireBase.database().ref(`Users`);
		leadsRef.once('value', function (snapshot) {
			var arr = Object.values(snapshot.val());
			// console.log(arr, "arr")
			arr.map((el) => {
				if (el.id == currentID) {
					me.setState({ location: el.location, affiliationCode: el.affiliationCode, myAffiliation: el.myAffiliation, username: el.firstName })
					// console.warn(el.points, "current user points")
					// console.warn(el.myAffiliation, "current user")
				} else console.log("no record")
			});

		});
		// } else {
		// 	console.log('no location')
		// }
	};
	logout() {
		AsyncStorage.removeItem('userData')
		this.props.navigation.navigate('Auth')
	}

	onDelete(u) {
		const { frenchLanguage, asyncLanguage } = this.state;
		let currentID = '';
		AsyncStorage.getItem('userData').then((user) => {
			if (user != null) {
				// console.log(user)
				currentID = user

			}
		});



		if (u.name == French.DELETE_ACCOUNT || u.name == English.DELETE_ACCOUNT) {
			var user = fireBase.auth().currentUser;
			Alert.alert(
				asyncLanguage == 'fr' ? French.ACCOUNT_DELETE : English.ACCOUNT_DELETE,
				asyncLanguage == 'fr' ? French.ACCOUNT_DELETE_TEXT : English.ACCOUNT_DELETE_TEXT,
				[
					{
						text: asyncLanguage == 'fr' ? French.CANCEL : English.CANCEL,
						onPress: () => console.log('Cancel Pressed'),
						style: 'cancel',
					},
					{
						text: asyncLanguage == 'fr' ? French.OK : English.OK, onPress: () => {
							let body = {
								uid: currentID
							}
							console.warn(body, 'body')
							debugger
							axios.post('https://www.gimonii.com/api/cancelsub/', body)
								.then((res) => {
									axios.delete(`https://www.gimonii.com/users/${currentID}`).then(res => {
										if (res.status !== "error") {
											this.logout()
											alert('User Deleted');
										}
										else {
											alert(res.data.message);
										}
									})
									// debugger
									// fireBase.database().ref('Users/' + currentID).update({ isDeleted: "true" }).then(res => {
									// 	user.delete()
									// 	this.logout()
									// }).catch(error => {
									// 	alert('Subscription  is cancelled but user is not delete!');
									// })
									console.warn('done')
								}).catch(err => {
									debugger
									console.warn("error", err)
									alert(asyncLanguage == 'fr' ? French.SOMETHING_WENT_WRONG : English.SOMETHING_WENT_WRONG);
								})

						}
					},
				],
				{ cancelable: false },
			);

			// AsyncStorage.getItem('userData')
			// .then(uid => {
			// 	fireBase.database().ref('users/' + uid)
			// 	.update({
			// 		status:0
			// 	})
			// })
			// this.logout()
		} else {
			Alert.alert(asyncLanguage == 'fr' ? French.ABOUT : English.ABOUT, asyncLanguage == 'fr' ? French.ABOUT_TEXT : English.ABOUT_TEXT)
		}
	}

	render() {
		const { asyncLanguage } = this.state;
		const users = [
			{
				name: asyncLanguage == 'fr' ? French.PASSWORD : English.PASSWORD,
				subname: asyncLanguage == 'fr' ? French.CHANGE : English.CHANGE,
				tabNme: 'chnagePassword',
				url: PassIcon,
				icon: true,
			},
			{
				name: asyncLanguage == 'fr' ? French.LOCATION : English.LOCATION,
				iconName: 'location',
				type: 'entypo',
				subname: this.state.location,
				tabNme: 'ChangeLocation',
				icon: true,
				url: LocationIcon

			},
			// {
			// 	name: asyncLanguage == 'fr' ? French.CARD : English.CARD,
			// 	iconName: 'credit-card',
			// 	type: 'font-awesome',
			// 	subname: this.state.card,
			// 	userName:this.state.username,
			// 	currentLocation:this.state.location,
			// 	tabNme: 'payment',
			// 	icon:true,
			// 	url: CardIcon

			// },
			{
				name: asyncLanguage == 'fr' ? French.AFFILIATE_TO : English.AFFILIATE_TO,
				iconName: 'grid',
				type: 'simple-line-icon',
				icon: false,
				subname: this.state.affiliationCode,
				tabNme: 'Settings',
				url: CodeIcon

			},
			{
				name: asyncLanguage == 'fr' ? French.PERSONAL_CODE : English.PERSONAL_CODE,
				iconName: 'grid',
				type: 'simple-line-icon',
				icon: false,
				subname: this.state.myAffiliation,
				tabNme: 'Settings',
				url: CodeIcon

			},

		];
		const Additional = [
			{
				name: asyncLanguage == 'fr' ? French.DELETE_ACCOUNT : English.DELETE_ACCOUNT,
				iconName: 'delete',
				type: 'material-icon',
				icon: false,
				tabNme: 'Settings',
				url: DeleteIcon,
				svg: true
			},
			{
				name: asyncLanguage == 'fr' ? French.ABOUT : English.ABOUT,
				iconName: 'exclamation',
				type: 'evilicon',
				icon: true,
				tabNme: 'Settings',
				url: InfoIcon,
				svg: true

			},
			// {
			// 	name: asyncLanguage == 'fr' ? French.FRENCH : English.FRENCH,
			// 	iconName: 'language',
			// 	type: 'font-awesome',
			// 	toggleicon: true,
			// 	tabNme: 'Settings',
			// 	url: InfoIcon,
			// 	vectorIcon: true

			// },

		];
		return (
			<View style={{ width: '100%', height: '100%', backgroundColor: '#f1f1f1' }}>
				<Header title={asyncLanguage == 'fr' ? French.SETTINGS : English.SETTINGS} iconleft={true} route={"HomeInner"} navigation={this.props.navigation} />

				<ScrollView style={{ backgroundColor: '#F9F7F7', width: '100%' }}>
					<Card
						containerStyle={{ width: '100%', padding: 0, paddingTop: 10, marginLeft: 0, elevation: 0, borderColor: 'transparent' }}
						titleStyle={{ textAlign: 'left', marginLeft: 10 }}
						title={asyncLanguage == 'fr' ? French.PERSONAL_INFORMATION : English.PERSONAL_INFORMATION}
					>
						{users.map((u, i) => {
							return (
								<TouchableOpacity onPress={() => this.props.navigation.navigate(u.tabNme, u.userName ? { firstName: u.userName, location: u.currentLocation } : null)} key={i} disabled={u.icon ? false : true} style={styles.user}>
									<View style={{ flexDirection: 'row', alignItems: 'center' }}>
										<SvgUri
											svgXmlData={u.url}
											style={{ width: 25, marginHorizontal: 12 }}
										/>
										<Text style={styles.name}>{u.name}</Text>
									</View>
									<View style={{ flexDirection: 'row', alignItems: 'center' }}>
										<Text style={[styles.name, { marginRight: 10 }]}>{u.subname.length > 20 ? u.subname.slice(0, 20) + "..." : u.subname}</Text>
										{u.icon ? <Icon color={'grey'} containerStyle={styles.Icon} name={'chevron-right'} /> : <View />}
									</View>
								</TouchableOpacity>
							);
						})}
					</Card>
					<Card
						containerStyle={{ width: '100%', padding: 0, paddingTop: 10, marginLeft: 0, elevation: 0, borderColor: 'transparent' }}
						titleStyle={{ textAlign: 'left', paddingLeft: 10 }}
						title={asyncLanguage == 'fr' ? French.ADDITIONAL_SETTINGS : English.ADDITIONAL_SETTINGS}
					>
						{Additional.map((u, i) => {
							return (
								<TouchableOpacity onPress={() => this.onDelete(u)} >
									<View key={i} style={styles.user}>
										<View style={{ flexDirection: 'row', alignItems: 'center' }}>
											{u.svg ?
												<SvgUri
													svgXmlData={u.url}
													style={{ width: 25, marginHorizontal: 12 }}
												/>
												:
												<Image
													source={u.url}
													style={{ width: 22, marginHorizontal: 12 }}
												/>
											}
											{
												u.vectorIcon ? <Icon containerStyle={{ marginLeft: -30, marginRight: 12 }} color={"#F88735"} name={u.iconName} type={u.type} /> : null
											}
											<Text style={styles.name}>{u.name}</Text>
										</View>
										<View style={{ flexDirection: 'row', alignItems: 'center' }}>
											{u.icon ? <Icon color={'grey'} containerStyle={styles.Icon} name={'chevron-right'} /> : null}
											{/* {u.toggleicon ? <Switch onValueChange={this.onChangeLanguage} value={frenchLanguage} /> : null} */}
										</View>
									</View>
								</TouchableOpacity>
							);
						})}
					</Card>
					<TouchableOpacity onPress={() => this.logout()} style={styles.logoutbox}>
						<Text style={{ color: '#000' }}>{asyncLanguage == 'fr' ? French.LOGOUT : English.LOGOUT}</Text>
					</TouchableOpacity>
				</ScrollView>
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
		backgroundColor: '#fff'
	},
	Icon: {
		marginRight: 10
	},
	user: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		borderBottomWidth: 1,
		borderBottomColor: 'lightgrey',
		paddingVertical: 20
	},
	logoutbox: {
		width: '100%',
		marginTop: 10,
		backgroundColor: '#fff',
		paddingHorizontal: 20,
		paddingVertical: 20,
		marginBottom: 20
	},
});
const mapStateToProps = ({ auth }) => {
	const { loading, user, language } = auth;
	return { loading, user, language };
};
export default withNavigationFocus(connect(mapStateToProps)(Settings));
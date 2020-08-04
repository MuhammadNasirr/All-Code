import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	AsyncStorage,
	Switch,
	SafeAreaView
} from 'react-native';
import { connect } from 'react-redux';
import { changeLanguage } from '../../actions';
import { Avatar, Icon } from 'react-native-elements';
import SvgUri from 'react-native-svg-uri';
import { HomeIcon, LoginIcon } from '../../Components/svg'
import English from "../../en"
import French from "../../fr"

class NonAuthDrawer extends Component {
	state = {
		asyncLanguage: null,
		frenchLanguage: false,
	};

	async componentDidMount() {

		// console.warn(English.MEMBERS, "English Language")
		await AsyncStorage.getItem('language').then(language => {
			// console.warn(language, "async state")
			if (language == 'fr') {
				this.setState({ asyncLanguage: language, frenchLanguage: true });
			}
		})

		// var NY = {
		// 	lat: 40.7809261,
		// 	lng: -73.9637594
		//   };
		// const res = await Geocoder.geocodePosition(NY);
		// console.warn("loc",res)


	}
	// componentDidUpdate(newProps) {
	// 	AsyncStorage.getItem('language').then(a => {
	// 		this.setState({ asyncLanguage: a })
	// 		console.warn(a, "check async props")
	// 	})
	// }
	componentWillReceiveProps(newProps) {
		AsyncStorage.getItem('language').then(a => {
			this.setState({ asyncLanguage: a })
			// console.warn(a, "check async props")
		})
	}
	toggleActiveTab = (activeTab, tabNme) => {
		this.setState({ activeTab });
		this.props.navigation.navigate(tabNme);
		this.props.navigation.closeDrawer()
	};
	onChangeLanguage = (value) => {
		const { frenchLanguage } = this.state
		// console.warn("language change", value)

		if (value) {
			this.setState({ asyncLanguage: 'fr', frenchLanguage: value })
			AsyncStorage.setItem('language', "fr")
			this.props.changeLanguage('fr')
			// console.warn("language change IN", value)

		} else {
			this.setState({ asyncLanguage: 'en', frenchLanguage: value })
			this.props.changeLanguage('en')
			AsyncStorage.setItem('language', "en")
		}

	}
	render() {
		const { asyncLanguage, frenchLanguage } = this.state;
		const { navigate } = this.props.navigation;
		return (
			<SafeAreaView style={styles.container}>
				<View style={{ marginTop: 0 }}>
					<View style={{ alignItems: 'center', marginBottom: 20 }}>
						<Avatar
							size={'large'}
							rounded
							source={require('../../assets/images/Ellipse.png')}
							onPress={() => console.log('Works!')}
							activeOpacity={0.7}
						/>
						<Text style={{ fontSize: 16, color: '#000', marginTop: 5 }}>{asyncLanguage == 'fr' ? French.USER : English.USER}</Text>
					</View>

					<TouchableOpacity
						onPress={() => this.toggleActiveTab(1, 'NonAuthHome')}
						style={this.state.activeTab === 1 ? styles.active : styles.tabName}
					>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<SvgUri
								svgXmlData={HomeIcon}
								style={{ width: 30, marginLeft: 10 }}
							/>
							{/* <Icon
								name="home-outline"
								type="material-community"
								color="#FF8801"
								size={26}
								containerStyle={{ width: 50 }}
							/> */}
							<Text style={styles.sectionHeadingStyle}>{asyncLanguage == 'fr' ? French.HOME : English.HOME}</Text>
						</View>
						<Icon name="chevron-right" color="#666666" size={20} />
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => this.toggleActiveTab(2, 'LoginScreen')}
						style={this.state.activeTab === 2 ? styles.active : styles.tabName}
					>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<SvgUri
								svgXmlData={LoginIcon}
								style={{ width: 30, marginLeft: 10 }}
							/>
							<Text style={styles.sectionHeadingStyle}>{asyncLanguage == 'fr' ? French.LOGIN_SIGNUP : English.LOGIN_SIGNUP}</Text>
						</View>
						<Icon name="chevron-right" color="#666666" size={20} />
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => console.log("a")}
						style={this.state.activeTab === 2 ? styles.active : styles.tabName}
					>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Icon containerStyle={{ marginHorizontal: 10 }} color={"#F88735"} name={'language'} type={"font-awesome"} />
							<Text style={styles.sectionHeadingStyle}>{asyncLanguage == 'fr' ? French.FRENCH : English.FRENCH}</Text>
							{/* <Icon name="chevron-right" color="#666666" size={20} /> */}
						</View>
						<Switch onValueChange={this.onChangeLanguage} value={frenchLanguage} />


					</TouchableOpacity>
				</View>
			</SafeAreaView>
		);
	}
}
const styles = new StyleSheet.create({
	container: {
		paddingTop: 20,
		flex: 1,
		justifyContent: 'space-between'
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

NonAuthDrawer.propTypes = {
	navigation: PropTypes.object
};
const mapStateToProps = ({ language }) => {
	return { language };
};

export default connect(mapStateToProps, {
	changeLanguage
})(NonAuthDrawer);

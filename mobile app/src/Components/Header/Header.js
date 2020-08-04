import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Icon } from 'react-native-elements';
import SvgUri from 'react-native-svg-uri';
import LinearGradient from 'react-native-linear-gradient';
import { AppLogoFull, DrawerIcon, AppLogo } from '../../Components/svg';

class Header extends Component {
	static navigationOptions = {
		header: null
	};

	constructor(props) {
		super(props);
		this.state = { password: '', Confirmpassword: '', Currentpassword: '' };
	}

	render() {
		return (
			<SafeAreaView style={{ width: '100%' }}>
				<StatusBar backgroundColor="white" barStyle="dark-content" />
				{this.props.linearGradients ? (
					<LinearGradient
						colors={['#FF984C', '#F56464']}
						start={{ x: 0, y: 1 }}
						end={{ x: 2.5, y: 4 }}
						locations={[0, 0.5]}
						style={[styles.linearGradient]}
					>
						{this.props.iconleft ? (
							<TouchableOpacity style={{ width: 30, height: 30 }} onPress={() => {
								this.props.navigation.goBack()
							}}>
								<Icon color="#fff" name={'chevron-left'} />
							</TouchableOpacity>
						) : null}
						<Text
							style={{
								fontSize: 17,
								marginLeft: '38%',
								textAlign: 'center',
								color: '#fff',
								fontFamily: 'SFProDisplay-Regular'
							}}
						>
							{this.props.title}
						</Text>
					</LinearGradient>
				) : (
						<View style={styles.container}>
							{this.props.iconleft ? (
								<TouchableOpacity style={{ width: 30, height: 30, paddingVertical: 5 }} onPress={() => {
									if (this.props.route == "HomeInner") {
										console.warn(this.props.route)
										this.props.navigation.navigate("HomeInner", { key: true })
									} else this.props.navigation.goBack()
								}}>
									<Icon name={'chevron-left'} />
								</TouchableOpacity>
							) : null}
							{this.props.drawerIcon ? (
								<TouchableOpacity style={{ width: 30, height: 30, paddingVertical: 5 }} onPress={() => this.props.navigation.toggleDrawer()}>
									<SvgUri svgXmlData={DrawerIcon} />
								</TouchableOpacity>
							) : null}

							{this.props.homeLogo ? (
								<SvgUri svgXmlData={AppLogoFull} />
							) : (
									<Text style={{ fontSize: 17, textAlign: 'left', fontFamily: 'SFProDisplay-Regular' }}>
										{this.props.title}
									</Text>
								)}
							{this.props.signUpRightIcon ? (
								<TouchableOpacity onPress={() => this.props.navigation.toggleDrawer()}>
									<SvgUri width="40" height="39" svgXmlData={AppLogo} />
								</TouchableOpacity>
							) : (
									<Text> </Text>
								)}
						</View>
					)}
			</SafeAreaView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		height: 50,
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',
		width: '100%',
		backgroundColor: '#fff',
		padding: 10
	},
	linearGradient: {
		flexDirection: 'row',
		borderRadius: 0,
		width: '100%',
		alignItems: 'center',
		height: 50,
		justifyContent: 'flex-start'
	}
});

export default Header;

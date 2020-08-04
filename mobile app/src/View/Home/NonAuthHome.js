import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList } from 'react-native';
import { Icon } from 'react-native-elements';
import Modal from 'react-native-modal';
import star from '../../assets/images/star.png';
import LinearGradient from 'react-native-linear-gradient';
import CountDown from 'react-native-countdown-component';
import { fetchGifts, getUser } from '../../actions';
import { connect } from 'react-redux';

class NonAuthHome extends Component {
	static navigationOptions = ({ navigation }) => {
		return {
			headerTitle: (
				<Image
					resizeMode="contain"
					// style={{ marginLeft: 50 }}
					source={require('../../assets/images/Gimonii.png')}
				/>
			),
			// headerTitleStyle: { flex: 1, textAlign: 'center' },
			headerStyle: {
				backgroundColor: '#fff',
				elevation: 0
				// alignItems: 'center'
			},
			headerTintColor: '#fff',
			headerBackImage: <Icon name={'chevron-left'} />,
			headerRight: (
				<TouchableOpacity onPress={() => navigation.toggleDrawer()}>
					<Image style={{ marginRight: 10 }} source={require('../../assets/images/menu.png')} />
				</TouchableOpacity>
			)
		};
	};
	constructor(props) {
		super(props);
		this.state = {
			participate: true,
			modalVisible: false,
			cardData: {},
			affiliationModal: false,
			affiliationCode: '',
			checkVerify: false,
			confirmPay: false,
			id: '',
			loader: false,
			modal2: false
		}

	}

	componentWillReceiveProps(newProps) {
		if (newProps.navigation.state.params) {
			if (newProps.navigation.state.params.payment == true) {
				this.setState({ modal2: !this.state.modal2 })
			}
		}
	}
	_renderItem = ({ item }) => (
		<TouchableOpacity
			// onPress={() => this.props.navigation.navigate('HomeInner', { iphone, item })}
			style={styles.productBox}
		>
			<Image source={iphone} style={styles.productImg} />
			{/* <Icon name="share" color="black" onPress={() => this.share(item)} /> */}
			<View style={styles.productTxtBox}>
				<Text style={styles.productPrice}>$50</Text>
				<Text style={styles.productName}>gift 1</Text>
				<Text style={styles.productDes}>this is gift description</Text>
			</View>
		</TouchableOpacity>
	);

	render() {
		return (
			<View style={styles.container}>
				<LinearGradient
					colors={['#F56464', '#FF984C']}
					start={{ x: 0, y: 1 }}
					end={{ x: 2, y: 2 }}
					locations={[0, 0.5]}
					style={styles.linearGradient}
				>
					<View style={styles.winSec}>
						<View>
							<Text style={[styles.winText, { fontSize: 20, fontWeight: '100' }]}>
								Total amount
									</Text>
							<Text
								style={[
									styles.winText,
									{ fontSize: 12, fontWeight: 'bold', marginBottom: 10 }
								]}
							>
								WIN TODAY
									</Text>
							<Text style={[styles.winText, { fontSize: 24, fontWeight: 'bold' }]}>
								$ 45000
									</Text>
						</View>
						<View style={styles.verticalBorder} />
						<View>
							<Text style={[styles.winText, { fontSize: 20, fontWeight: '100' }]}>
								Win this Month
									</Text>
							<Text
								style={[
									styles.winText,
									{ fontSize: 12, fontWeight: 'bold', marginBottom: 10 }
								]}
							>
								CHRISTOPHER LONG
									</Text>
							<Text style={[styles.winText, { fontSize: 24, fontWeight: 'bold' }]}>
								$ 108 000
									</Text>
						</View>
					</View>
				</LinearGradient>
				<View style={styles.participateBox}>
					<Text style={{ fontFamily: 'SFProDisplay-Regular' }}>Subsciption to participate</Text>
					<TouchableOpacity 
					// onPress={() => {
					// 	this.setModalVisible(true);
					// }} 
					style={[styles.textFieldContainer]}>
						<LinearGradient
							colors={['#FF984C', '#F56464']}
							start={{ x: 0, y: 1 }}
							end={{ x: 2, y: 2 }}
							locations={[0, 0.5]}
							style={[styles.linearGradients, { width: 120, height: 40 }]}
						>
							<Text style={{ color: '#fff', fontSize: 16, lineHeight: 19, fontFamily: 'SFProDisplay-Regular', }}>Participate</Text>
						</LinearGradient>
					</TouchableOpacity>
				</View>
				<View style={styles.productContainer}>
					<FlatList
						data={this.props.data}
						numColumns={2}
						keyExtractor={(item, index) => item.id}
						renderItem={this._renderItem}
					/>
				</View>
				<View style={styles.textFieldContainer} />
				<View
					style={{
						position: 'absolute',
						// top: 0,
						bottom: 5,
						alignItems: 'center',
						justifyContent: 'flex-end',
						flexDirection: 'row'
					}}
				>
					<Text style={styles.nextwin}>NEXT WIN</Text>
					<CountDown
						until={60}
						timeToShow={['H', 'M', 'S']}
						timeLabelStyle={{
							backgroundColor: '#EA3E35',
							color: '#fff',
							width: 69,
							textAlign: 'center',
							marginTop: -10,
							fontSize: 14
						}}
						digitStyle={{ backgroundColor: '#EA3E35', borderRadius: 2 }}
						digitTxtStyle={{ color: '#fff' }}
						timeLabels={{ d: 'Days', h: 'Hours', m: 'Minutes', s: 'Seconds' }}
						// onFinish={() => this.onSubmit()}
						// onPress={() => alert('hello')}
						size={30}
					/>
				</View>
				<Modal
					backdropColor={'black'}
					backdropOpacity={0.1}
					animationIn="zoomInDown"
					animationOut="zoomOutUp"
					animationInTiming={1000}
					animationOutTiming={1000}
					backdropTransitionInTiming={1000}
					backdropTransitionOutTiming={1000}
					isVisible={this.state.modal2}
				>
					<View
						style={{
							backgroundColor: '#fff',
							height: 350,
							alignItems: 'center',
							justifyContent: 'space-around',
							borderRadius: 5
						}}
					>
						<Image source={star} style={styles.payimg} />
						<Text style={styles.payHead}>Thanks for order!</Text>
						<Text style={styles.paysubHead}>
							You are know abble to participate everyday to GIMONII Project
						</Text>

						<TouchableOpacity onPress={() => { this.setState({ modal2: !this.state.modal2 }) }} style={{ width: '90%' }}>
							<LinearGradient
								colors={['#FF984C', '#F56464']}
								start={{ x: 0, y: 1 }}
								end={{ x: 2, y: 2 }}
								locations={[0, 0.5]}
								style={styles.linearGradients}
							>
								<Text style={{ color: '#fff' }}>Let's Gimonii</Text>
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
		// justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#fff'
	},
	affHead: {
		fontFamily: 'SFProDisplay-Regular',
		fontSize: 20,
		lineHeight: 32,
		textAlign: 'center',
		color: '#000'
	},
	payHead: {
		fontFamily: 'SFProDisplay-Regular',
		fontSize: 20,
		lineHeight: 32,
		textAlign: 'center',
		color: '#F88735'
	},
	affsubHead: {
		fontFamily: 'SFProDisplay-Regular',
		fontSize: 16,
		width: '90%',
		lineHeight: 24,
		textAlign: 'center'
	},
	paysubHead: {
		fontFamily: 'SFProDisplay-Regular',
		fontSize: 16,
		width: '90%',
		lineHeight: 24,
		textAlign: 'center'
	},
	participateimg: {
		width: 200,
		height: 200,
		marginTop: 30
	},
	payimg: {
		width: 150,
		height: 150,
		marginTop: 30
	},
	textView: {
		justifyContent: 'center',
		padding: 10
	},
	nextwin: {
		color: '#EA3838',
		height: 87,
		marginTop: -2,
		fontFamily: 'SFProDisplay-Regular',
		fontStyle: 'normal',
		fontWeight: 'bold',
		fontSize: 16,
		lineHeight: 17,
		textAlignVertical: 'center',
		paddingTop: 30,
		alignItems: 'center',
		borderRadius: 2,
		textAlign: 'center',
		width: 70,
		// backgroundColor: '#EA3838'
	},
	borderRight: {
		borderRightColor: 'orange',
		borderRightWidth: 0.5
	},
	modal: {
		flexDirection: 'column',
		justifyContent: 'space-between',
		marginLeft: 20,
		alignItems: 'center',
		width: '90%'
	},
	textCenter: {
		textAlign: 'center',
		color: 'orange',
		fontSize: 18
	},
	loader: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	linearGradient: {
		width: '100%',
		height: 150,
		justifyContent: 'center',
		marginTop: 10
	},
	linearGradients: {
		// bottom: 16,
		borderRadius: 4,
		marginTop: 10,
		// width:"80%",
		alignItems: 'center',
		height: 50,
		justifyContent: 'center'
	},
	participateBox: {
		backgroundColor: '#fff',
		borderRadius: 5,
		width: '90%',
		elevation: 5,
		alignItems: 'center',
		zIndex: 2,
		marginTop: -20,
		paddingVertical: 10
	},
	time: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		width: '80%',
		alignItems: 'center',
		fontFamily: 'SFProDisplay-Regular',
		backgroundColor: '#fff',
		elevation: 5,
		margin: 20,
		borderRadius: 5,
		position: 'absolute',
		top: 400
	},
	winSec: {
		justifyContent: 'space-around',
		alignItems: 'center',
		flexDirection: 'row'
		// marginTop: 20
	},
	winText: {
		textAlign: 'center',
		fontFamily: 'SFProDisplay-Regular',
		color: '#fff'
	},
	verticalBorder: {
		height: 70,
		borderLeftColor: '#fff',
		borderLeftWidth: 0.5
	},
	productContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
		// flex: 1
	},
	productBox: {
		backgroundColor: '#fff',
		justifyContent: 'center',
		// alignItems: 'center',
		width: '40%',
		height: 250,
		margin: 10,
		marginLeft: '6%',
		elevation: 3,
		borderRadius: 5
	},
	productImg: {
		width: 120,
		height: 60,
		marginLeft: 10,
		marginBottom: 10
	},
	productTxtBox: {
		marginLeft: 10
	},
	productPrice: {
		color: '#FB9A05',
		fontFamily: 'SFProDisplay-Regular',
		fontSize: 18,
		fontWeight: 'bold',
		marginTop: 10,
		textAlign: 'left'
	},
	productName: {
		color: '#000',
		fontFamily: 'SFProDisplay-Regular',
		fontSize: 14,
		marginTop: 10
	},
	productDes: {
		fontSize: 12,
		fontFamily: 'SFProDisplay-Regular',
		marginTop: 5
	},
	paysubHead: {
		fontFamily: 'SFProDisplay-Regular',
		fontSize: 16,
		width: '90%',
		lineHeight: 24,
		textAlign: 'center'
	},
});
const mapStateToProps = ({ gift, auth }) => {
	const { data, loading } = gift;
	const { user } = auth;
	return { data, loading, user };
};
export default connect(mapStateToProps, {
	fetchGifts,
	getUser
})(NonAuthHome);

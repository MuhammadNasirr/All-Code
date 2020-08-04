import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { fetchGifts } from '../../actions';
import { connect } from 'react-redux';

class Gift extends Component {
	static navigationOptions = {
		header: null
	};
	constructor(props) {
		super(props);
		
    }
    
    componentDidMount(){
        //data from api
        // console.warn("data",this.props.data)
    }


	render() {
		return (
			<View style={styles.container}>
				<Text>gift</Text>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	
});

const mapStateToProps = ({ gift }) => {
    const { data } = gift;
    return { data };
}

export default connect(mapStateToProps, {
	fetchGifts
})(Gift);

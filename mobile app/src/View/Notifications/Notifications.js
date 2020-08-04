import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet,SafeAreaView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { NotificationsList } from '../../Components'
import { ListItem, List, Icon } from 'react-native-elements'
import { withNavigationFocus } from 'react-navigation';

class Notifications extends Component {
    static navigationOptions = {
        header: null,
    }
    componentDidMount(){
        console.warn(this.props.navigation.getParam("key"),"params Mount")
    }
    render() {
        const { navigate, goBack } = this.props.navigation
        return (

            <SafeAreaView style={{ backgroundColor: '#fff', flex: 1, display: 'flex' }}>
                <LinearGradient colors={['#FF984C', '#F56464']}
						start={{ x: 0, y: 1 }}
						end={{ x: 2, y: 2 }}
						locations={[0, 0.5]} style={styles.linearGradientHeader}>
                    <TouchableOpacity
                        onPress={() => goBack(null)}
                        style={{ margin: 10 }}
                    >
                        <Icon
                            name='chevron-left'
                            color='#fff'
                            type='MaterialIcons'
                            size={25} />
                    </TouchableOpacity>
                    <Text style={styles.textHeader}>
                        Notifications
                    </Text>
                </LinearGradient>
            {/* nortification list component */}
                <NotificationsList
                    navigate={navigate}
                />
            </SafeAreaView>

        )
    }
}
const styles = new StyleSheet.create({
    linearGradientWrapperHeader: {
        alignItems: 'center',
        // display:'flex',
        // flexDirection:'row'
    },
    linearGradientHeader: {
        width: '100%',
        paddingVertical: 5,
        flexDirection: 'row',
        paddingHorizontal: 10,
        alignItems:'center',
        justifyContent: 'flex-start'
    },
    textHeader: {
        fontSize: 17,
        fontFamily: 'SFProDisplay-Regular',
        textAlign: 'left',
        margin: 10,
        color: '#ffffff',
        backgroundColor: 'transparent',
        alignItems: 'center',
        width: '75%'
    },
    profileScreenWrapper:
    {
        backgroundColor: '#fff',
        flex: 1,
        display: 'flex',
        marginBottom: 50
    },

    commentBoxWrapper: {
        position: 'absolute',
        // top: '88%',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        zIndex: 90
    },

    shadow: {
        borderWidth: 2,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        elevation: 25
    }
});

export default withNavigationFocus(Notifications);
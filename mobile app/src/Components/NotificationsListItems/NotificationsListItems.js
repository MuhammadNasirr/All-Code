import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Avatar } from 'react-native-elements';

class NotificationsListItems extends Component {
    render() {
        const {
            data,
            createdAt,
        } = this.props
        const firstName = data.winner.firstName
        const profilePicURL = data.winner.profilePicURL
        const title = data.winner.title
        console.log(data, "first name")
        return (
            <View style={styles.notificationContainer}>
                <View style={styles.avatarContainer}>
                    <Avatar
                        size='medium'
                        rounded
                        source={{ uri: profilePicURL }}
                        onPress={() => console.log("Works!")}
                        activeOpacity={0.7}
                        containerStyle={{
                            marginVertical: 4
                        }}
                        avatarStyle={{
                            borderRadius: 100,
                            borderWidth: 1,
                            borderColor: '#ffff'
                        }}
                    />
                </View>
                <View style={{ flexDirection: 'column', flexBasis: 280, justifyContent: 'center' }}>
                    <View>
                        <Text style={styles.messageText}>
                            {firstName} is a lucky one who received the {title} {createdAt}
                        </Text>
                    </View>

                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({

    avatarContainer: {
        flexBasis: 65
    },

    notificationContainer: {
        flex: 1,
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 1,
        padding: 5,
        width: "100%",
        marginVertical: 8,
        justifyContent: 'flex-start'

    },
    messageText: {
        fontSize: 14, fontFamily: 'SFProDisplay-Regular'
    },
});

export default NotificationsListItems;
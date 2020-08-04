import React, { Component } from 'react';
import {
    View,
    AsyncStorage
} from 'react-native';
import {
    NotificationsListItems,
    NotificationsListItems1
} from '../../Components';
import { connect } from 'react-redux';
import { Container, Content, Tab, Tabs } from 'native-base';
import { fireBase } from '../../firebase/firebase';
import English from "../../en"
import French from "../../fr"


class NotificationsList extends Component {
    static navigationOptions = {
        header: null,
    }
    state = {
        visible: false,
        placement: 'right',
        notifications: [],
        asyncLanguage: null,
        totalNotifications: '',
        useAffiliationNotification: []
    };
    renderDate = (timeStamp) => {
        const dateObj = new Date(timeStamp);
        const date = (dateObj.getMonth() + 1) + '/' + dateObj.getDate() + '/' + dateObj.getFullYear();
        return date
    }
    snapshotToArray = snapshot => Object.entries(snapshot).map(e => Object.assign(e[1], { uid: e[0] }));
    componentDidMount() {
        this.getNotificationuseAffiliation();
        this.getNotification();
        AsyncStorage.getItem('language').then(a => {
            this.setState({ asyncLanguage: a })
            console.warn(a, "check async props")
        })

    }
    componentWillReceiveProps(newProps) {
        AsyncStorage.getItem('language').then(a => {
            this.setState({ asyncLanguage: a })
            console.warn(a, "check async props")
        })
        if (newProps.language) {
            this.setState({ asyncLanguage: newProps.language })
        }
    }
    getNotificationuseAffiliation = () => {
        const db = fireBase.database();
        AsyncStorage.getItem("userData").then(uid => {
            console.log(uid, "uid useAffiliationNotification")
            db.ref("Notifications").orderByChild("type").equalTo("useAffiliation").on("value", snapshot => {
                if (snapshot.val()) {
                    let notifications = this.snapshotToArray(snapshot.val()).splice(0).reverse()
                    console.log('useAffiliationNotification', notifications)
                    notifications.map((l, a) => {
                        if (l.id == uid) {
                            this.setState({
                                useAffiliationNotification: [...this.state.useAffiliationNotification, l],
                            });
                            console.log("id matched", l)
                        }
                    })
                }
                else {
                    this.setState({
                        useAffiliationNotification: [],
                    });
                    console.log('err useAffiliationNotification')
                }
            })
        })
    }
    getNotification = () => {
        const db = fireBase.database();
        db.ref("Notifications").orderByChild("type").equalTo("winner").on("value", snapshot => {
            if (snapshot.val()) {
                let notifications = this.snapshotToArray(snapshot.val()).splice(0).reverse()
                this.setState({
                    notifications: notifications,
                    totalNotifications: notifications.length
                });
            }
            else {
                this.setState({
                    notifications: [],
                    totalNotifications: ''
                });
            }
        })
    }
    render() {
        const { notifications, useAffiliationNotification, asyncLanguage } = this.state;
        console.log(useAffiliationNotification, "state")
        return (
            <View
                style={{
                    backgroundColor: '#fff', flex: 1, display: 'flex'
                }}>
                <Container>
                    <Content style={{ margin: 15, marginTop: 20 }}>
                        <Tabs tabBarUnderlineStyle={{ backgroundColor: '#fff' }} >
                            <Tab activeTabStyle={{ backgroundColor: '#FF984C' }} textStyle={{ color: '#fff' }} activeTextStyle={{ color: '#fff' }} tabStyle={{ backgroundColor: '#FF984C' }} heading={asyncLanguage == 'fr' ? French.WINNERS : English.WINNERS}>
                                {
                                    notifications.map((l, i) => {
                                        console.log(l, "notifications")

                                        return (
                                            <NotificationsListItems
                                                data={l}
                                                createdAt={this.renderDate(l.createdAt)}
                                            />
                                        )
                                    })
                                }
                            </Tab>
                            <Tab tabStyle={{ backgroundColor: '#FF984C' }} textStyle={{ color: '#fff' }} activeTextStyle={{ color: '#fff' }} activeTabStyle={{ backgroundColor: '#FF984C' }} heading={asyncLanguage == 'fr' ? French.AFFILIATIONS : English.AFFILIATIONS}>
                                {
                                    useAffiliationNotification.map((l, i) => (
                                        <NotificationsListItems1
                                            data={l}
                                            createdAt={this.renderDate(l.createdAt)}
                                        />
                                    ))

                                }
                            </Tab>
                        </Tabs>
                    </Content>
                </Container>
            </View>
        )
    }
}
const mapStateToProps = ({ auth }) => {
    const { language } = auth;
    return { language };
};

export default connect(mapStateToProps)(NotificationsList);


import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, AsyncStorage, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Header } from '../../Components';
import { connect } from 'react-redux';
import English from "../../en"
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import French from "../../fr"
import { fireBase } from '../../firebase/firebase';

class ChangeLocation extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            password: '',
            asyncLanguage: null,
            location: "",
        };
    }
    componentDidMount() {
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
        if (newProps.user == 1) {
            AsyncStorage.removeItem('userData');
            this.props.navigation.navigate('Auth');
        }
    }
    setLocation(location) {
        this.setState({ location: location });
        console.warn('location', this.state.location);
    }
    snapshotToArray = snapshot => Object.entries(snapshot).map(e => Object.assign(e[1], { uid: e[0] }));

    onSubmit = () => {
        let me = this;
        const { location } = this.state;
        AsyncStorage.getItem("userData").then(id => {
            if (location !== '') {
                var leadsRef = fireBase.database().ref('Users');
                leadsRef.once('value', function (snapshot) {
                    var arr = me.snapshotToArray(snapshot.val())
                    if (!arr) {
                        alert('something went wrong');
                    } else {
                        fireBase.database().ref('/Users/' + id).update({
                            location: location,
                        })
                        me.props.navigation.navigate('Settings', { key: '1' })
                    }
                });
            } else {
                alert(asyncLanguage == 'fr' ? French.LOCATION_TEXT : English.LOCATION_TEXT);
            }
        })
    };

    render() {
        const { asyncLanguage } = this.state;
        return (
            <View style={styles.container}>
                <Header title={asyncLanguage == 'fr' ? French.LOCATION : English.LOCATION} iconleft={true} navigation={this.props.navigation} />
                <ScrollView style={{ width: '90%' }}>
                    <View style={styles.textFieldContainer}>
                        <Text style={{ marginTop: 10, color: '#6A6766', fontFamily: 'SFProDisplay-Regular' }}>
                            {asyncLanguage == "fr" ? French.LOCATION : English.LOCATION}
                        </Text>
                        <GooglePlacesAutocomplete
                            placeholder={asyncLanguage == "fr" ? French.SEARCH : English.SEARCH}
                            minLength={2}
                            autoFocus={false}
                            returnKeyType={'search'}
                            keyboardAppearance={'light'}
                            listViewDisplayed={false}
                            fetchDetails={true}
                            renderDescription={(row) => row.description}
                            onPress={(data) => {
                                this.setLocation(data.description);
                            }}
                            getDefaultValue={() => ''}
                            query={{
                                key: 'AIzaSyC-1dUdU_nJ8N4Zh3ijPzLF7MANu6sIkKQ',
                                language: 'en',
                                types: '(cities)'
                            }}
                            styles={{
                                textInputContainer: {
                                    height: 50,
                                    marginTop: 10,
                                    margin: 0,
                                    width: '100%',
                                    backgroundColor: '#fff',
                                    color: '#000',
                                    borderWidth: 1,
                                    borderRadius: 3,
                                    borderColor: '#d3d3d3'
                                },
                                textInput: {
                                    marginLeft: 0,
                                    marginRight: 0,
                                    margin: 0,
                                    height: 33,
                                    color: '#000',
                                    fontSize: 14,
                                    fontFamily: 'SFProDisplay-Regular'
                                },
                                description: {
                                    fontWeight: 'normal'
                                },
                                predefinedPlacesDescription: {
                                    color: '#d5d5d5',
                                    fontWeight: 'normal'
                                }
                            }}
                            currentLocation={false}
                            currentLocationLabel="Current location"
                            nearbyPlacesAPI="GooglePlacesSearch"
                            GoogleReverseGeocodingQuery={{}}
                            GooglePlacesSearchQuery={{
                                rankby: 'distance',
                                type: 'cafe'
                            }}
                            GooglePlacesDetailsQuery={{
                                fields: 'formatted_address'
                            }}
                            filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']}
                            debounce={200}
                        />
                    </View>
                </ScrollView>
                <TouchableOpacity onPress={this.onSubmit} style={[styles.textFieldContainer, { bottom: 20, width: '90%' }]}>
                    {this.props.loading ? (
                        <ActivityIndicator size="large" color="#FF984C" />
                    ) : (
                            <LinearGradient
                                colors={['#FF984C', '#F56464']}
                                start={{ x: 0, y: 1 }}
                                end={{ x: 2, y: 2 }}
                                locations={[0, 0.5]}
                                style={styles.linearGradient}
                            >
                                <Text style={{ color: '#fff' }}>{asyncLanguage == 'fr' ? French.UPDATE_NEW_LOCATION : English.UPDATE_NEW_LOCATION}</Text>
                            </LinearGradient>
                        )}
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    linearGradient: {
        borderRadius: 4,
        marginTop: 10,
        alignItems: 'center',
        height: 50,
        justifyContent: 'center'
    },
    textFieldContainer: {
        width: '100%',
        marginTop: 10,
    },
});

const mapStateToProps = ({ auth }) => {
    const { language } = auth;
    return { language };
};
export default connect(mapStateToProps)(ChangeLocation);

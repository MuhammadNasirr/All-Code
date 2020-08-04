import { auth, fireBase } from '../firebase/firebase'
import { AsyncStorage, Alert } from 'react-native';
import English from "../en"
import French from "../fr"

import {
    LOGIN_USER,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAIL,
    SIGNUP_USER,
    SIGNUP_USER_SUCCESS,
    SIGNUP_USER_FAIL,
    FORGET_PASSWORD,
    FORGET_PASSWORD_SUCCESS,
    FORGET_PASSWORD_FAIL,
    GET_USER,
    GET_USER_SUCCESS,
    GET_USER_FAIL,
    UPDATE_USER,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_FAIL,
    CHANGE_PASSWORD,
    CHANGE_PASSWORD_SUCCESS,
    CHANGE_PASSWORD_FAIL,
    CHANGE_LANGUAGE
} from './types';

var asyncStorage = '';
var checkLanguage = new Promise(function (resolve, reject) {
    AsyncStorage.getItem('language').then(a => {
        console.warn(a, "check async action")
        if (a) {
            resolve(a);
        } else {
            reject();
        }
    })
});

export const changeLanguage = (text) => {

    return (dispatch) => {
        dispatch({ type: CHANGE_LANGUAGE, payload: text });
    };
};

export const loginUser = (text, Pass) => {

    return (dispatch) => {
        dispatch({ type: LOGIN_USER });
        const eventref = fireBase.database().ref("Users").orderByChild("email").equalTo(text);
        eventref.once('value')
            .then(snapshot => {
                console.log('aaa', snapshot.val())
                if (snapshot.val()) {
                    auth.signInWithEmailAndPassword(text, Pass)
                        .then(user => {
                            fireBase.database().ref(`/Users/${user.user.uid}`).once('value')
                                .then((snapshot) => {
                                    if (snapshot.val().isDeleted == "true") {
                                        loginuserFail(dispatch, ERROR_CODE_USER_NOT_FOUND);
                                    } else {
                                        AsyncStorage.setItem('userData', user.user.uid);
                                        loginUserSuccess(dispatch, user)
                                    }
                                }).catch(err => {
                                    loginuserFail(dispatch, ERROR_CODE_USER_NOT_FOUND);

                                })
                        })
                        .catch((error) => {
                            loginuserFail(dispatch, error);
                        });
                } else {
                    loginuserFail(dispatch, ERROR_CODE_USER_NOT_FOUND);
                }
            })
    };
};

export const emailSend = (data) => {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    };
    return fetch(`https://www.gimonii.com/api/sendEmail`, requestOptions);
};

export const signupUser = ({ firstName, email, sub_Id, affiliationCode, myAffiliation, location, password, profilePicURL, navigation }) => {
    return (dispatch) => {
        dispatch({ type: SIGNUP_USER });
        console.warn("createuserthen", sub_Id)
        auth.createUserWithEmailAndPassword(email, password)
            .then(user => {
                checkLanguage.then(res => {
                    let body = {
                        email: email,
                        text: res === 'fr' ? SuccessMailFR : SuccessMail
                    }
                    emailSend(body).then(res => {
                        console.warn('res', res)
                    }).catch(err => {
                        console.warn('err', err)
                    })
                })
                const code = Math.random().toString(36).substring(7);
                fireBase.auth().currentUser.sendEmailVerification()
                    .then(function () {
                        console.warn("sendEmailVerification")
                    }, function (error) {
                        alert(error)
                    });
                var date = Date.now() + 60 * 60 * 24 * 31 * 1000
                var afterOneMonthDate = new Date(date)
                console.warn("before fireBase")
                fireBase.database().ref('Users/' + user.user.uid)
                    .set({
                        "id": user.user.uid, "email": email, "expireSubscriptionOn": afterOneMonthDate, "sub_id": sub_Id, "isDeleted": "false",
                        "firstName": firstName, "affiliationCode": affiliationCode, "myAffiliation": myAffiliation, "location": location, "points": 0, "profilePicURL": profilePicURL, "status": 1, "inviteCode": code, "role": "user"
                    })
                    .then(res => {
                        AsyncStorage.setItem('postUserUid', user.user.uid)
                        navigation.navigate('NonAuthHome', { payment: true })
                        // AsyncStorage.getItem('postUserUid').then((uid) => {
                        // 	console.warn('container user.user.uid', uid);
                        // 	// var date = Date.now() + 60 * 60 * 24 * 31 * 1000
                        // 	// var afterOneMonthDate = new Date(date)
                        // 	// fireBase.database().ref('Users/' + uid).update({  expireSubscriptionOn: afterOneMonthDate });
                        // 	// alert('uploaded');
                        // 	// console.log('url', url);
                        // });
                        signupUserSuccess(dispatch, user)
                    })
                    .catch(err => {
                        signupUserFail(dispatch, error)
                    })
            })
            .catch((error) => {
                signupUserFail(dispatch, error);
            });
    };
};

export const forgetPassword = (email) => {
    return (dispatch) => {
        dispatch({ type: FORGET_PASSWORD });
        auth.sendPasswordResetEmail(email)
            .then(user => {
                forgetPassSuccess(dispatch, user)
            })
            .catch((error) => {
                forgetPassFail(dispatch, error);
            });
    };
};

export const changePassword = (password) => {
    return (dispatch) => {
        var currentUser = fireBase.auth().currentUser;
        console.warn("current user", currentUser)
        dispatch({ type: CHANGE_PASSWORD });
        currentUser.updatePassword(password)
            .then(user => {
                changePasswordSuccess(dispatch, user)
            })
            .catch((error) => {
                changePasswordFail(dispatch, error);
            });
    };
};

export const getUser = (navigation) => {
    return (dispatch) => {
        dispatch({ type: GET_USER });
        AsyncStorage.getItem('userData')
            .then(uid => {
                console.log("uid getUser", uid)
                fireBase.database().ref(`/Users/${uid}`).once('value')
                    .then((snapshot) => {
                        AsyncStorage.setItem('UserFullData', snapshot.val())
                        dispatch({ type: GET_USER_SUCCESS, payload: snapshot.val() })
                    })
                    .catch((err) => dispatch({ type: GET_USER_FAIL }))
            })
    };
};

export const updateUser = ({ id, firstName, email, affiliationCode, location }) => {
    return (dispatch) => {
        dispatch({ type: UPDATE_USER });
        fireBase.database().ref('/Users/' + id).update({
            firstName,
            email,
            affiliationCode,
            location
        })
            .then((res) => {
                dispatch({ type: UPDATE_USER_SUCCESS, payload: res })
            })
            .catch((err) => dispatch({ type: UPDATE_USER_FAIL }))


    };
};


export const ERROR_CODE_USER_NOT_FOUND = 'Error: There is no user record corresponding to this identifier. The user may have been deleted.';
export const ERROR_CODE_WRONG_PASSWORD = 'Error: The password is invalid or the user does not have a password.';
export const ERROR_MSG_USER_NOT_FOUND = 'Invalid email. Try login again !';
export const ERROR_MSG_WRONG_PASSWORD = 'Your password in incorrect !';
export const ERROR_MSG_BAD_FORMAT = 'The email address is badly formatted.';
export const ERROR_MSG_BAD_FORMATT = 'Error: The email address is badly formatted.';
export const ERROR_MSG_ALREADY_USED_EMAIL = 'The email address is already in use by another account.';
export const SuccessMailFR = 'Bienvenu chez Gimonii Tu participes maintenant au tirage au sort quotidien N’hésites pas à communiquer ton code personnel pour gagner de l’argent facilement L’équipe Gimonii.';
export const SuccessMail = 'Welcome to Gimonii You are now participating in the daily lottery Dont hesitate to communicate your personal code to make easy money Gimonii team';

const loginuserFail = (dispatch, error) => {
    if (error == ERROR_CODE_USER_NOT_FOUND) {
        checkLanguage.then(res => {
            console.warn(res, 'check lang')
            Alert.alert(
                'Alert',
                `${res == 'fr' ? French.ERROR_CODE_USER_NOT_FOUND : English.ERROR_CODE_USER_NOT_FOUND}`,
                [
                    {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                    },
                    { text: 'OK', onPress: () => console.log('OK Pressed') },
                ],
                { cancelable: false },
            );
        })
    } else if (error == ERROR_CODE_WRONG_PASSWORD) {
        checkLanguage.then(res => {
            Alert.alert(
                'Alert',
                `${res == 'fr' ? French.ERROR_MSG_WRONG_PASSWORD : English.ERROR_MSG_WRONG_PASSWORD}`,
                [
                    {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                    },
                    { text: 'OK', onPress: () => console.log('OK Pressed') },
                ],
                { cancelable: false },
            );
        })
    } else if (error.message == ERROR_MSG_BAD_FORMAT) {
        checkLanguage.then(res => {

            Alert.alert(
                'Alert',
                `${res == 'fr' ? French.EMAIL_ERROR : English.EMAIL_ERROR}`,
                [
                    {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                    },
                    { text: 'OK', onPress: () => console.log('OK Pressed') },
                ],
                { cancelable: false },
            );
        })
    }
    dispatch({ type: LOGIN_USER_FAIL });

};

const loginUserSuccess = (dispatch, user) => {
    dispatch({
        type: LOGIN_USER_SUCCESS,
        payload: user
    });

}

const signupUserFail = (dispatch, error) => {
    dispatch({ type: SIGNUP_USER_FAIL });
    if (error.message == ERROR_MSG_BAD_FORMAT) {
        checkLanguage.then(res => {

            Alert.alert(
                'Alert',
                `${res == 'fr' ? French.EMAIL_ERROR : English.EMAIL_ERROR}`,
                [
                    {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                    },
                    { text: 'OK', onPress: () => console.log('OK Pressed') },
                ],
                { cancelable: false },
            );
        })
    } else if (error.message == ERROR_MSG_ALREADY_USED_EMAIL) {
        checkLanguage.then(res => {

            Alert.alert(
                'Alert',
                `${res == 'fr' ? French.ERROR_MSG_ALREADY_USED_EMAIL : English.ERROR_MSG_ALREADY_USED_EMAIL}`,
                [
                    {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                    },
                    { text: 'OK', onPress: () => console.log('OK Pressed') },
                ],
                { cancelable: false },
            );
        })
    } else {
        checkLanguage.then(res => {

            Alert.alert(
                'Alert',
                `${res == 'fr' ? French.ERROR_MSG_ALREADY_USED_EMAIL : English.ERROR_MSG_ALREADY_USED_EMAIL}`,
                [
                    {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                    },
                    { text: 'OK', onPress: () => console.log('OK Pressed') },
                ],
                { cancelable: false },
            );
        })
    }
};

const signupUserSuccess = (dispatch, user) => {
    dispatch({
        type: SIGNUP_USER_SUCCESS
    });
}

const forgetPassFail = (dispatch, error) => {
    dispatch({ type: FORGET_PASSWORD_FAIL });
    checkLanguage.then(res => {

        if (error == ERROR_CODE_USER_NOT_FOUND) {
            error = res == 'fr' ? French.ERROR_CODE_USER_NOT_FOUND : English.ERROR_CODE_USER_NOT_FOUND
            Alert.alert(
                'Alert',
                `${error}`,
                [
                    {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                    },
                    { text: 'OK', onPress: () => console.log('OK Pressed') },
                ],
                { cancelable: false },
            );
        }
        else if (error == ERROR_MSG_BAD_FORMATT) {
            checkLanguage.then(res => {

                Alert.alert(
                    'Alert',
                    `${res == 'fr' ? French.EMAIL_ERROR : English.EMAIL_ERROR}`,
                    [
                        {
                            text: 'Cancel',
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'cancel',
                        },
                        { text: 'OK', onPress: () => console.log('OK Pressed') },
                    ],
                    { cancelable: false },
                );
            })
        }
    })
};

const forgetPassSuccess = (dispatch, user) => {

    dispatch({
        type: FORGET_PASSWORD_SUCCESS,
        payload: user
    });
    checkLanguage.then(res => {

        Alert.alert(
            'Alert',
            `${res == 'fr' ? French.EMAIL_SENT : English.EMAIL_SENT}`,
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: 'OK', onPress: () => console.log('OK Pressed') },
            ],
            { cancelable: false },
        );
    })
}

const changePasswordFail = (dispatch, error) => {
    dispatch({ type: CHANGE_PASSWORD_FAIL });
    checkLanguage.then(res => {
        if (error == "Error: The password must be 6 characters long or more.") {
            error = res == 'fr' ? French.ERROR_LONG_PASS : English.ERROR_LONG_PASS
            Alert.alert(
                'Alert',
                `${error}`,
                [
                    {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                    },
                    { text: 'OK', onPress: () => console.log('OK Pressed') },
                ],
                { cancelable: false },
            );
        }
        else if (error == "Error: Password should be at least 6 characters") {
            error = res == 'fr' ? French.ERROR_SHOULD_LONG_PASS : English.ERROR_SHOULD_LONG_PASS
            Alert.alert(
                'Alert',
                `${error}`,
                [
                    {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                    },
                    { text: 'OK', onPress: () => console.log('OK Pressed') },
                ],
                { cancelable: false },
            );
        }
        else if (error == "Error: This operation is sensitive and requires recent authentication. Log in again before retrying this request.") {
            error = res == 'fr' ? French.ERROR_SENSITIVE_PASS : English.ERROR_SENSITIVE_PASS
            Alert.alert(
                'Alert',
                `${error}`,
                [
                    {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                    },
                    { text: 'OK', onPress: () => console.log('OK Pressed') },
                ],
                { cancelable: false },
            );
        }
    })
};

const changePasswordSuccess = (dispatch, user) => {
    dispatch({
        type: CHANGE_PASSWORD_SUCCESS,
        payload: user
    });
    checkLanguage.then(res => {
        text = res == 'fr' ? French.PASSWORD_CHANGED : English.PASSWORD_CHANGED
        Alert.alert(
            'Alert',
            `${text}`,
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: 'OK', onPress: () => console.log('OK Pressed') },
            ],
            { cancelable: false },
        );
    })

}

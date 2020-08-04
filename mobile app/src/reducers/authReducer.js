import {
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAIL,
    LOGIN_USER,
    SIGNUP_USER_SUCCESS,
    SIGNUP_USER_FAIL,
    SIGNUP_USER,
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
} from '../actions/types';


const INITIAL_STATE = {
    email: '',
    password: '',
    user: null,
    error: '',
    loading: false,
    language: 'fr',
    forgetLink: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case LOGIN_USER:
            return { ...state, loading: true, error: '' };
        case LOGIN_USER_SUCCESS:
            return { ...state, ...INITIAL_STATE, user: 1 };
        case LOGIN_USER_FAIL:
            return { ...state, error: 'Authentication Failed', password: '', loading: false };
        case SIGNUP_USER:
            return { ...state, loading: true, error: '' };
        case SIGNUP_USER_SUCCESS:
            return { ...state, ...INITIAL_STATE, user: 2 };
        case SIGNUP_USER_FAIL:
            return { ...state, error: 'Authentication Failed', password: '', loading: false };
        case FORGET_PASSWORD:
            return { ...state, loading: true, error: '' };
        case FORGET_PASSWORD_SUCCESS:
            return { ...state, ...INITIAL_STATE, user: action.payload, forgetLink: true };
        case FORGET_PASSWORD_FAIL:
            return { ...state, error: 'Failed', password: '', loading: false };
        case GET_USER:
            return { ...state, loading: true, error: '' };
        case GET_USER_SUCCESS:
            return { ...state, ...INITIAL_STATE, user: action.payload };
        case GET_USER_FAIL:
            return { ...state, ...INITIAL_STATE, error: 'Failed' };
        case UPDATE_USER:
            return { ...state, loading: true, error: '' };
        case UPDATE_USER_SUCCESS:
            return { ...state, ...INITIAL_STATE, user: 1 };
        case UPDATE_USER_FAIL:
            return { ...state, ...INITIAL_STATE, error: 'Failed' };
        case CHANGE_PASSWORD:
            return { ...state, loading: true, error: '' };
        case CHANGE_PASSWORD_SUCCESS:
            return { ...state, ...INITIAL_STATE, user: 1 };
        case CHANGE_PASSWORD_FAIL:
            return { ...state, ...INITIAL_STATE, error: 'Failed' };
        case CHANGE_LANGUAGE:
            return { ...state,...INITIAL_STATE, language: action.payload };
        default:
            return state;
    }
};
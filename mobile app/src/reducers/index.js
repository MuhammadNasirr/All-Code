import { combineReducers } from 'redux';
import AuthReducer from './authReducer';
import GiftReducer from './giftReducer';


export default combineReducers({
    auth: AuthReducer,
    gift: GiftReducer
});
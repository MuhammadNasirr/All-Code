import { fireBase } from '../firebase/firebase';

import {
    GIFT_ITEM,
    GIFT_ITEM_SUCCESS,
    GIFT_ITEM_FAIL
} from './types';


export const fetchGifts = () => {
    return (dispatch) => {
        dispatch({ type: GIFT_ITEM });
        fireBase.database().ref('gifts').once('value')
            .then(snapshot => {
                dispatch({ type: GIFT_ITEM_SUCCESS, payload:Object.values(snapshot.val()) })
            })
            .catch((err) => dispatch({ type: GIFT_ITEM_FAIL }))
    };
};


import {
    GIFT_ITEM,
    GIFT_ITEM_SUCCESS,
    GIFT_ITEM_FAIL
} from '../actions/types';


const INITIAL_STATE = {
    data:[],
    error: '',
    loading: false,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case GIFT_ITEM:
            return { ...state, loading: true, error: '' };
        case GIFT_ITEM_SUCCESS:
            return { ...state, ...INITIAL_STATE, data: action.payload };
        case GIFT_ITEM_FAIL:
            return { ...state, error: 'Data Failed', loading: false };
        default:
            return state;
    }
};
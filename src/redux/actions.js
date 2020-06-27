import {FETCH_DATA_REQUEST,FETCH_DATA_SUCCESS,FETCH_DATA_FAILURE} from './types'

const fetchDataRequest = () => {
    return  {
        type : FETCH_DATA_REQUEST
    }
}

const fetchDataSuccess = (data) => {
    return {
        type : FETCH_DATA_SUCCESS,
        payload : data
    }
}

const fetchDataFailure= (error) => {
    return {
        type : FETCH_DATA_FAILURE,
        payload : error
    }
}


export {fetchDataRequest,fetchDataSuccess,fetchDataFailure}
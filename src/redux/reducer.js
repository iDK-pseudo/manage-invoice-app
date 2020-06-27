import {FETCH_DATA_REQUEST,FETCH_DATA_SUCCESS,FETCH_DATA_FAILURE} from './types'
import {fetchDataRequest,fetchDataSuccess,fetchDataFailure} from './actions'
import axios from 'axios'

const initialState = {
    data  : [],
    loading : false,
    error : ''
}

export const reducer = (state = initialState, action) => {
    switch(action.type) {
        case FETCH_DATA_REQUEST : 
            return {
                ...state,
                loading : true
            }

        case FETCH_DATA_SUCCESS :
            return {
                loading : false,
                data : action.payload,
                error : ''
            }

        case FETCH_DATA_FAILURE : 
            return {
                loading : false,
                data : [],
                error : action.payload
            }

        default : 
            return state
    }
}

export const fetchData = () =>{
    return function (dispatch) {
        dispatch(fetchDataRequest())
        axios.get('http://localhost:8080/1706592/dummyServlet')
            .then(response => {
                response.data.forEach(record => {
                    record.customer_name = record.customer_name.toUpperCase()
                })

                dispatch(fetchDataSuccess(response.data))
            })
            .catch(error => {
                console.log('err',error.message)
                dispatch(fetchDataFailure(error.message))
            }) 
    }
}
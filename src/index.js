import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import theme from '../src/utils/theme';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { createStore,applyMiddleware } from 'redux'
import {reducer,fetchData} from '../src/redux/reducer'
import thunkMiddleware from 'redux-thunk'
import { Provider } from 'react-redux'


// ReactDOM.render(
//     <MuiThemeProvider theme={theme}>
//       <App />
//     </MuiThemeProvider>,
//   document.getElementById('root')
// );

const store = createStore(reducer,applyMiddleware(thunkMiddleware))
store.subscribe(() => {})
store.dispatch(fetchData())

 ReactDOM.render(
   <Provider store={store}>
     <MuiThemeProvider theme={theme}>
       <App />
     </MuiThemeProvider>
   </Provider>,
   document.getElementById('root')
 );

serviceWorker.unregister();



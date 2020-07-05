// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import App from './App';
// import * as serviceWorker from './serviceWorker';
// import 'antd/dist/antd.css';
// import { BrowserRouter } from 'react-router-dom';

// ReactDOM.render(
// 	<BrowserRouter>
// 		<React.StrictMode>
// 			<App />
// 		</React.StrictMode>
// 	</BrowserRouter>,
// 	document.getElementById('root')
// );

// // If you want your app to work offline and load faster, you can change
// // unregister() to register() below. Note this comes with some pitfalls.
// // Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.register();

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { reducer } from './store/reducers/user';
import { watchSaga } from './store/sagas/watchSaga';
import { ZeitProvider } from '@zeit-ui/react';
// import { ToastProvider } from 'react-toast-notifications';
import 'antd/dist/antd.css';

const rootReducer = reducer;

const sagaMiddleware = createSagaMiddleware();

const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(watchSaga);

ReactDOM.render(
	<Provider store={store}>
		<BrowserRouter>
			<React.StrictMode>
				<ZeitProvider>
					{/* <ToastProvider autoDismiss='true'> */}
					<App />
					{/* </ToastProvider> */}
				</ZeitProvider>
			</React.StrictMode>
		</BrowserRouter>
	</Provider>,
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

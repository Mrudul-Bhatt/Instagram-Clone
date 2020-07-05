import { takeEvery, all } from 'redux-saga/effects';

import { sagaSignin, sagaLogout, sagaCheckAuth } from './user';

//ON EVERY CALL TO 'AUTH_CHECK_TIMEOUT' , checkTimeoutSage will get executed
//ACTION TYPES HERE ARE COMPELETELY DIFF FROM ACTION TYPES IN REDUCERS FNS
//THIS IS WATCH SAGA FILE , ACTION TYPES HERE WILL DEFINE WHICH DAGA FN TO EXECUTE
//SAGA FNS ONLY HANDLE ASYNC OPERATIONS

export function* watchSaga() {
	yield all([
		takeEvery('SIGNIN', sagaSignin),
		takeEvery('LOGOUT', sagaLogout),
		takeEvery('CHECK_AUTH', sagaCheckAuth),
	]);
}

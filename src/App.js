// import React from 'react';
// import './App.css';
// import Navbar from './components/Navbar';
// import Signin from './components/Pages/Signin';
// import { Route, Switch } from 'react-router';
// import Signup from './components/Pages/Signup';

// function App() {
// 	let routes = (
// 		<Switch>
// 			<Route path='/signin' exact component={Signin} />
// 			<Route path='/signup' exact component={Signup} />
// 		</Switch>
// 	);

// 	return (
// 		<div>
// 			<Navbar />
// 			{routes}
// 		</div>
// 	);
// }

// export default App;

import React, { useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { Route, Switch, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import * as actions from './store/actions/user';
import Signup from './components/Pages/Signup';
import Signin from './components/Pages/Signin';
import Home from './components/Pages/Home';
import Explore from './components/Pages/Explore';
import AddPost from './components/Pages/AddPost';
import Profile from './components/Pages/Profile';
import User from './components/Pages/User';
import Collections from './components/Pages/Collections';
import CollectionList from './components/Pages/CollectionList';

const App = () => {
	const history = useHistory();
	const user = JSON.parse(localStorage.getItem('user'));
	const path = useSelector((state) => state.path);
	const dispatch = useDispatch();
	const checkAuth = () => dispatch(actions.checkAuth());

	useEffect(() => {
		//console.log('check auth');
		checkAuth();

		history.push(path);
	}, [path]);

	let routes = (
		<Switch>
			<Route path='/signin' exact component={Signin} />
			<Route path='/signup' exact component={Signup} />
		</Switch>
	);

	if (user) {
		routes = (
			<Switch>
				<Route path='/' exact component={Home} />
				<Route path='/explore' exact component={Explore} />
				<Route path='/addpost' exact component={AddPost} />
				<Route path='/profile' exact component={Profile} />
				<Route path='/user/:userId' exact component={User} />
				<Route path='/collections' exact component={Collections} />
				<Route path='/collectionlist' exact component={CollectionList} />
			</Switch>
		);
	}

	return (
		<div>
			<Navbar />
			{routes}
		</div>
	);
};

export default App;

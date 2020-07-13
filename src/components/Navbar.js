import { makeStyles } from '@material-ui/core/styles';
import {
	AppBar,
	Toolbar,
	ListItem,
	IconButton,
	ListItemText,
	Avatar,
	Divider,
	List,
	Typography,
	Box,
	Button,
	Drawer,
	ListItemIcon,
	ListItemAvatar,
	TextField,
	Dialog,
	Slide,
	Grid,
	Container,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
} from '@material-ui/core';
import moment from 'moment';
import {
	Home,
	Explore,
	PostAdd,
	Info,
	InsertPhoto,
	Close,
	CloudUpload,
	InsertLink,
	Collections,
	Search,
	Add,
	AddBoxTwoTone,
} from '@material-ui/icons';
import MenuIcon from '@material-ui/icons/Menu';
import { ExitToApp } from '@material-ui/icons';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import * as actions from '../store/actions/user';
import { baseUrl } from '../utility/helper';
import { message, Space } from 'antd';
import { Skeleton, Alert } from '@material-ui/lab';
import { LoaderSearch } from '../utility/loader';

const useStyles1 = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
	title: {
		flexGrow: 1,
	},
}));

const useStyles2 = makeStyles((theme) => ({
	appBar: {
		position: 'relative',
	},
	title: {
		marginLeft: theme.spacing(2),
		flex: 1,
	},
}));

const useStyles3 = makeStyles((theme) => ({
	paper: {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(4),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
}));

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction='up' ref={ref} {...props} />;
});

export default function NavBar() {
	const classes = useStyles1();
	const classes2 = useStyles2();
	const classes3 = useStyles3();
	const history = useHistory();
	const [activeNav, setActiveNav] = useState(2);
	const [nav, setNav] = useState(false);
	const [addPost, setAddPost] = useState(false);
	const [search, setSearch] = useState('');
	const user = JSON.parse(localStorage.getItem('user'));
	const dispatch = useDispatch();
	const logout = () => dispatch(actions.logout());

	const [title, setTitle] = useState('');
	const [body, setBody] = useState('');
	const [image, setImage] = useState('');
	const [url, setUrl] = useState(null);
	const [loader, setLoader] = useState(false);
	const [logoutDialog, setLogoutDialog] = useState(false);

	useEffect(() => {
		if (url) {
			if (!title || !body) {
				setUrl(null);
				setImage(null);
				message.error('Incomplete input, post could not be created!');
				return;
			}

			var date = moment().format('lll').toString();
			fetch(`${baseUrl}/createpost`, {
				method: 'post',
				headers: {
					'Content-type': 'application/json',
					Authorization: 'Bearer ' + localStorage.getItem('jwt'),
				},
				body: JSON.stringify({
					dateCreated: date,
					title,
					body,
					imageUrl: url,
				}),
			})
				.then((res) => res.json())
				.then((data) => {
					//console.log(data);
					if (data.error) {
						// M.toast({ html: data.error, classes: 'red' });
						message.error(data.error);
					} else {
						// M.toast({ html: 'Post created successfully', classes: 'green' });
						setTitle(null);
						setImage(null);
						setBody(null);
						setUrl(null);
						message.success('Post created!');
						history.push('/');
					}
					setLoader(false);
				})
				.catch((error) => {
					console.log(error);
					message.error('Server is down!');
					setLoader(false);
				});
		}
	}, [url]);

	const addUserPost = () => {
		setLoader(true);

		const data = new FormData();
		data.append('file', image);
		data.append('upload_preset', 'insta-clone');
		data.append('cloud_name', 'dxediwgyn');
		fetch('	https://api.cloudinary.com/v1_1/dxediwgyn/image/upload ', {
			method: 'post',
			body: data,
		})
			.then((res) => res.json())
			.then((data) => {
				//console.log(data);
				setUrl(data.url);
				if (data.error.message === 'Missing required parameter - file') {
					message.error(data.error.message);
				}
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const LogoutDialog = () => {
		return (
			<div>
				<Dialog
					fullWidth
					open={logoutDialog}
					TransitionComponent={Transition}
					keepMounted
					onClose={() => setLogoutDialog(false)}
				>
					<DialogTitle>{'Log Out ?'}</DialogTitle>
					<DialogContent>
						<DialogContentText>
							Do you want to log out this session ?
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={() => setLogoutDialog(false)} color='primary'>
							Cancel
						</Button>
						<Button
							onClick={() => {
								logout();
								setLogoutDialog(false);
							}}
							color='primary'
						>
							Yes
						</Button>
					</DialogActions>
				</Dialog>
			</div>
		);
	};

	const listNav = () => (
		<div
			style={{ width: '300px' }}
			role='presentation'
			onClick={() => setNav(false)}
			onKeyDown={() => setNav(false)}
		>
			<List>
				<ListItem button selected={activeNav === 1}>
					<ListItemAvatar>
						<Avatar src={user && user.imageUrl} />
					</ListItemAvatar>
					<ListItemText
						primary={user && user.name}
						secondary={user && user.email}
						onClick={() => {
							history.push('/profile');
							setActiveNav(1);
						}}
					/>
				</ListItem>
			</List>
			<Divider />
			<List>
				<ListItem button selected={activeNav === 2}>
					<ListItemIcon
						onClick={() => {
							history.push('/');
							setActiveNav(2);
						}}
					>
						<Home />
					</ListItemIcon>
					<ListItemText
						primary={'Home'}
						onClick={() => {
							history.push('/');
							setActiveNav(2);
						}}
					/>{' '}
				</ListItem>
			</List>
			<List>
				<ListItem button selected={activeNav === 3}>
					<ListItemIcon
						onClick={() => {
							history.push('/explore');
							setActiveNav(3);
						}}
					>
						<Explore />
					</ListItemIcon>
					<ListItemText
						primary={'Explore'}
						onClick={() => {
							history.push('/explore');
							setActiveNav(3);
						}}
					/>
				</ListItem>
			</List>
			<List>
				<ListItem button selected={activeNav === 4}>
					<ListItemIcon
						onClick={() => {
							history.push('/collections');
							setActiveNav(4);
						}}
					>
						<Collections />
					</ListItemIcon>
					<ListItemText
						primary={'Collections'}
						onClick={() => {
							history.push('/collections');
							setActiveNav(4);
						}}
					/>
				</ListItem>
			</List>
			<Divider />

			<List>
				<ListItem button>
					<ListItemIcon onClick={() => logout()}>
						<ExitToApp />
					</ListItemIcon>

					<ListItemText
						primary={'Log Out'}
						onClick={() => setLogoutDialog(true)}
					/>
				</ListItem>
			</List>
		</div>
	);

	const SearchDialog = () => {
		const [searchVal, setSearchVal] = useState(null);
		const [searchUserData, setSearchUserData] = useState([]);
		const [loading, setLoading] = useState(false);

		const searchUsers = (query) => {
			setLoading(true);
			setSearchVal(query);
			fetch(`${baseUrl}/search`, {
				method: 'post',
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + localStorage.getItem('jwt'),
				},
				body: JSON.stringify({
					query,
				}),
			})
				.then((res) => res.json())
				.then((value) => {
					//console.log(value);
					setSearchUserData(value.result);
					setLoading(false);
				})
				.catch((err) => {
					console.log(err);
					setLoading(false);
				});
		};

		return (
			<div>
				<Dialog
					fullScreen
					open={search}
					onClose={() => setSearch(false)}
					TransitionComponent={Transition}
				>
					<AppBar color='transparent' className={classes2.appBar}>
						<Toolbar>
							<IconButton
								edge='start'
								color='inherit'
								onClick={() => {
									setSearch(false);
									setSearchVal(null);
									setSearchUserData([]);
								}}
								aria-label='close'
							>
								<Close />
							</IconButton>
							<Typography
								color='inherit'
								variant='h6'
								className={classes2.title}
							>
								Search
							</Typography>
							<Button
								autoFocus
								color='inherit'
								onClick={() => {
									setSearch(false);
									setSearchVal(null);
									setSearchUserData([]);
								}}
							>
								Done
							</Button>
						</Toolbar>
					</AppBar>
					<div>
						<Container component='main' maxWidth='sm'>
							<div className={classes3.form} noValidate>
								<Grid container spacing={4}>
									<Grid item xs={12} sm={12}>
										<TextField
											variant='outlined'
											required
											fullWidth
											placeholder='Search by name...'
											value={searchVal}
											onChange={(e) => searchUsers(e.target.value)}
										/>
									</Grid>
									<Grid item xs={12} sm={12}>
										<List>
											{!loading &&
											searchVal !== null &&
											searchUserData &&
											searchUserData.length === 0 ? (
												<Alert severity='info' variant='outlined'>
													User with that name doesn't exist!
												</Alert>
											) : null}
											{searchUserData &&
												searchUserData.map((item) => (
													<div key={item._id}>
														<ListItem button>
															<ListItemAvatar>
																<Avatar
																	src={
																		item.imageUrl !== 'noimage'
																			? item.imageUrl
																			: null
																	}
																/>
															</ListItemAvatar>
															<ListItemText
																primary={item.name}
																secondary={item.email}
																onClick={() => {
																	history.push(
																		item._id === user._id
																			? '/profile'
																			: '/user/' + item._id
																	);
																	setSearch(false);
																	setSearchVal(null);
																	setSearchUserData([]);
																}}
															/>
														</ListItem>
														<Divider />
													</div>
												))}
										</List>
									</Grid>
									{loading && <LoaderSearch />}
								</Grid>
							</div>
						</Container>
					</div>
				</Dialog>
			</div>
		);
	};

	return (
		<div>
			<LogoutDialog />
			<SearchDialog />
			<div>
				<Dialog
					fullScreen
					open={addPost}
					onClose={() => setAddPost(false)}
					TransitionComponent={Transition}
				>
					<AppBar color='transparent' className={classes2.appBar}>
						<Toolbar>
							<IconButton
								edge='start'
								color='inherit'
								onClick={() => {
									setAddPost(false);
									setTitle(null);
									setImage(null);
									setBody(null);
									setUrl(null);
								}}
								aria-label='close'
							>
								<Close />
							</IconButton>
							<Typography
								color='inherit'
								variant='h6'
								className={classes2.title}
							>
								Add Post
							</Typography>
							<Button
								autoFocus
								color='inherit'
								onClick={() => {
									setAddPost(false);
									setTitle(null);
									setImage(null);
									setBody(null);
									setUrl(null);
								}}
							>
								Done
							</Button>
						</Toolbar>
					</AppBar>
					<div>
						<Container component='main' maxWidth='xs'>
							<div className={classes3.paper}>
								<Avatar className={classes3.avatar}>
									<PostAdd />
								</Avatar>

								<div className={classes3.form} noValidate>
									<Grid container spacing={4}>
										<Grid item xs={12} sm={12}>
											<input
												id='contained-button-file'
												type='file'
												hidden
												onChange={(e) => setImage(e.target.files[0])}
											/>
											<label htmlFor='contained-button-file'>
												<Button
													variant='outlined'
													color='primary'
													component='span'
													style={{ width: '100%' }}
													startIcon={<CloudUpload />}
												>
													Upload Image
												</Button>
											</label>
										</Grid>

										{image && (
											<Grid item xs={12} sm={12}>
												<ListItem>
													<InsertLink />
													<ListItemText primary={image.name} />
												</ListItem>
											</Grid>
										)}

										<Grid item xs={12}>
											<TextField
												variant='standard'
												required
												fullWidth
												placeholder='Title...'
												value={title}
												onChange={(e) => setTitle(e.target.value)}
											/>
										</Grid>
										<Grid item xs={12}>
											<TextField
												variant='standard'
												required
												fullWidth
												placeholder='Caption...'
												value={body}
												onChange={(e) => setBody(e.target.value)}
											/>
										</Grid>
										<Grid item xs={12}>
											<Button
												type='submit'
												fullWidth
												variant='outlined'
												color='primary'
												className={classes3.submit}
												onClick={() => {
													addUserPost();
													setAddPost(false);
												}}
											>
												Add Post
											</Button>
										</Grid>
									</Grid>
								</div>
							</div>
						</Container>
					</div>
				</Dialog>
			</div>
			<div className={classes.root}>
				<Drawer anchor={'left'} open={nav} onClose={() => setNav(false)}>
					{listNav()}
				</Drawer>

				<AppBar position='static' color='transparent'>
					<Toolbar>
						{user && (
							<IconButton
								edge='start'
								className={classes.menuButton}
								color='inherit'
								aria-label='menu'
								onClick={() => setNav(true)}
							>
								<MenuIcon />
							</IconButton>
						)}
						<Typography color='inherit' variant='h6' className={classes.title}>
							Instagram
						</Typography>
						{user && (
							<>
								<IconButton color='inherit' onClick={() => setSearch(true)}>
									<Search />
								</IconButton>
								<IconButton color='inherit' onClick={() => setAddPost(true)}>
									<PostAdd />
								</IconButton>
							</>
						)}
					</Toolbar>
				</AppBar>
			</div>
		</div>
	);
}

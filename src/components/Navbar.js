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
} from '@material-ui/core';

import {
	Home,
	Explore,
	PostAdd,
	Info,
	InsertPhoto,
	Close,
	CloudUpload,
	InsertLink,
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
		marginTop: theme.spacing(1),
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
	const user = JSON.parse(localStorage.getItem('user'));
	const dispatch = useDispatch();
	const logout = () => dispatch(actions.logout());

	const [title, setTitle] = useState('');
	const [body, setBody] = useState('');
	const [image, setImage] = useState('');
	const [url, setUrl] = useState(null);
	const [loader, setLoader] = useState(false);

	useEffect(() => {
		if (url) {
			fetch(`${baseUrl}/createpost`, {
				method: 'post',
				headers: {
					'Content-type': 'application/json',
					Authorization: 'Bearer ' + localStorage.getItem('jwt'),
				},
				body: JSON.stringify({
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
						setAddPost(false);
						setTitle(null);
						setImage(null);
						setBody(null);
						setUrl(null);
						message.success('Post created!');
						// history.push('/');
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
				console.log(data);
				setUrl(data.url);
			})
			.catch((error) => console.log(error));
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
			<Divider />

			<List>
				<ListItem button>
					<ListItemIcon onClick={() => logout()}>
						<ExitToApp />
					</ListItemIcon>
					<ListItemText primary={'Log Out'} onClick={() => logout()} />
				</ListItem>
			</List>
		</div>
	);

	return (
		<div>
			<div>
				<Dialog
					fullScreen
					open={addPost}
					onClose={() => setAddPost(false)}
					TransitionComponent={Transition}
				>
					<AppBar color='secondary' className={classes2.appBar}>
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
								{/* <Typography component='h1' variant='h5'>
									Sign in
								</Typography> */}
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
												onClick={() => addUserPost()}
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

				<AppBar position='static' color='secondary'>
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

						<IconButton color='inherit' onClick={() => setAddPost(true)}>
							<PostAdd />
						</IconButton>
						<IconButton color='inherit'>
							<Info />
						</IconButton>
					</Toolbar>
				</AppBar>
			</div>
		</div>
	);
}

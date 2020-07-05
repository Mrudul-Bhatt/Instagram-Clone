import React, { useEffect, useState, useRef } from 'react';
import {
	Avatar,
	TextField,
	Grid,
	Box,
	Typography,
	Button,
	Container,
	LinearProgress,
	Divider,
	Card,
	CardHeader,
	CardMedia,
	CardContent,
	CardActions,
	IconButton,
	Dialog,
	Slide,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	ListItem,
	ListItemText,
} from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import * as actions from '../../store/actions/user';
// import M from 'materialize-css';
import { message, Space } from 'antd';
import { makeStyles } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { baseUrl } from '../../utility/helper';
import CommentIcon from '@material-ui/icons/Comment';
import {
	Face,
	AddPhotoAlternate,
	DeleteOutline,
	CloudUpload,
	InsertLink,
} from '@material-ui/icons';

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction='up' ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
	root: {
		maxWidth: 600,
		maxHeight: 600,
	},
	rootUp: {
		maxWidth: 800,
		maxHeight: 600,
	},
	media: {
		height: 0,
		// paddingTop: '56.25%',
		paddingTop: '60%',
	},
	expand: {
		transform: 'rotate(0deg)',
		marginLeft: 'auto',
		transition: theme.transitions.create('transform', {
			duration: theme.transitions.duration.shortest,
		}),
	},
	expandOpen: {
		transform: 'rotate(180deg)',
	},
	avatar: {
		backgroundColor: red[500],
	},
	avatar2: {
		backgroundColor: red[500],
		width: theme.spacing(14),
		height: theme.spacing(14),
	},
	large: {
		width: theme.spacing(15),
		height: theme.spacing(15),
	},
}));

const Profile = () => {
	const classes = useStyles();
	const [data, setData] = useState([]);
	const notifyE = useSelector((state) => state.notifyE);
	const notifyM = useSelector((state) => state.notifyM);
	const click = useSelector((state) => state.click);
	const dispatch = useDispatch();
	const cleanup = () => dispatch(actions.cleanup());
	const user = JSON.parse(localStorage.getItem('user'));
	const [deleteId, setDeleteId] = useState(null);
	const [deleteModal, setDeleteModal] = useState(false);
	const [imageModal, setImageModal] = useState(false);
	const history = useHistory();
	const [image, setImage] = useState('');
	const [url, setUrl] = useState('');
	const [loader, setLoader] = useState(false);

	useEffect(() => {
		if (notifyE) {
			// addToast(notifyE, { appearance: 'error' });
			message.error(notifyE);
			cleanup();
		}
		if (notifyM) {
			// addToast('Signin Success', { appearance: 'success' });
			message.success('Signed In');
			cleanup();
		}
		//console.log(cli
	}, [click]);

	const like = (postId) => {
		fetch(`${baseUrl}/like`, {
			method: 'put',
			headers: {
				'Content-type': 'application/json',
				Authorization: 'Bearer ' + localStorage.getItem('jwt'),
			},
			body: JSON.stringify({
				postId,
			}),
		})
			.then((res) => res.json())
			.then((result) => {
				//console.log(result);
				const newData = data.map((item) => {
					if (result._id === item._id) {
						return result;
					} else {
						return item;
					}
				});
				setData(newData);
			})
			.catch((err) => console.log(err));
	};

	const unlike = (postId) => {
		fetch(`${baseUrl}/unlike`, {
			method: 'put',
			headers: {
				'Content-type': 'application/json',
				Authorization: 'Bearer ' + localStorage.getItem('jwt'),
			},
			body: JSON.stringify({
				postId,
			}),
		})
			.then((res) => res.json())
			.then((result) => {
				//console.log(result);
				const newData = data.map((item) => {
					if (result._id === item._id) {
						return result;
					} else {
						return item;
					}
				});
				setData(newData);
			})
			.catch((err) => console.log(err));
	};

	useEffect(() => {
		fetch(`${baseUrl}/mypost`, {
			headers: {
				Authorization: 'Bearer ' + localStorage.getItem('jwt'),
			},
		})
			.then((res) => res.json())
			.then((data) => {
				//console.log(data);
				setData(data.mypost);
			})
			.catch((error) => console.log(error));
	}, []);

	const deletePost = () => {
		fetch(`${baseUrl}/deletepost`, {
			method: 'delete',
			headers: {
				'Content-type': 'application/json',
				Authorization: 'Bearer ' + localStorage.getItem('jwt'),
			},
			body: JSON.stringify({
				postId: deleteId,
			}),
		})
			.then((res) => res.json())
			.then((value) => {
				// console.log(result);
				if (value.message) {
					const newData = data.filter((item) => {
						if (value.result._id !== item._id) {
							return item;
						}
					});
					setData(newData);
					message.success(value.message);
					setDeleteId(null);
				}
			})
			.catch((err) => console.log(err));
	};

	useEffect(() => {
		if (url) {
			setLoader(true);
			//console.log(url);
			fetch(`${baseUrl}/profileimg`, {
				method: 'put',
				headers: {
					'Content-type': 'application/json',
					Authorization: 'Bearer ' + localStorage.getItem('jwt'),
				},
				body: JSON.stringify({
					postId: user._id,
					imageUrl: url,
				}),
			})
				.then((res) => res.json())
				.then((response) => {
					//console.log(response);
					if (response.error) {
						// M.toast({ html: response.error, classes: 'red' });
						message.error(response.error);
					} else {
						// console.log(response);
						// console.log(response.data);
						localStorage.setItem('user', JSON.stringify(response.data));
						// M.toast({ html: 'Image updated successfully', classes: 'green' });
						message.success('Profile image updated!');
						setImage(null);
					}

					setLoader(false);
				})
				.catch((error) => {
					console.log(error);
					setLoader(false);
				});
		}
	}, [url]);

	const addImage = () => {
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
				//console.log(data.url);
				setUrl(data.url);
			})
			.catch((error) => console.log(error));
	};

	const ConfirmDelete = () => {
		return (
			<Dialog
				fullWidth
				open={deleteModal}
				TransitionComponent={Transition}
				keepMounted
				onClose={() => {
					setDeleteId(null);
					setDeleteModal(false);
				}}
				aria-labelledby='alert-dialog-slide-title'
				aria-describedby='alert-dialog-slide-description'
				style={{ width: '100%' }}
			>
				<DialogTitle id='alert-dialog-slide-title'>
					{'Delete this post?'}
				</DialogTitle>
				<DialogContent>
					<DialogContentText id='alert-dialog-slide-description'>
						This action cannot be undone!
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => {
							setDeleteId(null);
							setDeleteModal(false);
						}}
						color='primary'
					>
						Cancel
					</Button>
					<Button
						onClick={() => {
							deletePost();
							setDeleteModal(false);
						}}
						color='primary'
					>
						Delete
					</Button>
				</DialogActions>
			</Dialog>
		);
	};

	const UpdateImage = () => {
		return (
			<Dialog
				fullWidth
				open={imageModal}
				TransitionComponent={Transition}
				keepMounted
				onClose={() => {
					setImage(null);
					setImageModal(false);
				}}
				aria-labelledby='alert-dialog-slide-title'
				aria-describedby='alert-dialog-slide-description'
				style={{ width: '100%' }}
			>
				<DialogTitle id='alert-dialog-slide-title'>
					{'Update profile image'}
				</DialogTitle>
				<DialogContent>
					{/* <DialogContentText id='alert-dialog-slide-description'>
						This action cannot be undone!
					</DialogContentText> */}

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
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => {
							setImage(null);
							setImageModal(false);
						}}
						color='primary'
					>
						Cancel
					</Button>
					<Button
						onClick={() => {
							addImage();
							setImageModal(false);
						}}
						color='primary'
					>
						Update
					</Button>
				</DialogActions>
			</Dialog>
		);
	};

	return (
		<div>
			<UpdateImage />
			<ConfirmDelete />
			<Container component='main' maxWidth='sm'>
				<Card
					className={classes.rootUp}
					style={{ marginTop: '30px' }}
					elevation={0}
				>
					<CardHeader
						avatar={
							<Avatar
								aria-label='recipe'
								src={user && user.imageUrl !== 'noimage' ? user.imageUrl : null}
								className={classes.avatar2}
							></Avatar>
						}
						action={
							<IconButton
								aria-label='settings'
								onClick={() => setImageModal(true)}
							>
								<AddPhotoAlternate />
							</IconButton>
						}
						title={<h1>{user && user.name}</h1>}
						subheader={<h2>{user && user.email}</h2>}
					/>
					<Divider />
					<Grid container padd>
						<Grid item sm={4} xs={4}>
							<Typography
								variant='h6'
								color='textSecondary'
								style={{ textAlign: 'center' }}
							>
								{user && user.followers.length + ' '}Followers
							</Typography>
						</Grid>
						<Grid item sm={4} xs={4}>
							<Typography
								variant='h6'
								color='textSecondary'
								style={{ textAlign: 'center' }}
							>
								{data.length + ' '}Posts
							</Typography>
						</Grid>
						<Grid item sm={4} xs={4}>
							<Typography
								variant='h6'
								color='textSecondary'
								style={{ textAlign: 'center' }}
							>
								{user && user.following.length + ' '}Following
							</Typography>
						</Grid>
					</Grid>
				</Card>
				<Divider />
				{data &&
					data.map((item) => {
						return (
							<Card
								className={classes.root}
								style={{ marginTop: '30px' }}
								key={item._id}
								elevation={0}
								variant='outlined'
							>
								<CardHeader
									avatar={
										<Avatar
											aria-label='recipe'
											className={classes.avatar}
											src={item.postedBy.imageUrl}
										></Avatar>
									}
									action={
										<IconButton
											onClick={() => {
												setDeleteModal(true);
												setDeleteId(item._id);
											}}
											aria-label='settings'
										>
											<DeleteOutline style={{ color: 'red' }} />
										</IconButton>
									}
									title={item.postedBy.name}
									subheader='September 14, 2016'
								/>
								<CardMedia
									className={classes.media}
									image={item.imageUrl}
									title='Paella dish'
								/>
								<CardContent>
									<Typography
										variant='body2'
										color='textSecondary'
										component='p'
									>
										{item.body}
									</Typography>
								</CardContent>
								<CardActions disableSpacing>
									{item.likes.includes(user._id) ? (
										<IconButton
											aria-label='add to favorites'
											onClick={() => unlike(item._id)}
										>
											<FavoriteIcon style={{ color: 'red' }} />
											{item.likes.length}
										</IconButton>
									) : (
										<IconButton
											aria-label='add to favorites'
											onClick={() => like(item._id)}
										>
											<FavoriteIcon />
											{item.likes.length}
										</IconButton>
									)}
									<IconButton aria-label='share'>
										<CommentIcon /> {item.comments.length}
									</IconButton>
									<IconButton aria-label='show more'>
										<ExpandMoreIcon />
									</IconButton>
								</CardActions>
							</Card>
						);
					})}
			</Container>
		</div>
	);
};

export default Profile;

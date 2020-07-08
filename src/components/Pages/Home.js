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
	AppBar,
	Toolbar,
	List,
	ListItemAvatar,
	ListItem,
	ListItemText,
	ListItemIcon,
} from '@material-ui/core';
import { Alert, Skeleton } from '@material-ui/lab';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
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
import { DeleteOutline, Close, AddComment, Comment } from '@material-ui/icons';
import Loader from '../../utility/loader';

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction='up' ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
	appBar: {
		position: 'relative',
	},
	title: {
		marginLeft: theme.spacing(2),
		flex: 1,
	},
	root: {
		maxWidth: 600,
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
}));

const Home = () => {
	const classes = useStyles();
	const [data, setData] = useState([]);
	const notifyE = useSelector((state) => state.notifyE);
	const notifyM = useSelector((state) => state.notifyM);
	const click = useSelector((state) => state.click);
	const dispatch = useDispatch();
	const cleanup = () => dispatch(actions.cleanup());
	const user = JSON.parse(localStorage.getItem('user'));
	const [loading, setLoading] = useState(false);
	const [commentsDialog, setCommentsDialog] = useState(false);
	const [itemData, setItemData] = useState(null);
	const [itemId, setItemId] = useState('');
	const [addCommentDialog, setAddCommentDialog] = useState(false);
	const [choiceCommentDialog, setChoiceCommentDialog] = useState(false);

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

	useEffect(() => {
		setLoading(true);
		fetch(`${baseUrl}/allsubpost`, {
			headers: {
				'Content-type': 'application/json',
				Authorization: 'Bearer ' + localStorage.getItem('jwt'),
			},
		})
			.then((res) => res.json())
			.then((result) => {
				//console.log(result);

				setData(result.posts);
				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
				setLoading(false);
			});
	}, []);

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

	const singlePost = () => {
		fetch(`${baseUrl}/singlepost`, {
			method: 'post',
			headers: {
				'Content-type': 'application/json',
				Authorization: 'Bearer ' + localStorage.getItem('jwt'),
			},
			body: JSON.stringify({
				itemId,
			}),
		})
			.then((res) => res.json())
			.then((result) => {
				console.log(result.mypost.comments.length);

				setItemData(result.mypost);
				setCommentsDialog(true);
			})
			.catch((err) => console.log(err));
	};

	const postComment = (value) => {
		console.log(value);
		fetch(`${baseUrl}/comments`, {
			method: 'put',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + localStorage.getItem('jwt'),
			},
			body: JSON.stringify({ text: value, postId: itemId }),
		})
			.then((res) => res.json())
			.then((response) => {
				console.log(response);
				const newData = data.map((item) => {
					if (item._id === response.result._id) {
						return response.result;
					} else {
						return item;
					}
				});
				setData(newData);
				setAddCommentDialog(false);
				setItemId('');
				message.success('Comment added');
			})
			.catch((error) => {
				console.log(error);
				message.error('Server error!');
			});
	};

	const PostCommentDialog = () => {
		const [comment, setComment] = useState('');

		return (
			<Dialog
				fullWidth
				open={addCommentDialog}
				TransitionComponent={Transition}
				onClose={() => {
					setAddCommentDialog(false);
					setItemId('');
					setComment('');
				}}
				style={{ width: '100%' }}
			>
				<DialogTitle id='alert-dialog-slide-title'>
					{'Post Comment'}
				</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						margin='dense'
						id='name'
						placeholder='Add Comment...'
						type='text'
						fullWidth
						value={comment}
						onChange={(e) => setComment(e.target.value)}
					/>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => {
							setAddCommentDialog(false);
							setItemId('');

							setComment('');
						}}
						color='primary'
					>
						Cancel
					</Button>
					<Button
						type='submit'
						color='primary'
						onClick={() => postComment(comment)}
					>
						Post
					</Button>
				</DialogActions>
			</Dialog>
		);
	};

	const ChoiceCommentDialog = () => {
		return (
			<Dialog
				fullWidth
				open={choiceCommentDialog}
				TransitionComponent={Transition}
				keepMounted
				onClose={() => {
					setChoiceCommentDialog(false);
				}}
				aria-labelledby='alert-dialog-slide-title'
				aria-describedby='alert-dialog-slide-description'
				style={{ width: '100%' }}
			>
				<DialogContent>
					<List>
						<ListItem>
							<ListItemIcon>
								<AddComment />
							</ListItemIcon>
							<ListItemText
								primary='Post Comment'
								onClick={() => {
									setAddCommentDialog(true);
									setChoiceCommentDialog(false);
								}}
							/>
						</ListItem>
						<ListItem>
							<ListItemIcon>
								<Comment />
							</ListItemIcon>
							<ListItemText
								primary='All Comments'
								onClick={() => {
									singlePost();
									setChoiceCommentDialog(false);
								}}
							/>
						</ListItem>
					</List>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => {
							setChoiceCommentDialog(false);
						}}
						color='primary'
					>
						Cancel
					</Button>
				</DialogActions>
			</Dialog>
		);
	};

	const CommentsDialog = () => {
		return (
			<Dialog
				fullScreen
				keepMounted
				open={commentsDialog}
				onClose={() => {
					setCommentsDialog(false);
					setItemId('');
					setItemData(null);
				}}
				TransitionComponent={Transition}
			>
				<AppBar className={classes.appBar}>
					<Toolbar>
						<IconButton
							edge='start'
							color='inherit'
							onClick={() => {
								setCommentsDialog(false);
								setItemId(null);
								setItemData(null);
							}}
							aria-label='close'
						>
							<Close />
						</IconButton>
						<Typography color='inherit' variant='h6' className={classes.title}>
							Comments
						</Typography>
						<Button
							autoFocus
							color='inherit'
							onClick={() => {
								setCommentsDialog(false);
								setItemId(null);
								setItemData(null);
							}}
						>
							done
						</Button>
					</Toolbar>
				</AppBar>
				<List>
					{console.log(itemData)}
					{itemData && itemData.comments.length === 0 ? (
						<div className={classes.alert}>
							<Alert severity='info'>No comments yet on this post!</Alert>
						</div>
					) : null}
					{itemData &&
						itemData.comments.map((item, index) => {
							return (
								<div key={index}>
									<ListItem button>
										<ListItemAvatar>
											<Avatar src={item.postedBy.imageUrl} />
										</ListItemAvatar>
										<ListItemText
											primary={item.postedBy.name}
											secondary={item.text}
										/>
									</ListItem>
									<Divider />
								</div>
							);
						})}
				</List>
			</Dialog>
		);
	};

	// const Loader = () => {
	// 	const array = [1, 2, 3, 4, 5];
	// 	return (
	// 		<Container component='main' maxWidth='sm'>
	// 			{array.map((item, index) => {
	// 				return (
	// 					<Card
	// 						className={classes.root}
	// 						style={{ marginTop: '30px' }}
	// 						key={index}
	// 						elevation={0}
	// 						variant='outlined'
	// 					>
	// 						<CardHeader
	// 							avatar={
	// 								<Skeleton
	// 									animation='wave'
	// 									variant='circle'
	// 									width={40}
	// 									height={40}
	// 								/>
	// 							}
	// 							title={
	// 								<Skeleton
	// 									animation='wave'
	// 									height={10}
	// 									width='80%'
	// 									style={{ marginBottom: 6 }}
	// 								/>
	// 							}
	// 							subheader={
	// 								<Skeleton animation='wave' height={10} width='40%' />
	// 							}
	// 						/>

	// 						<Skeleton
	// 							animation='wave'
	// 							variant='rect'
	// 							className={classes.media}
	// 						/>

	// 						<CardContent>
	// 							<Skeleton
	// 								animation='wave'
	// 								height={10}
	// 								style={{ marginBottom: 6 }}
	// 							/>
	// 							<Skeleton animation='wave' height={10} width='80%' />
	// 						</CardContent>
	// 					</Card>
	// 				);
	// 			})}
	// 		</Container>
	// 	);
	// };

	return (
		<div>
			{loading && <Loader />}
			<PostCommentDialog />
			<ChoiceCommentDialog />
			<CommentsDialog />
			<Container component='main' maxWidth='sm'>
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
										<Link
											to={
												item.postedBy._id === user._id
													? '/profile'
													: '/user/' + item.postedBy._id
											}
										>
											<Avatar
												aria-label='recipe'
												className={classes.avatar}
												src={
													item.postedBy.imageUrl !== 'noimage'
														? item.postedBy.imageUrl
														: null
												}
											/>
										</Link>
									}
									action={
										<IconButton aria-label='settings'>
											<MoreVertIcon />
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
									<IconButton
										aria-label='share'
										onClick={() => {
											setItemId(item._id);
											setChoiceCommentDialog(true);
										}}
									>
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

export default Home;

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
	Menu,
	MenuItem,
	ListItemSecondaryAction,
} from '@material-ui/core';
import { Alert, Skeleton, AlertTitle } from '@material-ui/lab';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import * as actions from '../../store/actions/user';
// import M from 'materialize-css';
import { message, Space } from 'antd';
import { makeStyles } from '@material-ui/core/styles';
import { red, grey } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { baseUrl } from '../../utility/helper';
import CommentIcon from '@material-ui/icons/Comment';
import {
	DeleteOutline,
	Close,
	AddComment,
	Comment,
	Bookmark,
	MoreVert,
	ThumbUp,
	Delete,
	Update,
} from '@material-ui/icons';
import { Loader } from '../../utility/loader';

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
		backgroundColor: grey[500],
	},
	avatar2: {
		width: theme.spacing(3),
		height: theme.spacing(3),
	},
	alert: {
		width: '100%',
		'& > * + *': {
			marginTop: theme.spacing(4),
		},
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
	// const [itemData, setItemData] = useState(null);
	const [itemId, setItemId] = useState('');
	const [addCommentDialog, setAddCommentDialog] = useState(false);
	const [choiceCommentDialog, setChoiceCommentDialog] = useState(false);
	const [choiceVertDialog, setChoiceVertDialog] = useState(false);
	const [displayText, setDisplayText] = useState('');
	const [vertItemId, setVertItemId] = useState('');
	const [editPostDialog, setEditPostDialog] = useState(false);

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

	const postComment = (value) => {
		console.log(value);
		if (!value) {
			setAddCommentDialog(false);

			return;
		}
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

	const postCollectionT = () => {
		fetch(`${baseUrl}/postcollectionT`, {
			method: 'put',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + localStorage.getItem('jwt'),
			},
			body: JSON.stringify({ postId: vertItemId }),
		})
			.then((res) => res.json())
			.then((response) => {
				console.log(response);
				const newData = data.map((item) => {
					if (item._id === response._id) {
						return response;
					} else {
						return item;
					}
				});
				setData(newData);
				setVertItemId('');
				setDisplayText('');
				message.success('Saved to collection!');
			})
			.catch((error) => {
				console.log(error);
				message.error('Server error!');
			});
	};

	const postCollectionF = (id) => {
		fetch(`${baseUrl}/postcollectionF`, {
			method: 'put',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + localStorage.getItem('jwt'),
			},
			body: JSON.stringify({ postId: vertItemId }),
		})
			.then((res) => res.json())
			.then((response) => {
				console.log(response);
				const newData = data.map((item) => {
					if (item._id === response._id) {
						return response;
					} else {
						return item;
					}
				});
				setData(newData);
				setVertItemId('');
				setDisplayText('');
				message.success('Removed from collection!');
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
				style={{ width: '100%' }}
			>
				<DialogContent>
					<List>
						<ListItem button>
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

						<ListItem button>
							<ListItemIcon>
								<Comment />
							</ListItemIcon>
							<ListItemText
								primary='All Comments'
								onClick={() => {
									// singlePost();
									setChoiceCommentDialog(false);
									setCommentsDialog(true);
								}}
							/>
						</ListItem>
						<ListItem button>
							<ListItemIcon>
								<Close />
							</ListItemIcon>
							<ListItemText
								primary='Close'
								onClick={() => {
									setChoiceCommentDialog(false);
								}}
							/>
						</ListItem>
					</List>
				</DialogContent>
			</Dialog>
		);
	};

	const ChoiceVertDialog = () => {
		return (
			<Dialog
				fullWidth
				open={choiceVertDialog}
				TransitionComponent={Transition}
				keepMounted
				onClose={() => {
					setChoiceVertDialog(false);
				}}
			>
				<DialogContent>
					<List>
						<ListItem button>
							<ListItemIcon>
								<Bookmark />
							</ListItemIcon>
							<ListItemText
								primary={displayText}
								onClick={() => {
									displayText === 'Unsave Post'
										? postCollectionF()
										: postCollectionT();
									setChoiceVertDialog(false);
								}}
							/>
						</ListItem>

						<ListItem button>
							<ListItemIcon>
								<Close />
							</ListItemIcon>
							<ListItemText
								primary='Close'
								onClick={() => {
									setChoiceVertDialog(false);
								}}
							/>
						</ListItem>
					</List>
				</DialogContent>
			</Dialog>
		);
	};

	const CommentsDialog = () => {
		const [itemData, setItemData] = useState(null);
		const [toggle, setToggle] = useState(false);
		const [delComment, setDelComment] = useState(null);

		useEffect(() => {
			if (commentsDialog) {
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
					})
					.catch((err) => console.log(err));
			}
		}, []);

		const deleteComment = () => {
			fetch(`${baseUrl}/deletecomment`, {
				method: 'put',
				headers: {
					'Content-type': 'application/json',
					Authorization: 'Bearer ' + localStorage.getItem('jwt'),
				},
				body: JSON.stringify({
					postId: itemId,
					comment: delComment,
				}),
			})
				.then((res) => res.json())
				.then((response) => {
					console.log(response);

					// message.success('Comment deleted!');
					setItemData(response.result);
				})
				.catch((err) => {
					message.error('Server error!');

					console.log(err);
				});
		};

		const ChoiceCommentListDialog = () => {
			return (
				<Dialog
					fullWidth
					open={toggle}
					TransitionComponent={Transition}
					keepMounted
					onClose={() => {
						setDelComment(null);

						setToggle(false);
					}}
				>
					<DialogContent>
						<List>
							<ListItem button>
								<ListItemIcon>
									<Delete />
								</ListItemIcon>
								<ListItemText
									primary='Delete Comment'
									onClick={() => {
										deleteComment();
										setToggle(false);
									}}
								/>
							</ListItem>
							<ListItem button>
								<ListItemIcon>
									<Close />
								</ListItemIcon>
								<ListItemText
									primary='Close'
									onClick={() => {
										setToggle(false);

										setDelComment(null);
									}}
								/>
							</ListItem>
						</List>
					</DialogContent>
				</Dialog>
			);
		};

		return (
			<div>
				<ChoiceCommentListDialog />
				<Dialog
					fullScreen
					keepMounted
					open={commentsDialog}
					onClose={() => {
						setCommentsDialog(false);
					}}
					TransitionComponent={Transition}
				>
					<AppBar className={classes.appBar} color='transparent'>
						<Toolbar>
							<IconButton
								edge='start'
								color='inherit'
								onClick={() => {
									const newData = data.map((item) => {
										if (item._id === itemId) {
											return itemData;
										} else {
											return item;
										}
									});
									setData(newData);
									setCommentsDialog(false);
									setItemId(null);
									setItemData(null);
								}}
								aria-label='close'
							>
								<Close />
							</IconButton>
							<Typography
								color='inherit'
								variant='h6'
								className={classes.title}
							>
								Comments
							</Typography>
						</Toolbar>
					</AppBar>
					<List>
						{console.log(itemData)}
						{itemData && itemData.comments.length === 0 ? (
							<div className={classes.alert}>
								<Alert severity='info' variant='outlined'>
									No comments on this post!
								</Alert>
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
											{item.postedBy._id === user._id ? (
												<ListItemText
													primary={item.postedBy.name}
													secondary={item.text}
													onClick={() => {
														setDelComment(item);
														setToggle(true);
													}}
												/>
											) : (
												<ListItemText
													primary={item.postedBy.name}
													secondary={item.text}
												/>
											)}
										</ListItem>
										<Divider />
									</div>
								);
							})}
					</List>
				</Dialog>
			</div>
		);
	};

	return (
		<div>
			{loading && <Loader />}
			<ChoiceVertDialog />
			<PostCommentDialog />
			<ChoiceCommentDialog />

			<CommentsDialog />
			<Container component='main' maxWidth='sm'>
				{data && data.length === 0 ? (
					<Alert
						style={{ marginTop: '20px', width: '100%' }}
						severity='info'
						variant='outlined'
					>
						Follow people to see their posts
					</Alert>
				) : null}
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
										<IconButton
											aria-controls='simple-menu'
											aria-haspopup='true'
											onClick={() => {
												var text;
												text = item.postCollection.includes(user._id)
													? 'Unsave Post'
													: 'Save Post';
												setDisplayText(text);
												setVertItemId(item._id);
												setChoiceVertDialog(true);
											}}
										>
											<MoreVert />
										</IconButton>
									}
									title={item.postedBy.name}
									subheader={item.dateCreated}
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
								</CardActions>
							</Card>
						);
					})}
			</Container>
		</div>
	);
};

export default Home;

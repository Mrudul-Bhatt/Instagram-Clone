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
import { Alert } from '@material-ui/lab';
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
import {
	DeleteOutline,
	Close,
	AddComment,
	Comment,
	AirlineSeatLegroomReducedTwoTone,
} from '@material-ui/icons';
import { useModal, Modal } from '@zeit-ui/react';
import Loader from '../../utility/loader';

const useStyles = makeStyles((theme) => ({
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
	appBar: {
		position: 'relative',
	},
	title: {
		marginLeft: theme.spacing(2),
		flex: 1,
	},
	alert: {
		width: '100%',
		'& > * + *': {
			marginTop: theme.spacing(2),
		},
	},
}));

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction='up' ref={ref} {...props} />;
});

const Explore = () => {
	const classes = useStyles();
	const [visible, setVisible] = useState(false);
	const [data, setData] = useState([]);
	const user = JSON.parse(localStorage.getItem('user'));
	const [deleteId, setDeleteId] = useState(null);
	const [commentsDialog, setCommentsDialog] = useState(false);
	const [itemData, setItemData] = useState(null);
	const [itemId, setItemId] = useState('');
	const [addCommentDialog, setAddCommentDialog] = useState(false);
	const [choiceCommentDialog, setChoiceCommentDialog] = useState(false);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setLoading(true);
		fetch(`${baseUrl}/allpost`, {
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
				// if (result.mypost.comments.length === 0) {
				// 	setAlert(true);
				// }
				setItemData(result.mypost);
				setCommentsDialog(true);
			})
			.catch((err) => console.log(err));
	};

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
				//console.log(result);
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

	const ConfirmDelete = () => {
		return (
			<Dialog
				fullWidth
				open={visible}
				TransitionComponent={Transition}
				keepMounted
				onClose={() => {
					setVisible(false);
					setDeleteId(null);
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
							setVisible(false);
							setDeleteId(null);
						}}
						color='secondary'
					>
						Cancel
					</Button>
					<Button
						onClick={() => {
							deletePost();
							setVisible(false);
						}}
						color='primary'
					>
						Delete
					</Button>
				</DialogActions>
			</Dialog>
		);
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
				// aria-labelledby='alert-dialog-slide-title'
				// aria-describedby='alert-dialog-slide-description'
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
				{/* <DialogTitle id='alert-dialog-slide-title'>{'Comments'}</DialogTitle> */}
				<DialogContent>
					{/* <DialogContentText id='alert-dialog-slide-description'> */}
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
					{/* </DialogContentText> */}
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
					{/* <Button
						onClick={() => {
							postComment();
							setAddCommentDialog(false);
						}}
						color='primary'
					>
						Post
					</Button> */}
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
											// onClick={() => {
											// 	history.push(`/user/${item._id}`);
											// }}
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

	return (
		<div>
			{loading && <Loader />}
			<CommentsDialog />
			<PostCommentDialog />
			<ChoiceCommentDialog />
			<ConfirmDelete />
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
												src={
													item.postedBy.imageUrl !== 'noimage'
														? item.postedBy.imageUrl
														: null
												}
											></Avatar>
										</Link>
									}
									action={
										item.postedBy._id === user._id && (
											<IconButton
												aria-label='settings'
												onClick={() => {
													setVisible(true);
													setDeleteId(item._id);
												}}
											>
												<DeleteOutline style={{ color: 'red' }} />
											</IconButton>
										)
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

export default Explore;

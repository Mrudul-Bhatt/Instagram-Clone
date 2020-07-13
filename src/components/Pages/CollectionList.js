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
	CircularProgress,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
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
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { baseUrl } from '../../utility/helper';
import CommentIcon from '@material-ui/icons/Comment';
import {
	DeleteOutline,
	Close,
	AddComment,
	Comment,
	AirlineSeatLegroomReducedTwoTone,
	MoreVert,
	Delete,
	Bookmark,
	Update,
} from '@material-ui/icons';
import { useModal, Modal } from '@zeit-ui/react';
import { Loader } from '../../utility/loader';

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
		backgroundColor: grey[500],
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

const CollectionList = () => {
	const classes = useStyles();
	const [visible, setVisible] = useState(false);
	const [data, setData] = useState([]);
	const user = JSON.parse(localStorage.getItem('user'));
	const [del, setDelete] = useState(false);
	const [commentsDialog, setCommentsDialog] = useState(false);
	const [itemData, setItemData] = useState(null);
	const [itemId, setItemId] = useState('');
	const [addCommentDialog, setAddCommentDialog] = useState(false);
	const [choiceCommentDialog, setChoiceCommentDialog] = useState(false);
	const [loading, setLoading] = useState(false);

	const [choiceVertDialog, setChoiceVertDialog] = useState(false);
	const [displayText, setDisplayText] = useState('');
	const [vertItemId, setVertItemId] = useState('');
	const [editPostDialog, setEditPostDialog] = useState(false);
	const [likeLoading, setLikeLoading] = useState(false);
	const [likeId, setLikeId] = useState(null);

	useEffect(() => {
		setLoading(true);
		fetch(`${baseUrl}/allpostcollections`, {
			headers: {
				'Content-type': 'application/json',
				Authorization: 'Bearer ' + localStorage.getItem('jwt'),
			},
		})
			.then((res) => res.json())
			.then((result) => {
				//console.log(result);
				const newData = result.posts.filter((item) => {
					if (item.postCollection.includes(user._id)) {
						return item;
					}
				});
				setData(newData);
				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
				setLoading(false);
			});
	}, []);

	const like = (postId) => {
		setLikeLoading(true);
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
				setLikeLoading(false);
			})
			.catch((err) => {
				setLikeLoading(false);

				console.log(err);
			});
	};

	const deletePost = () => {
		fetch(`${baseUrl}/deletepost`, {
			method: 'delete',
			headers: {
				'Content-type': 'application/json',
				Authorization: 'Bearer ' + localStorage.getItem('jwt'),
			},
			body: JSON.stringify({
				postId: vertItemId,
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
					setVertItemId('');
					setDisplayText('');
					message.success(value.message);
					setDelete(false);
				}
			})
			.catch((err) => console.log(err));
	};

	const unlike = (postId) => {
		setLikeLoading(true);

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
				setLikeLoading(false);
			})
			.catch((err) => {
				setLikeLoading(false);

				console.log(err);
			});
	};

	const postComment = (value) => {
		if (!value) {
			setAddCommentDialog(false);

			return;
		}
		//console.log(value);
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
				//console.log(response);
				const newData = data.map((item) => {
					if (item._id === response.result._id) {
						return response.result;
					} else {
						return item;
					}
				});
				setData(newData);
				setItemId('');
				message.success('Comment added');
			})
			.catch((error) => {
				console.log(error);
				message.error('Server error!');
			});
	};

	const postCollectionF = () => {
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
				//console.log(response);
				const newData = data.filter((item) => {
					if (item._id !== response._id) {
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
						onClick={() => {
							postComment(comment);
							setAddCommentDialog(false);
						}}
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
						//console.log(result.mypost.comments.length);

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
					//console.log(response);

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

	const editPost = (value) => {
		if (!value) {
			setEditPostDialog(false);
			return;
		}
		fetch(`${baseUrl}/editpost`, {
			method: 'put',
			headers: {
				'Content-type': 'application/json',
				Authorization: 'Bearer ' + localStorage.getItem('jwt'),
			},
			body: JSON.stringify({
				postId: vertItemId,
				body: value,
			}),
		})
			.then((res) => res.json())
			.then((result) => {
				//console.log(result);
				const newData = data.map((item) => {
					if (result.data._id === item._id) {
						return result.data;
					} else {
						return item;
					}
				});
				setData(newData);
				message.success('Caption updated');
			})
			.catch((err) => console.log(err));
	};

	const EditPostDialog = () => {
		const [caption, setCaption] = useState('');

		return (
			<Dialog
				fullWidth
				open={editPostDialog}
				TransitionComponent={Transition}
				onClose={() => {
					setEditPostDialog(false);
					setVertItemId('');
					setCaption('');
				}}
			>
				<DialogTitle>{'Edit Caption'}</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						margin='dense'
						id='name'
						placeholder='New Caption...'
						type='text'
						fullWidth
						value={caption}
						onChange={(e) => setCaption(e.target.value)}
					/>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => {
							setEditPostDialog(false);

							setVertItemId('');

							setCaption('');
						}}
						color='primary'
					>
						Cancel
					</Button>
					<Button
						type='submit'
						color='primary'
						onClick={() => {
							editPost(caption);
							setEditPostDialog(false);
						}}
					>
						Post
					</Button>
				</DialogActions>
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
								primary='Unsave Post'
								onClick={() => {
									postCollectionF();
									setChoiceVertDialog(false);
								}}
							/>
						</ListItem>
						{del && (
							<>
								<ListItem button>
									<ListItemIcon>
										<Update />
									</ListItemIcon>
									<ListItemText
										primary='Edit Caption'
										onClick={() => {
											setChoiceVertDialog(false);

											setEditPostDialog(true);
										}}
									/>
								</ListItem>
								<ListItem button>
									<ListItemIcon>
										<Delete />
									</ListItemIcon>
									<ListItemText
										primary='Delete Post'
										onClick={() => {
											deletePost();
											setChoiceVertDialog(false);
										}}
									/>
								</ListItem>
							</>
						)}
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

	return (
		<div>
			{loading && <Loader />}
			<EditPostDialog />
			<CommentsDialog />
			<ChoiceVertDialog />
			<PostCommentDialog />
			<ChoiceCommentDialog />
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
										<IconButton
											onClick={() => {
												item.postedBy._id === user._id
													? setDelete(true)
													: setDelete(false);
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
										<>
											{likeLoading && item._id === likeId ? (
												<IconButton>
													<CircularProgress
														size={21}
														style={{ margin: '2px' }}
													/>
													{item.likes.length}
												</IconButton>
											) : (
												<IconButton
													onClick={() => {
														setLikeId(item._id);
														unlike(item._id);
													}}
												>
													<FavoriteIcon style={{ color: 'red' }} />
													{item.likes.length}
												</IconButton>
											)}
										</>
									) : (
										<>
											{likeLoading && item._id === likeId ? (
												<IconButton>
													<CircularProgress
														size={21}
														style={{ margin: '2px' }}
													/>
													{item.likes.length}
												</IconButton>
											) : (
												<IconButton
													onClick={() => {
														setLikeId(item._id);
														like(item._id);
													}}
												>
													<FavoriteIcon />
													{item.likes.length}
												</IconButton>
											)}
										</>
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

export default CollectionList;

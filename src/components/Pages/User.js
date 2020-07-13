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
	Link as MLink,
	ListItem,
	ListItemText,
	AppBar,
	Toolbar,
	List,
	ListItemAvatar,
	ListItemIcon,
	CircularProgress,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
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
	Face,
	AddPhotoAlternate,
	DeleteOutline,
	Person,
	Close,
	AddComment,
	Comment,
	Bookmark,
	MoreVert,
	Delete,
} from '@material-ui/icons';
import { Loader, LoaderProfile } from '../../utility/loader';

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
		backgroundColor: grey[500],
	},
	avatar2: {
		backgroundColor: grey[500],

		width: theme.spacing(12),
		height: theme.spacing(12),
	},
	large: {
		width: theme.spacing(15),
		height: theme.spacing(15),
	},
	appBar: {
		position: 'relative',
	},
	title: {
		marginLeft: theme.spacing(2),
		flex: 1,
	},
}));

const User = () => {
	const classes = useStyles();
	const [data, setData] = useState([]);
	const dispatch = useDispatch();
	const user = JSON.parse(localStorage.getItem('user'));
	const history = useHistory();
	const [loading, setLoading] = useState(false);

	const [userProfile, setProfile] = useState(null);
	const { userId } = useParams();

	const [followersDialog, setFollowersDialog] = useState(false);
	const [followingDialog, setFollowingDialog] = useState(false);
	const [followersData, setFollowersData] = useState([]);
	// const [FUfClicked, setFUfClicked] = useState(false)
	const [followingData, setFollowingData] = useState([]);

	const [commentsDialog, setCommentsDialog] = useState(false);
	const [itemData, setItemData] = useState(null);
	const [itemId, setItemId] = useState('');
	const [addCommentDialog, setAddCommentDialog] = useState(false);
	const [choiceCommentDialog, setChoiceCommentDialog] = useState(false);

	const [choiceVertDialog, setChoiceVertDialog] = useState(false);
	const [displayText, setDisplayText] = useState('');
	const [vertItemId, setVertItemId] = useState('');
	const [FUfLoading, setFUfLoading] = useState(false);

	const [likeLoading, setLikeLoading] = useState(false);
	const [likeId, setLikeId] = useState(null);

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

	useEffect(() => {
		setLoading(true);
		fetch(`${baseUrl}/user/${userId}`, {
			headers: {
				Authorization: 'Bearer ' + localStorage.getItem('jwt'),
			},
		})
			.then((res) => res.json())
			.then((result) => {
				//console.log(result);
				setProfile(result.user);
				setData(result.posts);
				setLoading(false);
			})
			.catch((error) => {
				console.log(error);
				setLoading(false);
			});
	}, [userId]);

	const follow = () => {
		setFUfLoading(true);
		fetch(`${baseUrl}/follow`, {
			method: 'put',
			headers: {
				'Content-type': 'application/json',
				Authorization: 'Bearer ' + localStorage.getItem('jwt'),
			},
			body: JSON.stringify({
				followId: userId,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				//console.log(data);
				localStorage.setItem('user', JSON.stringify(data));

				setProfile((prevState) => {
					return {
						...prevState,
						followers: [...prevState.followers, data._id],
					};
				});
				message.success(`Started following "${userProfile.name}"!`);
				setFUfLoading(false);
			})
			.catch((err) => {
				setFUfLoading(false);

				console.log(err);
			});
	};
	const unfollow = () => {
		setFUfLoading(true);

		fetch(`${baseUrl}/unfollow`, {
			method: 'put',
			headers: {
				'Content-type': 'application/json',
				Authorization: 'Bearer ' + localStorage.getItem('jwt'),
			},
			body: JSON.stringify({
				unfollowId: userId,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				//console.log(data);
				localStorage.setItem('user', JSON.stringify(data));
				setProfile((prevState) => {
					const newFollowers = prevState.followers.filter(
						(id) => id !== data._id
					);
					return {
						...prevState,
						followers: newFollowers,
					};
				});
				message.success(`Unfollowed "${userProfile.name}"!`);
				setFUfLoading(false);
			})
			.catch((err) => {
				setFUfLoading(false);

				console.log(err);
			});
	};

	useEffect(() => {
		fetch(`${baseUrl}/allusers`, {
			headers: {
				Authorization: 'Bearer ' + localStorage.getItem('jwt'),
			},
		})
			.then((res) => res.json())
			.then((data) => {
				//console.log(userProfile);
				const newFollowersData = data.result.filter((item) => {
					if (userProfile.followers.includes(item._id)) {
						return item;
					}
				});
				setFollowersData(newFollowersData);
				const newFollowingData = data.result.filter((item) => {
					if (userProfile.following.includes(item._id)) {
						return item;
					}
				});
				setFollowingData(newFollowingData);
			})
			.catch((error) => console.log(error));
	}, [userProfile]);

	const FollowersDialog = () => {
		return (
			<Dialog
				fullScreen
				open={followersDialog}
				onClose={() => setFollowersDialog(false)}
				TransitionComponent={Transition}
			>
				<AppBar className={classes.appBar} color='transparent'>
					<Toolbar>
						<IconButton
							edge='start'
							color='inherit'
							onClick={() => setFollowersDialog(false)}
							aria-label='close'
						>
							<Close />
						</IconButton>
						<Typography color='inherit' variant='h6' className={classes.title}>
							Followers
						</Typography>
						<Button
							autoFocus
							color='inherit'
							onClick={() => setFollowersDialog(false)}
						>
							Done
						</Button>
					</Toolbar>
				</AppBar>
				<List>
					{followersData && followersData.length === 0 ? (
						<Alert
							style={{ marginTop: '20px', width: '100%' }}
							severity='info'
							variant='outlined'
						>
							This account has no followers
						</Alert>
					) : null}
					{followersData &&
						followersData.map((item) => {
							return (
								<div key={item._id}>
									<ListItem button>
										<ListItemAvatar>
											<Avatar src={item.imageUrl} />
										</ListItemAvatar>
										<ListItemText
											primary={item.name}
											secondary={item.email}
											onClick={() => {
												history.push(
													item._id === user._id
														? '/profile'
														: `/user/${item._id}`
												);
												setFollowersDialog(false);
											}}
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

	const FollowingDialog = () => {
		return (
			<Dialog
				fullScreen
				open={followingDialog}
				onClose={() => setFollowingDialog(false)}
				TransitionComponent={Transition}
			>
				<AppBar className={classes.appBar} color='transparent'>
					<Toolbar>
						<IconButton
							edge='start'
							color='inherit'
							onClick={() => setFollowingDialog(false)}
							aria-label='close'
						>
							<Close />
						</IconButton>
						<Typography color='inherit' variant='h6' className={classes.title}>
							Following
						</Typography>
						<Button
							autoFocus
							color='inherit'
							onClick={() => setFollowingDialog(false)}
						>
							Done
						</Button>
					</Toolbar>
				</AppBar>
				<List>
					{followingData && followingData.length === 0 ? (
						<Alert
							style={{ marginTop: '20px', width: '100%' }}
							severity='info'
							variant='outlined'
						>
							This account follows no one
						</Alert>
					) : null}
					{followingData &&
						followingData.map((item) => {
							return (
								<div key={item._id}>
									<ListItem button>
										<ListItemAvatar>
											<Avatar src={item.imageUrl} />
										</ListItemAvatar>
										<ListItemText
											primary={item.name}
											secondary={item.email}
											onClick={() => {
												history.push(
													item._id === user._id
														? '/profile'
														: `/user/${item._id}`
												);
												setFollowingDialog(false);
											}}
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

	const postComment = (value) => {
		//console.log(value);
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
				//console.log(response);
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

	return (
		<div>
			{loading && <LoaderProfile />}
			{loading && <Loader />}
			<ChoiceVertDialog />
			<PostCommentDialog />
			<ChoiceCommentDialog />
			<CommentsDialog />
			<FollowersDialog />
			<FollowingDialog />
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
								src={
									userProfile && userProfile.imageUrl !== 'noimage'
										? userProfile.imageUrl
										: null
								}
								className={classes.avatar2}
							></Avatar>
						}
						title={<h2>{userProfile && userProfile.name}</h2>}
						subheader={<h4>{userProfile && userProfile.email}</h4>}
					/>
					<Divider />
					<Grid container>
						<Grid item sm={4} xs={4}>
							<Typography
								variant='h6'
								color='textSecondary'
								style={{ textAlign: 'center' }}
							>
								<MLink
									color='inherit'
									onClick={() => {
										setFollowersDialog(true);
									}}
								>
									{userProfile && userProfile.followers.length + ' '}Followers
								</MLink>
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
								<MLink
									color='inherit'
									onClick={() => {
										setFollowingDialog(true);
									}}
								>
									{userProfile && userProfile.following.length + ' '}Following
								</MLink>
							</Typography>
						</Grid>
					</Grid>
					<Divider />

					<Grid container spacing={2}>
						<Grid item sm={12} xs={12}>
							{userProfile && userProfile.followers.includes(user._id) ? (
								<>
									{FUfLoading ? (
										<CircularProgress
											size={26}
											style={{
												marginLeft: '48%',
												marginTop: '2px',
												marginBottom: '2px',
											}}
										/>
									) : (
										<Button
											variant='outlined'
											color='primary'
											style={{ width: '100%' }}
											startIcon={<Person />}
											onClick={() => unfollow()}
											disableElevation
										>
											Unfollow
										</Button>
									)}
								</>
							) : (
								<>
									{FUfLoading ? (
										<CircularProgress
											size={26}
											style={{
												marginLeft: '48%',
												marginTop: '2px',
												marginBottom: '2px',
											}}
										/>
									) : (
										<Button
											variant='contained'
											color='primary'
											style={{ width: '100%' }}
											startIcon={<Person />}
											onClick={() => follow()}
											disableElevation
										>
											Follow
										</Button>
									)}
								</>
							)}
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

export default User;

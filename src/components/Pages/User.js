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
} from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
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
	Person,
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

const User = () => {
	const classes = useStyles();
	const [data, setData] = useState([]);
	const dispatch = useDispatch();
	const user = JSON.parse(localStorage.getItem('user'));
	const history = useHistory();
	const [loader, setLoader] = useState(false);

	const [userProfile, setProfile] = useState(null);
	const { userId } = useParams();

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
		fetch(`${baseUrl}/user/${userId}`, {
			headers: {
				Authorization: 'Bearer ' + localStorage.getItem('jwt'),
			},
		})
			.then((res) => res.json())
			.then((result) => {
				console.log(result);
				setProfile(result.user);
				setData(result.posts);
			})
			.catch((error) => {
				console.log(error);
			});
	}, [userId]);

	const follow = () => {
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
				console.log(data);
				localStorage.setItem('user', JSON.stringify(data));
				// setProfile((prevState) => {
				// 	return {
				// 		...prevState,
				// 		user: {
				// 			...prevState.user,
				// 			followers: [...prevState.user.followers, data._id],
				// 		},
				// 	};
				// });
				setProfile((prevState) => {
					return {
						...prevState,
						followers: [...prevState.followers, data._id],
					};
				});
				message.success(`Started following "${userProfile.name}"!`);
			});
	};
	const unfollow = () => {
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
			});
	};

	return (
		<div>
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
						action={
							<IconButton aria-label='settings'>
								<AddPhotoAlternate />
							</IconButton>
						}
						title={<h1>{userProfile && userProfile.name}</h1>}
						subheader={<h2>{userProfile && userProfile.email}</h2>}
					/>
					<Divider />
					<Grid container>
						<Grid item sm={4} xs={4}>
							<Typography
								variant='h6'
								color='textSecondary'
								style={{ textAlign: 'center' }}
							>
								{userProfile && userProfile.followers.length + ' '}Followers
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
								{userProfile && userProfile.following.length + ' '}Following
							</Typography>
						</Grid>
					</Grid>
					<Divider />

					<Grid container spacing={2}>
						<Grid item sm={12} xs={12}>
							{userProfile && userProfile.followers.includes(user._id) ? (
								<Button
									variant='outlined'
									color='primary'
									style={{ width: '100%' }}
									startIcon={<Person />}
									onClick={() => unfollow()}
								>
									Unfollow
								</Button>
							) : (
								<Button
									variant='contained'
									color='primary'
									style={{ width: '100%' }}
									startIcon={<Person />}
									onClick={() => follow()}
								>
									Follow
								</Button>
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
									// action={
									// 	<IconButton
									// 		onClick={() => {
									// 			setDeleteModal(true);
									// 			setDeleteId(item._id);
									// 		}}
									// 		aria-label='settings'
									// 	>
									// 		<DeleteOutline style={{ color: 'red' }} />
									// 	</IconButton>
									// }
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

export default User;

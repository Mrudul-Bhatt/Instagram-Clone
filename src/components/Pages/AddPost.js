import React, { useState, useEffect } from 'react';
import M from 'materialize-css';

import {
	Avatar,
	TextField,
	Link,
	Grid,
	Box,
	Typography,
	Button,
	Container,
	LinearProgress,
	IconButton,
	List,
	ListItem,
	ListItemText,
} from '@material-ui/core';
// import Button from '@material-ui/core/Button';
import { baseUrl } from '../../utility/helper';

import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router';
import { message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import * as actions from '../../store/actions/user';
import {
	PostAdd,
	InsertPhoto,
	CloudUpload,
	InsertLink,
} from '@material-ui/icons';

function Copyright() {
	return (
		<Typography variant='body2' color='textSecondary' align='center'>
			{'Copyright © '}
			<Link color='inherit' href='https://material-ui.com/'>
				Instagram
			</Link>{' '}
			{new Date().getFullYear()}
			{'.'}
		</Typography>
	);
}

const useStyles = makeStyles((theme) => ({
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

const AddPost = () => {
	const classes = useStyles();
	const [title, setTitle] = useState('');
	const [body, setBody] = useState('');
	const [image, setImage] = useState(null);
	const [url, setUrl] = useState('');
	const [loader, setLoader] = useState(false);
	const history = useHistory();

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
						message.success('Post created!');
						setTimeout(() => {
							history.push('/');
						}, 3000);
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

	const addPost = () => {
		if (!title || !body || !image) {
			message.error('Please enter all fields!');
			return;
		}

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
				setUrl(data.url);
			})
			.catch((error) => console.log(error));
	};

	return (
		<div>
			<Container component='main' maxWidth='xs'>
				<div className={classes.paper}>
					<Avatar className={classes.avatar}>
						<PostAdd />
					</Avatar>
					<Typography component='h1' variant='h5'>
						Sign in
					</Typography>
					<div className={classes.form} noValidate>
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
									className={classes.submit}
									onClick={() => addPost()}
								>
									Add Post
								</Button>
							</Grid>
						</Grid>
					</div>
				</div>
			</Container>
		</div>
	);
};

export default AddPost;

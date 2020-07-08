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

export default Loader = () => {
	const classes = useStyles();
	const array = [1, 2, 3, 4, 5];
	return (
		<Container component='main' maxWidth='sm'>
			{array.map((item, index) => {
				return (
					<Card
						className={classes.root}
						style={{ marginTop: '30px' }}
						key={index}
						elevation={0}
						variant='outlined'
					>
						<CardHeader
							avatar={
								<Skeleton
									animation='wave'
									variant='circle'
									width={40}
									height={40}
								/>
							}
							title={
								<Skeleton
									animation='wave'
									height={10}
									width='80%'
									style={{ marginBottom: 6 }}
								/>
							}
							subheader={<Skeleton animation='wave' height={10} width='40%' />}
						/>

						<Skeleton
							animation='wave'
							variant='rect'
							className={classes.media}
						/>

						<CardContent>
							<Skeleton
								animation='wave'
								height={10}
								style={{ marginBottom: 6 }}
							/>
							<Skeleton animation='wave' height={10} width='80%' />
						</CardContent>
					</Card>
				);
			})}
		</Container>
	);
};

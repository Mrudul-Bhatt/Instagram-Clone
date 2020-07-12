import React from 'react';
import {
	Container,
	Divider,
	Card,
	CardHeader,
	CardContent,
	GridListTile,
	Grid,
	GridList,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors/';

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
	appBar: {
		position: 'relative',
	},
	title: {
		marginLeft: theme.spacing(2),
		flex: 1,
	},
	gridList: {
		maxWidth: 500,
		// width: 500,
		// height: 500,
	},
}));

export const Loader = () => {
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

export const LoaderProfile = () => {
	const classes = useStyles();
	return (
		<Container component='main' maxWidth='sm'>
			<Card
				className={classes.rootUp}
				style={{ marginTop: '30px' }}
				elevation={0}
			>
				<CardHeader
					avatar={
						<Skeleton
							animation='wave'
							variant='circle'
							width={100}
							height={100}
							className={classes.avatar}
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

				<CardContent>
					<Skeleton animation='wave' height={10} style={{ marginBottom: 6 }} />
					<Skeleton animation='wave' height={10} width='80%' />
				</CardContent>
			</Card>
		</Container>
	);
};

export const LoaderCollections = () => {
	const classes = useStyles();

	const array = [
		1,
		2,
		3,
		4,
		5,
		6,
		7,
		8,
		9,
		10,
		11,
		12,
		13,
		14,
		15,
		16,
		17,
		18,
		19,
		20,
		21,
	];

	return (
		<Container component='main' maxWidth='sm'>
			<GridList
				cellHeight='100%'
				className={classes.gridList}
				cols={3}
				style={{ marginTop: '10px' }}
			>
				{array.map((item) => (
					<GridListTile cols={1} key={item}>
						<Skeleton variant='rect' height={152} />
					</GridListTile>
				))}
			</GridList>
		</Container>
	);
};

export const LoaderSearch = () => {
	const classes = useStyles();
	const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

	return (
		// <Container component='main' maxWidth='sm'>
		// <Grid container spacing={4}>
		<Grid item xs={12} sm={12}>
			<List>
				{array.map((item) => (
					<>
						<ListItem key={item}>
							<ListItemAvatar>
								<Skeleton
									animation='wave'
									variant='circle'
									width={45}
									height={45}
								/>
							</ListItemAvatar>
							<ListItemText
								primary={
									<Skeleton
										animation='wave'
										height={15}
										width='80%'
										style={{ marginBottom: 6 }}
									/>
								}
								secondary={
									<Skeleton animation='wave' height={15} width='40%' />
								}
							/>
						</ListItem>
						<Divider />
					</>
				))}
			</List>
		</Grid>
		// </Grid>

		// </Container>
	);
};

import React, { useEffect, useState, useRef } from 'react';
import {
	Container,
	LinearProgress,
	Divider,
	Card,
	CardHeader,
	CardContent,
} from '@material-ui/core';
import { Alert, Skeleton } from '@material-ui/lab';
// import M from 'materialize-css';
import { makeStyles } from '@material-ui/core/styles';
import { red, grey } from '@material-ui/core/colors/';
import { ViewModule } from '@material-ui/icons';

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

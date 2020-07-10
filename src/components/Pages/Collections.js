import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import { baseUrl } from '../../utility/helper';
import { Container, Grid, ButtonBase } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		overflow: 'hidden',
		backgroundColor: theme.palette.background.paper,
		maxWidth: 600,
		maxHeight: 600,
	},
	gridList: {
		maxWidth: 500,
		maxHeight: 500,
		// width: 500,
		// height: 500,
	},
}));

const Collections = () => {
	const classes = useStyles();
	const [data, setData] = useState([]);
	const user = JSON.parse(localStorage.getItem('user'));

	useEffect(() => {
		fetch(`${baseUrl}/allpost`, {
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
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	return (
		<Container component='main' maxWidth='sm'>
			<GridList
				cellHeight={160}
				className={classes.gridList}
				cols={3}
				style={{ marginTop: '10px' }}
			>
				{data &&
					data.map((item) => (
						<GridListTile cols={1} key={item._id}>
							<img src={item.imageUrl} alt={item.body} />
						</GridListTile>
					))}
			</GridList>
		</Container>
	);
};

export default Collections;

import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { baseUrl } from '../../utility/helper';
import {
	Container,
	Grid,
	ButtonBase,
	GridList,
	GridListTile,
	Link as MLink,
} from '@material-ui/core';
import { useHistory } from 'react-router';
import { Skeleton, Alert } from '@material-ui/lab';
import { LoaderCollections } from '../../utility/loader';

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
		// width: 500,
		// height: 500,
	},
}));

const Collections = () => {
	const classes = useStyles();
	const [data, setData] = useState([]);
	const user = JSON.parse(localStorage.getItem('user'));
	const [loading, setLoading] = useState(false);
	const history = useHistory();

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

	return (
		<div>
			{loading && <LoaderCollections />}
			<Container component='main' maxWidth='sm'>
				{data && data.length === 0 ? (
					<Alert
						severity='info'
						variant='outlined'
						style={{ marginTop: '20px' }}
					>
						No posts saved in collection!
					</Alert>
				) : null}
				<GridList
					cellHeight='100%'
					className={classes.gridList}
					cols={3}
					style={{ marginTop: '10px' }}
				>
					{data &&
						data.map((item) => (
							<GridListTile cols={1} key={item._id}>
								<img
									style={{ height: 152 }}
									src={item.imageUrl}
									alt={item.body}
									onClick={() => history.push('/collectionlist')}
								/>
							</GridListTile>
						))}
				</GridList>
			</Container>
		</div>
	);
};

export default Collections;

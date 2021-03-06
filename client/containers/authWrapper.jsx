// @flow

import React from 'react';
import { connect } from 'react-redux';
import auth from 'actions/auth';
import Actions from 'constants/actions';
import SignIn from 'components/SignInView';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { SK5 } from 'components/spinkit';

import type { Map as ImmutableMap } from 'immutable';
import type { Element as ReactElement } from 'react';
import type { Dispatch } from 'redux';
import type { AuthRequest } from 'api-server/api';

const Loading = (props: { [string]: *, }) => (
	<span
		style={{
			alignItems: 'center',
			display: 'flex',
			justifyContent: 'center',
			width: '100%',
		}}>
		<Card elevation={1}>
			<CardContent>
				<Typography component='h2' gutterBottom variant='h5'>
					Loading
				</Typography>
				<Typography gutterBottom variant='subtitle1'>
					Checking your credentials
				</Typography>
				<SK5 />
			</CardContent>
		</Card>
	</span>
);


function authorize(dispatch: Dispatch, user: AuthRequest) {
	dispatch(auth(user));
}


type Props = {
	children: ReactElement<*>,
	dispatch: * => void,
	loading?: boolean,
	fail?: boolean,
	reauth?: boolean,
	user: ImmutableMap<string, *>,
};

const AuthWrapper = ({
	children,
	dispatch,
	loading,
	fail,
	reauth,
	user,
}: Props): ReactElement<*> => {

	if (loading) return <Loading />;
	if (fail) return <SignIn onSubmit={payload => authorize(dispatch, (payload: AuthRequest))} />;

	if (reauth) {
		const payload: AuthRequest = {
			login: user.get('login', ''),
			secret: user.get('secret', ''),
		};
		authorize(dispatch, payload);
	}

	return (
		<span
			style={{
				flexGrow: 1,
			}}>
			{children}
		</span>
	);
};

const authState = (state, props) => {
	const authstate = state.app.getIn([ 'auth', 'state' ], Actions.AUTH_FAILURE);
	const loading = state.app.getIn([ 'auth', 'loading' ]);
	const fail = authstate === Actions.AUTH_FAILURE;
	const reauth = authstate === Actions.REAUTH_REQUIRED;
	const user = state.app.get('user');

	return {
		loading,
		fail,
		reauth,
		user,
	};
};

export default connect(authState)(AuthWrapper);

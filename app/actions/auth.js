// @flow
import {
	AUTH_LOADING,
	AUTH_SUCCESS,
	AUTH_FAILURE,
	SET_USER,
} from 'constants/actions';

import { sendAuth } from 'services/api';

import type { FluxStandardAction } from 'common/flow/FluxStandardAction';
import type jwt from 'jsonwebtoken';
import type { AuthRequest, User } from 'server/api';
import type { Dispatch, Store } from 'redux';

export type AuthActionLoading = FluxStandardAction<>;
export type AuthActionSuccess = FluxStandardAction<jwt>;
export type AuthActionFailure = FluxStandardAction<Error>;
export type AuthActionSetUser = FluxStandardAction<AuthRequest & { user: User, }>;
export type AuthActionReauthRequired = FluxStandardAction<>;
export type AuthActions = AuthActionLoading | AuthActionSuccess | AuthActionFailure | AuthActionSetUser;

/**
 * ```js
 * import auth from 'actions/auth';
 * ```
 *
 * auth action call
 *
 * @memberof module:app/actions
 * @param  {AuthRequest} payload
 * @return {Promise}
 * @requires constants/actions
 */
function auth(payload: AuthRequest) {
	return (dispatch: Dispatch, getState: Store.getState) => {
		dispatch({ type: AUTH_LOADING });

		return sendAuth(payload)
			.then((p) => {
				dispatch({
					type: SET_USER,
					payload: Object.assign({}, payload, p.user),
				});

				dispatch({
					type: AUTH_SUCCESS,
					payload: p.token,
				});

				return Promise.resolve();
			})
			.catch((err) => {
				dispatch({ type: AUTH_FAILURE, payload: err, error: true });
				return Promise.resolve();
			});
	};
}

export default auth;

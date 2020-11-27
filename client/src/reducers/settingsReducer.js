import initialState from '../store/initialState';
import { actions } from '../actions';
import { getProxyHost } from '../store/constants';

export default function settingsReducer(state = initialState, action) {
	switch (action.type) {
		case actions.settings.FIRM_INFO_REQUEST:{
			return Object.assign({}, state, {
				firmName: "Название не определено...",
				firmAddress: "...",
				firmPhone: "",
				firmType: 0,
				firmLogoUrl: "",
				firmOwner: "",
				FirmEmail: "",
				FirmLogoImage: null

			})
		}
		case actions.settings.FIRM_INFO_RESPONSE:{
			let data = action.data.response ? action.data.response : action.data;
			return Object.assign({}, state, {
				proxyHost: getProxyHost(),
				firmName: data.company_name,
				firmAddress: data.FIZ_ADRESS_CITY,
				firmPhone: data.FIZ_ADRESS_PHONE,
				firmType: parseInt(data.company_type),
				firmLogoUrl: action.data.firmLogoUrl,
				firmOwner: data.name,
				FirmEmail: data.email,
				// FirmLogoImage: action.data.FirmLogoImage,
				FirmPosterIdUrl: data.COMPANY_ID
			})
		}
		default: return state
	}
}
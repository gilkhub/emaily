import { SHOW_DELETE_SURVEY_ALERT, HIDE_DELETE_SURVEY_ALERT } from '../actions/types';

export default function(state = { showDeleteAlert: false, surveyId: null }, action) {
  switch (action.type) {
    case SHOW_DELETE_SURVEY_ALERT:
      return action.payload;
    case HIDE_DELETE_SURVEY_ALERT:
      return action.payload;
    default:
      return state;
  }
}

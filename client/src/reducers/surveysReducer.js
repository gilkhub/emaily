import { FETCH_SURVEYS, DELETE_SURVEY } from '../actions/types';

export default function(state = [], action) {
  switch (action.type) {
    case FETCH_SURVEYS:
      return action.payload;
    case DELETE_SURVEY:
      console.log(`DELETE_SURVEY: action.payload['_id'] is '${action.payload['_id']}'`);
      const deletedSurveyId = action.payload['_id'];
      return state.filter(survey => survey._id !== deletedSurveyId);
    default:
      return state;
  }
}

import axios from 'axios';
import {
  FETCH_USER,
  FETCH_SURVEYS, DELETE_SURVEY,
  SHOW_DELETE_SURVEY_ALERT, HIDE_DELETE_SURVEY_ALERT
} from './types';

export const fetchUser = () => async dispatch => {
  const res = await axios.get('/api/current_user');

  dispatch({ type: FETCH_USER, payload: res.data });
};

export const handleToken = token => async dispatch => {
  const res = await axios.post('/api/stripe', token);

  dispatch({ type: FETCH_USER, payload: res.data });
};

export const submitSurvey = (values, history) => async dispatch => {
  const res = await axios.post('/api/surveys', values);

  history.push('/surveys');
  dispatch({ type: FETCH_USER, payload: res.data });
};

export const fetchSurveys = () => async dispatch => {
  const res = await axios.get('/api/surveys');

  dispatch({ type: FETCH_SURVEYS, payload: res.data });
};

export const deleteSurvey = (surveyId) => async dispatch => {
  console.log(`HEY I'M in actions/deleteSurvey!!! surveyId is '${surveyId}'`);

  const res = await axios.delete(`/api/surveys/${surveyId}`);

  dispatch({ type: DELETE_SURVEY, payload: res.data });
};

export const showDeleteSurveyAlert = (surveyId) => async dispatch => {
  dispatch({ type: SHOW_DELETE_SURVEY_ALERT,
             payload: {
               showDeleteAlert: true,
               surveyId: surveyId
             }
           });
};

export const hideDeleteSurveyAlert = () => async dispatch => {
  dispatch({ type: HIDE_DELETE_SURVEY_ALERT,
             payload: {
               showDeleteAlert: false,
               surveyId: null
             }
           });
};

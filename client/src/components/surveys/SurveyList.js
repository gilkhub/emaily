import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchSurveys, deleteSurvey, showDeleteSurveyAlert, hideDeleteSurveyAlert } from '../../actions';
const SweetAlert = require('react-bootstrap-sweetalert');

class SurveyList extends Component {
  componentDidMount() {
    this.props.fetchSurveys();
  }

  deleteSurveyAndHideAlert() {
    this.props.deleteSurvey(this.props.alerts.surveyId);
    this.props.hideDeleteSurveyAlert();
  }

  renderDeleteAlert() {
    if (this.props.alerts.showDeleteAlert) {
      return (
        <SweetAlert
          warning
          showCancel
          confirmBtnText="Yes, delete it!"
          confirmBtnBsStyle="danger"
          cancelBtnBsStyle="default"
          title="Are you sure you want to delete this survey?"
          onConfirm={this.deleteSurveyAndHideAlert}
          onCancel={this.props.hideDeleteAlert}
        >
          You will not be able to recover this imaginary file!
        </SweetAlert>
      );
    }
  }

  renderSurveys() {
    return this.props.surveys.reverse().map(survey => {
      return (
        <div className="card blue-grey darken-1" key={survey._id}>
          <div className="card-content white-text">
            <span className="card-title">
              <button className="btn-flat right red-text btn-large"
                      style={{ margin: '0px 0px 0px 0px' }}
                      onClick={() => this.props.showDeleteSurveyAlert(survey._id)}
              >
                <i className="material-icons">delete</i>
              </button>{survey.title}</span>
            <p>
              {survey.body}
            </p>
            <p>
              {survey._id}
            </p>
            <p className="right">
              Sent On: {new Date(survey.dateSent).toLocaleDateString()}
            </p>
          </div>
          <div className="card-action">
            <a>Yes: {survey.yes}</a>
            <a>No: {survey.no}</a>
          </div>
        </div>
      );
    });
  }

  render() {
    return(
      <div>
        <div>
          {this.renderDeleteAlert()}
        </div>
        <div>
          {this.renderSurveys()}
        </div>
      </div>
    );
  }
}

// function mapStateToProps(state) {
// // state.surveys => /reducers/index.js => combineReducers.surveys => surveysReducer
// return { surveys: state.surveys }
// }
// // is equivalent to:
function mapStateToProps({ surveys, alerts }) {
  return { surveys, alerts };
}

export default connect(
  mapStateToProps,
  { fetchSurveys, deleteSurvey, showDeleteSurveyAlert, hideDeleteSurveyAlert })(SurveyList);

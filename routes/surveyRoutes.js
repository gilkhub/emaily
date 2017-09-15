const _ = require('lodash');
const Path = require('path-parser');
const { URL } = require('url');
const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');

const Survey = mongoose.model('surveys');

module.exports = app => {
  app.get('/api/surveys', requireLogin, async (req, res) => {
    const surveys = await Survey.find({ _user: req.user.id }).select({
       recipients: false
     });

    res.send(surveys);
  });

  app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {
    const { title, subject, body, recipients } = req.body;

    const survey = new Survey({
      title,
      subject,
      body,
      recipients: recipients.split(',').map(email => ({ email: email.trim() })),
      _user: req.user.id,
      dateSent: Date.now()
    });

    // Let's send the email!
    const mailer = new Mailer(survey, surveyTemplate(survey));

    try {
      await mailer.send();
      await survey.save();
      req.user.credits -= 1;
      const user = await req.user.save();

      res.send(user);
    }
    catch (err) {
      res.status(422).send(err);
    }
  });

  app.delete('/api/surveys/:surveyId', requireLogin, async (req, res) => {
    console.log(`In delete survey endpoint, param id is: ${req.params.surveyId}`);

    if (req.params.surveyId) {
      await Survey.findOneAndRemove(
        { _id: req.params.surveyId },
        function (err, survey) {
          if (err) {
            console.log(`ERROR! FAILED TO DELETE!\n${err}\n`);
            res.status(500).send({});
          } else {
            if (survey) {
              console.log(`Found and deleted the following record -> \n${survey}\n`);
            } else {
              console.log(`A survey with id ${req.params.surveyId} was not found, cannot delete.\n`);
            }
            res.send(survey); // could basically send just survey.id to avoid sending long recipients document with it
          }
        }
      );
    } else {
      console.log('ERROR! PARAMS DID NOT INCLUDE surveyId TO DELETE');
      res.status(500).send({});
    }
  });

  app.post('/api/surveys/webhooks', (req, res) => {
    const p = new Path('/api/surveys/:surveyId/:choice');

    _.chain(req.body)
      .map(({ email, url }) => {
        const match = p.test(new URL(url).pathname);
        if (match) {
          return { email, surveyId: match.surveyId, choice: match.choice }
        }
      })
      .compact()
      .uniqBy('email', 'surveyId')
      .each(({ surveyId, email, choice }) => {
        Survey.updateOne(
          {
            _id: surveyId,
            recipients: {
              $elemMatch: { email: email, responded: false }
            }
          },
          {
            $inc: { [choice]: 1 },
            $set: { 'recipients.$.responded': true },
            lastResponded: new Date()
          }
        ).exec();
      })
      .value();

    res.send({});
  });
};

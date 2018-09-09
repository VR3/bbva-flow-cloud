const Token = require('../models/Token');
const Flow = require('../models/Flow');
const User = require('../models/User');

/**
 * POST /flows/create
 * Create a new flow in storage.
 */
exports.createFlow = (req, res) => {
  // Validation
  req.assert('userId', 'The userId is required').notEmpty();
  req.assert('concept', 'The concept is required').notEmpty();
  req.assert('amount', 'The amount is required').notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    return res.json({
      status: 'fail',
      payload: errors,
    });
  }

  User.findById(req.body.userId)
    .exec()
    .then((user) => {
      if (!user) {
        return res.json({
          status: 'fail',
          payload: [{ msg: 'The user does not exist' }],
        });
      }
      const newFlow = new Flow(req.body);

      return newFlow.save((err) => {
        if (err) {
          throw err;
        }
        user.flows.push(newFlow);
        return user.save((userErr) => {
          if (userErr) {
            throw userErr;
          }
          return res.json({
            status: 'success',
            payload: newFlow,
          });
        });
      });
    })
    .catch(err => res.json({
      status: 'error',
      error: err,
    }));
};

/**
 * GET /flows/:id
 * Get a specific flow.
 */
exports.getFlow = (req, res) => {
  Flow.findById(req.params.id)
    .exec()
    .then((flow) => {
      if (!flow) {
        return res.json({
          status: 'fail',
          payload: [{ msg: 'The flow does not exist' }],
        });
      }
      return res.json({
        status: 'success',
        payload: flow,
      });
    })
    .catch(err => res.json({
      status: 'error',
      error: err,
    }));
};

/**
 * DELETE /flows/:id/delete
 * Delete a flow from storage.
 */
exports.deleteFlow = (req, res) => {
  Flow.findByIdAndRemove(req.params.id)
    .exec()
    .then((flow) => {
      if (!flow) {
        return res.json({
          status: 'fail',
          payload: [{ msg: 'The flow does not exist' }],
        });
      }
      return res.json({
        status: 'success',
        payload: flow,
      });
    })
    .catch(err => res.json({
      status: 'error',
      error: err,
    }));
};

/**
 * POST /flows/:id/run
 * Run a flow.
 */
exports.runFlow = (req, res) => {
  // Validation
  req.assert('token', 'The validation token is required').notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    return res.json({
      status: 'fail',
      payload: errors,
    });
  }

  Token.findOne({ payload: req.body.token })
    .where('expiration')
    .gt(Date.now())
    .exec()
    .then((token) => {
      if (!token) {
        return res.json({
          status: 'fail',
          payload: [{ msg: 'The token is not valid or has expired' }],
        });
      }
      Flow.findById(req.params.id)
        .exec()
        .then((flow) => {
          if (!flow) {
            return res.json({
              status: 'fail',
              payload: [{ msg: 'The flow does not exist' }],
            });
          }
          flow.tokenUsed = token;
          return flow.save((err) => {
            if (err) { throw err; }
            token.remove();
            return res.json({
              status: 'success',
              payload: flow,
            });
          });
        });
    })
    .catch(err => res.json({
      status: 'error',
      error: err,
    }));
};

/**
 * POST /flows/checkToken
 * Check if a token is used and run transaction.
 */
exports.checkToken = (req, res) => {
  // Validation
  req.assert('token', 'The token is required').notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    return res.json({
      status: 'fail',
      payload: errors,
    });
  }

  Flow.findOne({ tokenUsed: req.body.token })
    .exec()
    .then((flow) => {
      if (!flow) {
        return res.json({
          status: 'fail',
          payload: [{ msg: 'The token is not used' }],
        });
      }
      return res.json({
        status: 'success',
        payload: flow,
      });
    })
    .catch(err => res.json({
      status: 'error',
      error: err,
    }));
};

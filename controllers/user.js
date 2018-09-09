const User = require('../models/User');

/**
 * POST /users/create
 * Create a new user in storage.
 */
exports.createUser = (req, res) => {
  const newUser = new User(req.body);
  newUser.save((err) => {
    if (err) {
      return res.json({
        status: 'error',
        error: err,
      });
    }
    return res.json({
      status: 'success',
      payload: newUser,
    });
  });
};

/**
 * GET /users/:id
 */
exports.getUser = (req, res) => {
  User.findById(req.params.id)
    .populate('flows')
    .exec()
    .then((user) => {
      if (!user) {
        return res.json({
          status: 'fail',
          payload: 'User not found.',
        });
      }
      return res.json({
        status: 'success',
        payload: user,
      });
    })
    .catch(err => res.json({
      status: 'error',
      error: err,
    }));
};

/**
 * GET /users/:id/flows
 */
exports.getUserFlows = (req, res) => {
  User.findById(req.params.id)
    .populate('flows')
    .exec()
    .then((user) => {
      if (!user) {
        return res.json({
          status: 'fail',
          payload: 'The user does not exist',
        });
      }
      return res.json({
        status: 'success',
        payload: user.flows,
      });
    })
    .catch(err => res.json({
      status: 'error',
      error: err,
    }));
};

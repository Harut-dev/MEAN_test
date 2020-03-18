const userController = require('../controllers/UserController');

module.exports = (app) => {
  app.get('/api/v1', (req, res) => res.send({
    message: 'Welcome to the MEAN test V1 API!',
  }));

  app.get('/api/v1/users/isEmailAvailable', userController.isEmailAvailable);

  app.get('/api/v1/users', userController.getUserList);
  app.post('/api/v1/users', userController.createUser);
  app.put('/api/v1/users', userController.updateUser);
  app.delete('/api/v1/users', userController.deleteUser);

};

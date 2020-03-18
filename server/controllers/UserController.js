const userService = require('../services/userService');
const userValidator = require('../validators/userValidator');

module.exports = {

  /**
   * Get users with pagination and filters
   *
   * @param query
   * @param res
   * @return {Promise<void>}
   */
  getUserList: async ({query}, res) => {
    try {
      let {
        pageSize, //count of one page
        page,  //which page
        sort,  //field to sort
        order, //order of sorting
        role,
        search,
      } = query;
      if (!page) page = 1;
      const startIndex = (page - 1) * pageSize;
      if (!sort) sort = 'createdAt';
      const filter = {
      };
      if (role && role !== 'all') {
        filter.role = role;
      }
      if (search) {
        if (search) {
          const escaped = search.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
          filter['$or'] = [
            {
              firstName: {
                '$regex': escaped,
                '$options': 'i'
              }
            },
            {
              lastName: {
                '$regex': escaped,
                '$options': 'i'
              }
            },
            {
              email: {
                '$regex': escaped,
                '$options': 'i'
              }
            },
            {
              role: {
                '$regex': escaped,
                '$options': 'i'
              }
            }
          ];
        }
      }

      const users = await userService.paginatedList({filter, sort, order, startIndex, pageSize});
      const total = await userService.getCount(filter);
      const totalDesigners = await userService.getCount({role: 'designer'});
      const totalArtists = await userService.getCount({role: 'artist'});

      res.status(200).send({users: users, totalCount: total, totalDesigners, totalArtists});
    } catch (e) {
      console.log('ERROR', e);
      res.status(200).send({users: [], total: 0});
    }
  },

  /**
   * Checking is email Available for client side validation
   *
   * @param query
   * @param res
   * @return {Promise<*>}
   */
  isEmailAvailable: async ({ query }, res) => {
    try {
      if (!query.email) return res.status(200).send('');

      const user = await userService.getUserByEmail(query.email);
      res.status(200).send(user ? user._id : '');

    }catch (e) {
      console.log('ERROR', e);
      res.status(200).send('');
    }
  },

  /**
   *  Create user
   *
   * @param body
   * @param res
   * @return {Promise<*>}
   */
  createUser: async ({body}, res) => {
    try {
      const {error, value} = userValidator.validate(body);
      if (error) throw error;
      const newUser = await userService.createUser(value);

      return res.status(200).send({
        _id: newUser && newUser._id,
        success: true
      });
    } catch (e) {
      return res.status(200).send({
        success: false,
        error: e.message,
      })
    }
  },

  /**
   *  Update user
   *
   * @param body
   * @param res
   * @return {Promise<*>}
   */
  updateUser: async ({body}, res) => {
    try {
      const {error, value} = userValidator.validate(body);
      if (error) throw error;
      const updatedUser = await userService.updateUser(value);

      return res.status(200).send({
        _id: updatedUser._id,
        success: true
      });
    } catch (e) {
      return res.status(200).send({
        success: false,
        error: e.message,
      });
    }
  },

  /**
   * Delete user by id
   *
   * @param query
   * @param res
   * @return {Promise<*>}
   */
  deleteUser: async ({query}, res) => {
    try {
      const result = await userService.deleteUser(query.id);

      return res.status(200).send(result && !!result.deletedCount);
    }catch (e) {
      return res.status(200).send(false);
    }
  }

};

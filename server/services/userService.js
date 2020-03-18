const User = require('../models/user');

module.exports = {
  /**
   * get sorted and paginated list of users
   *
   * @param options
   * @returns {Query}
   */
  paginatedList: (options) => {
    const {filter, sort, startIndex, pageSize} = options;
    const sortOrder = (options.order) ? ((options.order === 'asc') ? 1 : -1) : -1;
    return User.find(filter).sort({[sort]: sortOrder}).skip(parseInt(startIndex)).limit(parseInt(pageSize)).lean();
  },

  /**
   * Create new user
   *
   * @param userData
   * @returns {Promise<Promise|void|*>}
   */
  createUser: async (userData) => {
    return await new Promise(async (resolve, reject) => {
      try {
        userData.email = userData.email.toLowerCase();

        //checking email uniqueness
        const userExists = await User.findOne({email: userData.email}).select('email').lean();
        if(userExists) return reject(new Error(`User with the email ${userData.email} already exists.`));

        if (userData.role === 'art_manager') { //checking art designer uniqueness
          const artDesigner = await User.findOne({role: userData.role}).select('role').lean();
          if(artDesigner) return reject(new Error('User with the role Art designer already exists.'));
        }

        const newUser = new User(userData);
        await newUser.save();

        resolve(newUser);
      }catch(e){
        reject(e);
      }
    });
  },

  /**
   * Update user
   *
   * @param userData
   * @returns {Promise<Promise|void|*>}
   */
  updateUser: async (userData) => {
    return await new Promise(async (resolve, reject) => {
      try {
        userData.email = userData.email.toLowerCase();

        //checking email uniqueness
        const userExists = await User.findOne({_id: { $ne: userData._id }, email: userData.email}).select('email').lean();
        if(userExists) return reject(new Error(`User with the email ${userData.email} already exists.`));

        if (userData.role === 'art_manager') { //checking art designer uniqueness
          const artDesigner = await User.findOne({_id: { $ne: userData._id }, role: userData.role}).select('role').lean();
          if(artDesigner) return reject(new Error('User with the role Art designer already exists.'));
        }

        const user = await User.findOneAndUpdate({ _id: userData._id }, userData, {new: true}).lean();

        resolve(user);
      }catch(e){
        reject(e);
      }
    });
  },

  deleteUser: (_id) => {
    return User.deleteOne({_id});
  },


  /**
   *
   * @param email
   * @return {Query}
   */
  getUserByEmail: (email) => {
    return User.findOne({email: email.toLowerCase()}).lean();
  },



  /**
   * get Count by filter
   *
   * @param filter
   * @return {*}
   */
  getCount: (filter) => {
    return User.countDocuments(filter).lean();
  },

};

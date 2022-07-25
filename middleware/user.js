const User = require('../models/user');

module.exports = async function(req, res,  next)
{
    
    if (!req.session.user)
    {
        return next();
    }
    
    req.user = await new User().getUserByEmail(req.session.user.email);
    next();

}
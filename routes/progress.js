const {Router} = require('express');
const router = Router();
const auth = require('../middleware/auth');
const Test = require('../models/test');
const testing = new Test();
router.get('/', auth, async (req, res) => {
    const results = await testing.getProgress(req.user.id);
    res.render('progress', {
        isProgress: true,
        title: 'Мой прогресс ',
        results,
        addJs: true
    })
});




module.exports = router;
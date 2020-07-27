const express = require('express');
const router = express.Router();
const passpostGoogle = require('../auth/google');


router.get('/google' , passpostGoogle.authenticate(
    'google',
    {
        scope: ['profile']
    }
));


router.get('/google/callback' , passpostGoogle.authenticate(
   'google',
    {
        failureRedirect: '/'
    }),
    (req,res) => {
        res.redirect('/chat');
    }
);

module.exports = router;
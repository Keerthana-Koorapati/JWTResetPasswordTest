const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const jwt = require('jwt-simple')


app.use(bodyParser.urlencoded({extended: false}))

app.listen(3000, function(){
    console.log('server running on port 3000')
})

app.get('/forgotpassword', function(req, res){
    res.send('<form action="/passwordreset" method="POST">' + 
    '<input type="email" name="email" value="" placeholder="Enter your email ID"/>' +
    '<input type="submit" value="Reset password"/>' +
    '</form>')
})

app.post('/passwordreset', function(req, res){
    if(req.body.email!==undefined){
        var emailAddress = req.body.email

        // TODO: This is the portion where we will be identifying the user from the database
        var payload = {
            id: 1,
            email: emailAddress
        }

        // TODO: Make this a one-time-use token by using the user's
        // current password hash from the database, and combine it
        // with the user's created date to make a very unique secret key!
        // For example:
        // var secret = user.password + ‘-' + user.created.getTime();
        var secret = 'fe1a1915a379f3be5394b64d14794932-1506868106675';

        var token = jwt.encode(payload, secret)

        // TODO: Send email containing link to reset password.
        // In our case, will just return a link to click.
        res.send('<a href="/resetpassword/'+ payload.id + '/' + token + '">Reset password</a>')
    }
    else{
        res.send('Email ID is missing')
    }
})

app.get('/resetpassword/:id/:token', function(req, res){
    var secret = 'fe1a1915a379f3be5394b64d14794932-1506868106675';
    var payload = jwt.decode(req.params.token, secret)
    res.send('<form action="/resetpassword" method="POST">' +
        '<input type="hidden" name="id" value="' + payload.id + '" />' +
        '<input type="hidden" name="token" value="' + req.params.token + '" />' +
        '<input type="password" name="password" value="" placeholder="Enter your new password..." />' +
        '<input type="submit" value="Reset Password" />' +
    '</form>');
})

app.post('/resetpassword', function(req, res){
    var secret = 'fe1a1915a379f3be5394b64d14794932-1506868106675';
    var payload = jwt.decode(req.body.token, secret)
    // TODO: Gracefully handle decoding issues.
    // TODO: Hash password from
    // req.body.password
    res.send('Your password has been successfully changed.')
})


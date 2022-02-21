const express = require('express');
const mongoose = require('mongoose');
const birthdayRoutes = require('./routes/birthday');
const app = express();
const url = 'mongodb+srv://bojan:kostaqqqq@birthday.kwfq8.mongodb.net/birthday?retryWrites=true&w=majority';


mongoose.connect(url, {  })
.then( result => {
    console.log('Connected');
    app.listen(process.env.PORT || 5000);
})
.catch(error => console.log(error));

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());


app.use('/birthday', birthdayRoutes);

app.get('/', (req,res) => {
    res.render('index');
});


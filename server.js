//DB
const mongoose = require('mongoose');
const db = require('./config/keys').MONGO_URI;
mongoose.connect(db, { useNewUrlParser: true, useFindAndModify: false })
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err));
//APP
const app = require('./app');
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));
const express = require('express');
const app = express();
const port = 3000;
const db = require('./models');
const path = require('path');
const userroutes = require('./routes/route');
const morgan = require('morgan');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'src')));
app.use(morgan('tiny'));
app.use('/api',userroutes);

db.sequelize.sync({force:false}).then(()=>{
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
      });
}).catch((err)=>{
    console.log('Unable to connect to the database:',err);
})

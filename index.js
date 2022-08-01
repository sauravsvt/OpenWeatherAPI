const express = require('express');
const {Sequelize, DataTypes, Model} = require('sequelize');
const sequelize = new Sequelize('temp', 'root', '', {
    host: 'localhost',
    dialect: `mysql`,
});

try{
    sequelize.authenticate();
   console.log('Connection established successfully')

} catch(error) {
   console.error('Unable to connect to the database: ', error);
}

const app = express();



//models
class User extends Model {}
User.init({
    temp: {
        type: Sequelize.STRING
        },

    humidity: {
        type: Sequelize.STRING
        },

    createdAt: {
        type: Sequelize.DATE,
        field: 'created_at',
      },

    updatedAt: {
        type: Sequelize.DATE,
        field: 'updated_at'
      },

    feels_like: {
        type: Sequelize.STRING
    },

    pressure: {
        type: Sequelize.STRING
    },

    windspeed: {
        type: Sequelize.STRING
    }
      
}
,
{
    sequelize, modelName: 'User'
});

app.use(express.json());
app.use(express.urlencoded({
    extended: true,
})
);

function postData() {
var request = require('request');
var url = "https://api.openweathermap.org/data/2.5/weather?lat=28.6139&lon=77.2090&appid=ee2e2f06d162edec893dcf9dfdcb55b9&units=metric";
request(url, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    curTemp = JSON.parse(body).main.temp; 
    curHumi = JSON.parse(body).main.humidity; 
    curFeels_Like = JSON.parse(body).main.feels_like; 
    curPressure = JSON.parse(body).main.pressure; 
    curWindSpeed = JSON.parse(body).wind.speed; 
    console.log(curHumi, curTemp, curFeels_Like, curPressure, curWindSpeed);

    const createData = function (req, res, next) {
        console.log("curHumi, curTemp")
        User.create({
            temp: curTemp,
            humidity: curHumi,
            feels_like: curFeels_Like,
            pressure: curPressure,
            windspeed: curWindSpeed
        })
    }
    createData();
  
  }
})
};
 setInterval(postData, 1000);

function showAll(){
User
.findAll({order: [['id', 'DESC']], limit: 5, raw: true })
.then(function(asd) {
    console.log(asd);

});
};



//showAll();

app.listen(3000);

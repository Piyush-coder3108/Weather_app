const express=require('express');
const path= require('path');
const fetch=require('node-fetch');
const app=express();

const PORT=process.env.PORT || 5100;


// Body Parser
app.use(express.urlencoded({extended: true}));

// Serving Static files
app.use(express.static(path.join(__dirname,'/assets/')));

// Setting view engine
app.set('view engine','ejs');
app.set('views','./views');



function find_temp_logo(temp){
    if(temp<0){
        return 'low'
    }

    else if(temp<10){
        return 'quarter';
    }
    else if(temp>=10 && temp<20){
        return 'half';
    }
    else if(temp>=20 && temp<30){
        return 'three-quarters'
    }
    else{
        return 'full'
    }
}

function msToHMS(s) {
    var currentTime = new Date();

var currentOffset = currentTime.getTimezoneOffset();

var ISTOffset = 330;   // IST offset UTC +5:30 
    var now = new Date(s*1000+(ISTOffset + currentOffset)*60000);
        let hours = now.getHours();
        let mins = now.getMinutes();
        let periods = "AM";

        if (hours > 11) {
          periods = "PM";
          if (hours > 12) hours -= 12;
        }
        if (mins < 10) {
          mins = "0" + mins;
        }
        
        return `${hours}:${mins}${periods}`;
  }


app.get('/',(req,res)=>{
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=Delhi&units=metric&appid=ece2c238cd8c10540290c3f8a3864c66`)
    .then(response=> response.json())
    .then(weather=>{
        
        const { temp,temp_min,temp_max,pressure,humidity}=weather.main;
        const visibility=weather.visibility;
        const {sunrise,sunset}=weather.sys;
        const name=weather.name;
        const icon=weather.weather[0].icon;
        const windspeed=weather.wind.speed;
        const imageUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
        const sunrisetym= msToHMS(sunrise);
        const sunsettym= msToHMS(sunset);
        const description=weather.weather[0].description;
        
        res.render('index',{
            city: "Delhi (default)",
            name: name,
            temp: temp,
            temp_min: temp_min,
            temp_max: temp_max,
            pressure: pressure,
            humidity: humidity,
            sunrise: sunrisetym,
            sunset: sunsettym,
            windspeed: windspeed,
            visibility: visibility,
            image:imageUrl,
            pos: true,
            temp_logo: find_temp_logo(temp),
            description: description
        })

    })
    .catch(err=>console.log(err));
});


app.post('/',(req,res)=>{
    if(req.body.city.length>0){
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${req.body.city}&units=metric&appid=ece2c238cd8c10540290c3f8a3864c66`)
    .then(response=> response.json())
    .then(weather=>{
        
        const { temp,temp_min,temp_max,pressure,humidity}=weather.main;
        const visibility=weather.visibility;
        const {sunrise,sunset}=weather.sys;
        const name=weather.name;
        const icon=weather.weather[0].icon;
        const windspeed=weather.wind.speed;
        const imageUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
        const sunrisetym= msToHMS(sunrise);
        const sunsettym= msToHMS(sunset);
        const description=weather.weather[0].description;
        res.render('index',{
            city: req.body.city,
            name: name,
            temp: temp,
            temp_min: temp_min,
            temp_max: temp_max,
            pressure: pressure,
            humidity: humidity,
            sunrise: sunrisetym,
            sunset: sunsettym,
            windspeed: windspeed,
            visibility: visibility,
            image:imageUrl,
            pos: false,
            temp_logo:find_temp_logo(temp),
            description: description
        })

    })
    .catch(err=>console.log(err));

    }
   else{
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${req.body.lattitude}&lon=${req.body.longitude}&units=metric&appid=ece2c238cd8c10540290c3f8a3864c66`)
    .then(response=> response.json())
    .then(weather=>{
        
        const { temp,temp_min,temp_max,pressure,humidity}=weather.main;
        const visibility=weather.visibility;
        const {sunrise,sunset}=weather.sys;
        const name=weather.name;
        const icon=weather.weather[0].icon;
        const windspeed=weather.wind.speed;
        const imageUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
        const sunrisetym= msToHMS(sunrise);
        const sunsettym= msToHMS(sunset);
        const description=weather.weather[0].description;
        res.render('index',{
            city: "Delhi (default)",
            name: name,
            temp: temp,
            temp_min: temp_min,
            temp_max: temp_max,
            pressure: pressure,
            humidity: humidity,
            sunrise: sunrisetym,
            sunset: sunsettym,
            windspeed: windspeed,
            visibility: visibility,
            image: imageUrl,
            pos: false,
            temp_logo:find_temp_logo(temp),
            description: description
        });

    })
    .catch(err=>{console.log(err)
     res.redirect('/');
    });
}
})


// Listening to Server
app.listen(PORT,()=>{
    console.log(`Server running at PORT: ${PORT}`);
})
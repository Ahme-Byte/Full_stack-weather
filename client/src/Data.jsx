import "./Data.css"
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import SunnyIcon from '@mui/icons-material/Sunny';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';

export default function Data({weatherData}){
     if (weatherData && weatherData.Error){
        return(
              <Card sx={{ width: "75%", p:3,margin: "0 auto" }} className="error">
        <Typography variant="body1" color="text.secondary">
          {weatherData.Error}
        </Typography>
      </Card>

        )
    }
    if (!weatherData || !weatherData.main){
        return(
              <Card sx={{ width: "75%", p:3  }}  className="error">
        <Typography variant="body1" color="text.secondary">
          No weather data yet. Search for a city above.
        </Typography>
      </Card>

        )
    }
    let imgUrl=weatherData.main.temp>15 ? "https://images.unsplash.com/photo-1604228741406-3faa38f4907a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3Vubnl8ZW58MHx8MHx8fDA%3D" : "https://images.unsplash.com/photo-1477601263568-180e2c6d046e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8d2ludGVyfGVufDB8fDB8fHww"
    let icon=weatherData.main.temp>15?<SunnyIcon/>:<AcUnitIcon/>;
    if(weatherData.weather[0].main.toLowerCase().includes('rain')){
        imgUrl="https://media.istockphoto.com/id/1476189983/photo/summer-rain-raindrops-bad-weather-depression.webp?a=1&b=1&s=612x612&w=0&k=20&c=EJdBb0mIMVk8xYQz3luCBEaqGLWxdyT6tcBkfirbp34=";
        icon=<ThunderstormIcon/>;
    }
    
    return(
         <Card sx={{ width: "75%",p:3 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="300"
          image={imgUrl}
          alt="green iguana"
          className="cardImage"

        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {weatherData.name}&nbsp;&nbsp;<span>{icon}</span>
          </Typography>
          
           <div className='dataDiv'>
            <p>Temperature</p>
            <p>{weatherData.main.temp}&deg;C</p>
           </div>
             <div className='dataDiv'>
            <p>Feels Like</p>
            <p>{weatherData.main.feels_like}&deg;C</p>
           </div>
             <div className='dataDiv'>
            <p>Max Temp</p>
            <p>{weatherData.main.temp_max}&deg;C</p>
           </div>
             <div className='dataDiv'>
            <p>Min Temp</p>
            <p>{weatherData.main.temp_min}&deg;C</p>
           </div>
             <div className='dataDiv'>
            <p>Humidity</p>
            <p>{weatherData.main.humidity}</p>
           </div>
             <div className='dataDiv'>
            <p>Condition</p>
            <p>{weatherData.weather[0].description}</p>
           </div>
       
        </CardContent>
      </CardActionArea>
    </Card>
        
    )
}
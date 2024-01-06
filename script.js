const container = document.querySelector('.container');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
let forcastElement = document.querySelector('.forcasts');
const error404 = document.querySelector('.not-found');
const cityHide = document.querySelector('.city-hide');
const footer = document.querySelector('.FOOTER');

let cloneFahrenheitLink;
let cloneCelsiusLink;
let celsiusTemperature = null;
  
let searchButton = document.querySelector("#search-button");
searchButton.addEventListener("click", searchPosition);
  
let locationButton = document.querySelector("#location-button");
locationButton.addEventListener("click", navigate);
  
let fahrenheitLink = document.querySelector("#unit-f");
fahrenheitLink.addEventListener("click", displayFahrenheit);
  
let celsiusLink = document.querySelector("#unit-c");
celsiusLink.addEventListener("click", displayCelsius);

function navigate(){
    navigator.geolocation.getCurrentPosition(showPosition);
}

function displayFahrenheit(event) {
    event.preventDefault();
    let fahrenheit = Math.round(celsiusTemperature * 1.8 + 32);
    let defaultTemp = document.querySelector(".active-clone #current-temp");
    defaultTemp.innerHTML = fahrenheit;
    cloneFahrenheitLink.classList.add("actUnit");
    cloneCelsiusLink.classList.remove("actUnit");
}
  
function displayCelsius(event) {
    event.preventDefault();
    let defaultTemp = document.querySelector(".active-clone #current-temp");
    defaultTemp.innerHTML = celsiusTemperature;
    cloneFahrenheitLink.classList.remove("actUnit");
    cloneCelsiusLink.classList.add("actUnit");
}

function showPosition(position){
    let lat = position.coords.latitude;
    let long = position.coords.longitude;
    let apiKey = "6c60fabe649d33c314498b8aba31de6b";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}&units=metric`;
    //axios.get(apiUrl).then(showResult);  //this will not working with showResult function
    fetch(apiUrl).then(response => response.json()).then(showResult);
}

function searchPosition(event) {
    //event.preventDefault();
    let city = document.querySelector('.search-box input').value;
    if (city == ''){
        return;
    }
    searchDefault(city);
}

function searchDefault(city) {
    const apiKey = 'd43c196bbc190cff7ca9b13420b2d178';
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    fetch(apiUrl).then(response => response.json()).then(showResult)
}

async function showResult(json){
    console.log(json)

    const city = json.name;

    if (json.cod =='404'){
        cityHide.textContent = city;
        container.style.height = '450px';
        container.style.width = '550px';
        weatherBox.classList.remove('active');
        weatherDetails.classList.remove('active');
        forcastElement.classList.remove('active');
        error404.classList.add('active');
        return;
    }

    

    const image = document.querySelector(".weather-box img");
    const defaultTemp = document.querySelector('#current-temp');
    const description = document.querySelector('.weather-box .description');
    const currentCity = document.querySelector('.weather-box .currentCity');
    const feels = document.querySelector('.weather-details .feels span');
    const humidity = document.querySelector('.weather-details .humidity span');
    const wind = document.querySelector('.weather-details .wind span');
    if (cityHide.textContent == city){
        return;
    }
    else{
        cityHide.textContent = city;

        container.style.height = '650px';
        container.style.width = '800px';  // si tu fais ces 2 propriétés ici tu dois augmenter le setTimeout  à 400 sinon (les 2 prop après await) 200 est suffisante
       // footer.style.marginLeft = '-500px';  
       footer.style.transform = 'translateX(-286px)';

        getForecast(json.coord);
        await new Promise((resolve, reject) => setTimeout(resolve, 500));  // attendre 200ms, le temps que l'api forcasts se réccupère
                                                                           // cette méthode est plus mieux que utiliser le setTimeout 2fois   

        container.classList.add('active');  //dans cette étape l'élément forcasts ne va descendre que après await
        forcastElement.classList.add('active');
        //setTimeout(() => container.classList.add('active'), 500);  ////
        //setTimeout(()=>forcastElement.classList.add('active'),500);
    
        weatherBox.classList.add('active');
        weatherDetails.classList.add('active');
        //forcastElement.classList.add('active');
        error404.classList.remove('active');
        

        setTimeout(() => {
            container.classList.remove('active');
        }, 2500);

        let currentDate = document.querySelector("#current-date");
        let now = new Date();
        let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        let day = days[now.getDay()];
        let hour = now.getHours();
        if (hour < 10) {
        hour = `0${hour}`;
        }
        let minutes = now.getMinutes();
        if (minutes < 10) {
        minutes = `0${minutes}`;
        }
        currentDate.innerHTML = `${day} ${hour}:${minutes}`;  
        
        switch (json.weather[0].main){
            case 'Clear':
                image.src = 'images/clear.png';
                break;
            case 'Rain':
                image.src = 'images/rain.png';
                break;   
            case 'Snow':
                image.src = 'images/snow.png';
                break;   
            case 'Clouds':
                image.src = 'images/cloud.png';
                break; 
            case 'Mist':
                image.src = 'images/mist.png';
                break;  
            case 'Haze':
                image.src = 'images/mist.png';
                break;           
            default:
                image.src = 'images/cloud.png';                    
        }
        
        celsiusTemperature = parseInt(json.main.temp)
        currentCity.innerHTML = `${json.name}`;
        defaultTemp.innerHTML = celsiusTemperature;
        description.innerHTML = `${json.weather[0].description}`;
        feels.innerHTML = `${parseInt(json.main.feels_like)}°`;
        humidity.innerHTML = `${json.main.humidity}%`;
        wind.innerHTML = `${parseInt(json.wind.speed)}km/h`;
    
        //getForecast(json.coord);  /// 

        
        const infoDay = document.querySelector('.weather-box .info-day');
        const infoWeather = document.querySelector('.weather-box .info-weather');
        const infoFeels = document.querySelector('.info-feels');
        const infoHumidity = document.querySelector('.info-humidity');
        const infoWind = document.querySelector('.info-wind');
        const infoForcast = document.querySelectorAll('.forcasts .info-day');

        console.log(infoForcast[0]);

        const elCloneInfoDay = infoDay.cloneNode(true);
        const elCloneInfoWeather = infoWeather.cloneNode(true);
        const elCloneInfoFeels = infoFeels.cloneNode(true);
        const elCloneInfoHumidity = infoHumidity.cloneNode(true);
        const elCloneInfoWind = infoWind.cloneNode(true);
        const elCloneInfoForcast1 = infoForcast[0].cloneNode(true);
        const elCloneInfoForcast2 = infoForcast[1].cloneNode(true);
        const elCloneInfoForcast3 = infoForcast[2].cloneNode(true);
        const elCloneInfoForcast4 = infoForcast[3].cloneNode(true);
        const elCloneInfoForcast5 = infoForcast[4].cloneNode(true);

        elCloneInfoDay.id = 'clone-info-day';
        elCloneInfoDay.classList.add('active-clone');

        elCloneInfoWeather.id = 'clone-info-weather';
        elCloneInfoWeather.classList.add('active-clone');

        elCloneInfoFeels.id = 'clone-info-feels';
        elCloneInfoFeels.classList.add('active-clone');

        elCloneInfoHumidity.id = 'clone-info-humidity';
        elCloneInfoHumidity.classList.add('active-clone');

        elCloneInfoWind.id = 'clone-info-wind';
        elCloneInfoWind.classList.add('active-clone');

        elCloneInfoForcast1.classList.add('clone-info-forcast', 'infoFor1', 'active-clone');
        elCloneInfoForcast2.classList.add('clone-info-forcast', 'active-clone');
        elCloneInfoForcast3.classList.add('clone-info-forcast', 'active-clone');
        elCloneInfoForcast4.classList.add('clone-info-forcast', 'active-clone');
        elCloneInfoForcast5.classList.add('clone-info-forcast', 'active-clone');

        setTimeout(()=>{
            infoDay.insertAdjacentElement('afterend',elCloneInfoDay);
            infoWeather.insertAdjacentElement('afterend',elCloneInfoWeather);
            infoFeels.insertAdjacentElement('afterend',elCloneInfoFeels);
            infoHumidity.insertAdjacentElement('afterend',elCloneInfoHumidity);
            infoWind.insertAdjacentElement('afterend',elCloneInfoWind);
            infoForcast[0].insertAdjacentElement('afterend', elCloneInfoForcast1);
            infoForcast[1].insertAdjacentElement('afterend', elCloneInfoForcast2);
            infoForcast[2].insertAdjacentElement('afterend', elCloneInfoForcast3);
            infoForcast[3].insertAdjacentElement('afterend', elCloneInfoForcast4);
            infoForcast[4].insertAdjacentElement('afterend', elCloneInfoForcast5);
            
            cloneFahrenheitLink = document.querySelector(".active-clone #unit-f");
            cloneFahrenheitLink.addEventListener("click", displayFahrenheit);

            cloneCelsiusLink = document.querySelector(".active-clone #unit-c");
            cloneCelsiusLink.addEventListener("click", displayCelsius);




        },2200);   //à ce moment les info originaux sont en translateY(0%)

        const cloneInfoWeather  = document.querySelectorAll('.info-weather.active-clone');
        const totalCloneInfoWeather = cloneInfoWeather.length;
        const cloneInfoWeatherFirst = cloneInfoWeather[0];

        const cloneInfoDay = document.querySelectorAll('.info-day.active-clone');
        const cloneInfoDayFirst = cloneInfoDay[0];

        const cloneInfoFeels = document.querySelectorAll('.info-feels.active-clone');
        const cloneInfoFeelsFirst = cloneInfoFeels[0];

        const cloneInfoHumidity = document.querySelectorAll('.info-humidity.active-clone');
        const cloneInfoHumidityFirst = cloneInfoHumidity[0];

        const cloneInfoWind = document.querySelectorAll('.info-wind.active-clone');
        const cloneInfoWindFirst = cloneInfoWind[0];

        

        const cloneInfoForcast = document.querySelectorAll('.forcasts .active-clone');
        const cloneInfoForcastFirst = cloneInfoForcast[0];
       

        if ( totalCloneInfoWeather > 0 ){
            cloneInfoWeatherFirst.classList.remove('active-clone');
            cloneInfoDayFirst.classList.remove('active-clone');
            cloneInfoFeelsFirst.classList.remove('active-clone');
            cloneInfoHumidityFirst.classList.remove('active-clone');
            cloneInfoWindFirst.classList.remove('active-clone');
            //cloneInfoForcastFirst.classList.remove('active-clone');

            setTimeout(()=>{
                cloneInfoWeatherFirst.remove();
                cloneInfoDayFirst.remove();
                cloneInfoFeelsFirst.remove();
                cloneInfoHumidityFirst.remove();
                cloneInfoWindFirst.remove();
                //cloneInfoForcastFirst.remove();
            },2200)
        }


    }

    
    
}


function getForecast(coordinates) {
    const apiKey = '6c60fabe649d33c314498b8aba31de6b';
    let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
    
    axios.get(apiUrl).then(displayForecast);
    //fetch(apiUrl).then(response => response.json()).then(displayForecast);
}
function formatDay(timestamp) {
    let date = new Date(timestamp * 1000);
    let day = date.getDay(); // day: take 0 or 1 or 2 or 3 or 4 or 5 or 6 it depends the day 
    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[day];
  }

function displayForecast(response) {

        let forecast = response.data.daily;
        let forecastHTML = ``;
        forecast.forEach(function (forecastDay, index) {
            if (index < 5) {
            forecastHTML =
                forecastHTML +
                `       <div class="day">
                        <div class="info-day">
                        <p class="dayX">
                            ${formatDay(forecastDay.dt)} <br />
                            <img src="imgs/icons/icon_${
                            forecastDay.weather[0].icon
                            }.svg" alt="rain" /><br />
                            <span class="dayXtemp_max">${Math.round(
                            forecastDay.temp.max
                            )}°</span
                            ><span class="dayXtemp_min">${Math.round(
                            forecastDay.temp.min
                            )}°</span>
                        </p>
                        </div>
                        </div>
                    `;
            }
        });
        forecastHTML = forecastHTML + `</div>`;
        forcastElement.innerHTML = forecastHTML; 

    }


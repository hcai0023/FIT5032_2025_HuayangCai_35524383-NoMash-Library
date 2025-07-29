<template>
    <div class="container">
        <div class="header">
            <h1>WEATHER APP</h1>
            <div class="search-bar">
                <input 
                    type="text" 
                    v-model="city"
                    placeholder="Enter city name"
                    class="search-input"
                />
                <button @click="searchByCity" class="search-button">
                    Search
                </button>
                <br>
                <br>
                Please implement "Search Weather by City".
            </div>
        </div>
    </div>
    <!--The <main> tag in HTML is used to specify the main content of a document 
      More info about main, check https://www.w3schools.com/tags/tag_main.asp-->  
      <main>
        <!--If there are no data returned, then skip rendering the information-->  
        <div v-if="weatherData">
          <!--Display the weather data attribute returned from API
          Example of API data: https://openweathermap.org/current-->  
          <h2>
              {{ weatherData.name }}, {{ weatherData.sys.country }}
          </h2>
          <div>
            <!--The image source of of the weather icon will be coming from a function called iconUrl
                which will be shared in script later-->  
            <img :src="iconUrl" alt="Weather Icon" />
            <p>{{ temperature }} °C</p>
          </div>
          <!-- weather[0] means the current weather, the way we need to obtain data depends on how
          the API JSON data looks-->
          <span>{{ weatherData.weather[0].description }}</span>
        </div>
      </main>
</template>

<script>
  // The info section in 10.1.1 provided detailed information about this package 
  import axios from "axios";

  const apikey = "b7a8e9cc41bdcffb46157c8c8ae72000";
  
  export default {
    name: "App",
    data() {
      return {
        city: "",
        weatherData: null,
        hourlyForecast: [],
        dailyForecast: [],
      };
    },
    //computed is a property that is used to define a property that 
    //is dependent on other data properties. 
    //If we using a more easy to understand words to understand the concept: 
    //the derived value such as temperature automatically update when the relevant value change.
    computed: {
      //There are multiple way to obtain the data in Celsius format.
      //Calculation by yourself like below after data is retireved or via API parameters
      
      //Example of adding additional units requirement, if you choose this, remember to change section 3.1
      //https://api.openweathermap.org/data/2.5/weather?lat=XXX&lon=-XXX.15&appid={API key}&units=metric
      temperature() {
        return this.weatherData
          ? Math.floor(this.weatherData.main.temp - 273)
          : null;
      },
      //Get the current weather icon using the API link
      iconUrl() {
        return this.weatherData
          ? `https://api.openweathermap.org/img/w/${this.weatherData.weather[0].icon}.png`
          : null;
      },
    },
    //There are two steps involved in this, 
    //step 1: identify current location 
    //step 2: after identify, get the weather data straight based on the current location.
    mounted() {
      this.fetchCurrentLocationWeather();
    },
    methods: {
      //Async in a easy to understand way means the method will run in backend thread, 
      //And it won't occupy the main thread, so the user experience is still smooth
      async fetchCurrentLocationWeather() {
        //The navigator.geolocation object is part of the Web API provided by modern web browsers
        //Please note this function is not belongs to Vue or openweather.
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            //API link to obtain the current weather based on the current location browser identified 
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apikey}`;
            //await means wait for the fetchWeatherData method to complete before proceeding
            await this.fetchWeatherData(url);
          });
        }
      },
      async fetchWeatherData(url) {
        try {
          const response = await axios.get(url);
          //Returned data from API is stored as JSON file in weatherData
          this.weatherData = response.data;
        } catch (error) {
          console.error("Error fetching weather data:", error);
        }
      },
      async searchByCity() {
        // 清除之前的错误和数据
        this.error = "";
        this.weatherData = null;
        this.hourlyForecast = [];
        
        // 验证输入
        if (!this.city.trim()) {
            this.error = "Please enter a city name";
            return;
        }
        
        this.isLoading = true;
        
        try {
            // 1. 获取城市坐标
            const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(this.city)}&limit=1&appid=${apikey}`;
            const geoResponse = await axios.get(geoUrl);
            
            if (!geoResponse.data || geoResponse.data.length === 0) {
            throw new Error("City not found. Please check the name and try again.");
            }
            
            const { lat, lon } = geoResponse.data[0];
            
            // 2. 获取当前天气
            const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}`;
            const weatherResponse = await axios.get(currentWeatherUrl);
            this.weatherData = weatherResponse.data;
            
        } catch (error) {
            console.error("Error fetching weather data:", error);
            this.error = error.response?.data?.message || error.message || "Failed to fetch weather data. Please try again.";
        } finally {
            this.isLoading = false;
        }
        }
    }
  }
</script>
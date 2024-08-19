const userInput = document.querySelector("input");
const formArea = document.querySelector("#input-search-container");
const suggestionContainer = document.querySelector("#filter-search-container");
let mainCity = document.querySelector("#main-city-name");
let weatherDescription = document.querySelector("#description");
let mainTemp = document.querySelector("#main-temp");

async function fetchData(userRequest) {
  const apiKey = "50ea21f8f2f5f834624d2cac1880b3a5";

  try {
    const response = await fetch(
      `http://api.openweathermap.org/data/2.5/weather?q=${userRequest}&appid=${apiKey}&units=imperial`
    );
    const data = await response.json();
    console.log(data);

    const realFeel = document.getElementById("real-feel");

    const windSpeed = document.getElementById("wind-speed");
    const humidityIndex = document.getElementById("humidity-index");

    windSpeed.textContent = data.wind.speed + "m/h";
    realFeel.textContent = data.main.feels_like;
    humidityIndex.textContent = data.main.humidity + "%";

    const mainImageContainer = document.getElementById("info-image-container");
    mainImageContainer.innerHTML = "";
    const newImage = document.createElement("img");
    newImage.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
    mainImageContainer.appendChild(newImage);

    mainCity.textContent = data.name;
    weatherDescription.textContent = data.weather[0].description;
    mainTemp.textContent = Math.floor(data.main.temp) + "°F";
  } catch (error) {
    console.error("Error fetching data");
  }
}

async function fiveDayForcast(userRequest) {
  const apiKey = "50ea21f8f2f5f834624d2cac1880b3a5";

  try {
    const response = await fetch(
      `http://api.openweathermap.org/data/2.5/forecast?q=${userRequest}&appid=${apiKey}&units=imperial`
    );
    const data = await response.json();
    console.log(data, "five day is working");

    const chanceOfRain = document.getElementById("rain-chance");
    chanceOfRain.textContent = data.list[0].pop * 100 + "%";

    const forecastList = data.list.filter((item) =>
      item.dt_txt.includes("21:00:00")
    );
    const fiveDayContainer = document.getElementById("five-day-info-container");
    fiveDayContainer.innerHTML = "";

    forecastList.forEach((data) => {
      const day = new Date(data.dt * 1000).toLocaleDateString(undefined, {
        weekday: "short",
      });
      const weatherIcon = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
      const temp = Math.floor(data.main.temp);

      const newDiv = document.createElement("div");
      newDiv.classList.add("new-five-detail");

      newDiv.innerHTML = `
        <p>${day}</p>
        <img src="${weatherIcon}">
        <p class="new-five-temp">${temp}°F</p>
        `;

      fiveDayContainer.appendChild(newDiv);
    });
  } catch (error) {
    console.error("Seven day forcast is not working", error);
  }
}

async function hourlyForecast(userRequest) {
  const apiKey = "50ea21f8f2f5f834624d2cac1880b3a5";

  try {
    const response = await fetch(
      `http://api.openweathermap.org/data/2.5/forecast?q=${userRequest}&appid=${apiKey}&units=imperial`
    );
    const data = await response.json();
    console.log(data, "hourly working");

    const hourlyData = data.list.slice(0, 6);

    const hourlyContainer = document.getElementById("details-container");
    hourlyContainer.innerHTML = "";

    hourlyData.forEach((datal) => {
      const hour = new Date(datal.dt * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      const temp = Math.floor(datal.main.temp);
      const weatherIcon = `http://openweathermap.org/img/wn/${datal.weather[0].icon}.png`;

      const detailsContainer = document.createElement("div");
      detailsContainer.classList.add("new-hourly-detail");
      detailsContainer.innerHTML = `
         <p class="new-hour">${hour}</p>
         <img  src="${weatherIcon}">
         <p class="new-temp">${temp}</p>
        
        `;

      hourlyContainer.appendChild(detailsContainer);
    });
  } catch (error) {
    console.error("failed to fetch hourly forcast", error);
  }
}

formArea.addEventListener("submit", (event) => {
  event.preventDefault();
  const userRequest = userInput.value.trim();

  fetchData(userRequest);
  hourlyForecast(userRequest);
  fiveDayForcast(userRequest);
});

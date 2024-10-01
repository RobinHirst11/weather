const container = document.querySelector('.container');
const searchContainer = document.createElement('div');
searchContainer.id = 'searchContainer';
searchContainer.className = 'text-center';
container.appendChild(searchContainer);

const locationMenu = document.createElement('div');
locationMenu.id = 'locationMenu';
locationMenu.className = 'mt-4';
locationMenu.style.display = 'none';
container.appendChild(locationMenu);

const weatherCharts = document.createElement('div');
weatherCharts.id = 'weatherCharts';
weatherCharts.className = 'mt-4';
container.appendChild(weatherCharts);

const weatherDataElement = document.createElement('pre');
weatherDataElement.id = 'weatherData';
weatherDataElement.className = 'mt-4';
container.appendChild(weatherDataElement);

let searchBarVisible = true;

createSearchElements();

async function getWeather() {
    const location = locationSearch.value;
    weatherDataElement.textContent = "";
    weatherCharts.innerHTML = "";

    try {
        const geocodingResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${location}`);
        const geocodingData = await geocodingResponse.json();

        if (geocodingData.results && geocodingData.results.length > 0) {
            if (geocodingData.results.length > 1) {
                // Hide the search 
                searchContainer.style.display = 'none';
                displayLocationMenu(geocodingData.results);
            } else {
                fetchWeatherData(geocodingData.results[0]);
                searchContainer.classList.add('searched');
            }
        } else {
            searchContainer.classList.remove('searched');
            locationMenu.style.display = 'none';
            searchContainer.style.display = 'flex';
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        weatherDataElement.textContent = "Error fetching data.";
        locationMenu.style.display = 'none';
        searchContainer.style.display = 'flex';
    }
}

function displayLocationMenu(locations) {
    if (searchBarVisible) {
        searchContainer.style.display = 'none';
        searchBarVisible = false;
    }

    locationMenu.innerHTML = '';

    const locationList = document.createElement('ul');
    locationList.className = 'list-group';

    locations.forEach(location => {
        const listItem = document.createElement('li');
        listItem.className = 'location-item list-group-item d-flex justify-content-between align-items-center';

        const locationInfo = document.createElement('span');
        locationInfo.textContent = `${location.name}, ${location.country} (${location.latitude}, ${location.longitude})`;

        const selectButton = document.createElement('button');
        selectButton.className = 'button-1';
        selectButton.textContent = 'Select';
        selectButton.addEventListener('click', async () => { 
            locationMenu.style.display = 'none';

            await fetchWeatherData(location); 

            searchContainer.style.display = 'flex'; 
            searchBarVisible = true;
            searchContainer.classList.add('searched');
            container.insertBefore(searchContainer, locationMenu); 
        });

        listItem.appendChild(locationInfo);
        listItem.appendChild(selectButton);
        locationList.appendChild(listItem);
    });

    locationMenu.appendChild(locationList);
    locationMenu.style.display = 'block';
}

async function fetchWeatherData(location) {
    const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&hourly=temperature_2m,precipitation`);
    const weatherData = await weatherResponse.json();
    weatherDataElement.textContent = JSON.stringify(weatherData, null, 2);
    createCharts(weatherData);
    document.querySelector('.button-1').style.marginLeft = '10px';
}

function createCharts(weatherData) {
    weatherCharts.innerHTML = '';

    const temperatureChartContainer = document.createElement('div');
    temperatureChartContainer.className = 'chart-container';
    weatherCharts.appendChild(temperatureChartContainer);

    const temperatureChartCanvas = document.createElement('canvas');
    temperatureChartContainer.appendChild(temperatureChartCanvas);

    new Chart(temperatureChartCanvas, {
        type: 'line',
        data: {
            labels: weatherData.hourly.time,
            datasets: [{
                label: 'Temperature (°C)',
                data: weatherData.hourly.temperature_2m,
                borderColor: 'rgb(255, 99, 132)',
                tension: 0.4,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                pointBackgroundColor: 'white',
                pointRadius: 3,
                borderWidth: 2
            }]
        },
        options: {
            scales: {
                y: {
                    ticks: {
                        color: 'white'
                    }
                },
                x: {
                    ticks: {
                        color: 'white'
                    }
                }
            }
        }
    });

    if (weatherData.hourly.precipitation) {
        const precipitationChartContainer = document.createElement('div');
        precipitationChartContainer.className = 'chart-container';
        weatherCharts.appendChild(precipitationChartContainer);

        const precipitationChartCanvas = document.createElement('canvas');
        precipitationChartContainer.appendChild(precipitationChartCanvas);

        new Chart(precipitationChartCanvas, {
            type: 'line',
            data: {
                labels: weatherData.hourly.time,
                datasets: [{
                    label: 'Precipitation (mm)',
                    data: weatherData.hourly.precipitation,
                    borderColor: 'blue',
                    tension: 0.4,
                    backgroundColor: 'rgba(0, 0, 255, 0.2)',
                    pointBackgroundColor: 'white',
                    pointRadius: 3,
                    borderWidth: 2
                }]
            },
            options: {
                scales: {
                    y: {
                        ticks: {
                            color: 'white'
                        }
                    },
                    x: {
                        ticks: {
                            color: 'white'
                        }
                    }
                }
            }
        });
    }
}

function createSearchElements() {
    const locationInput = document.createElement('input');
    locationInput.type = 'text';
    locationInput.id = 'locationSearch';
    locationInput.className = 'form-control me-2';
    locationInput.placeholder = 'Enter location';

    const searchButton = document.createElement('button');
    searchButton.className = 'button-1';
    searchButton.textContent = 'Get Weather';
    searchButton.onclick = getWeather;

    searchContainer.appendChild(locationInput);
    searchContainer.appendChild(searchButton);
}


setInterval(function () {
    const newBubble = document.createElement('div');
    newBubble.classList.add('bubbles');
    document.body.appendChild(newBubble);
    newBubble.style.top = Math.floor(Math.random() * window.innerHeight + 1) + 'px';
    newBubble.style.left = Math.floor(Math.random() * window.innerWidth + 1) + 'px';

    const myDirection = Math.floor(Math.random() * 5);
    setTimeout(function () {
        newBubble.style.opacity = '0.5';
    }, 1);

    const speed = 0.16;
    let mytime = setInterval(function () {
        if (myDirection === 1) {
            newBubble.style.top = (parseInt(newBubble.style.top) - speed) + 'px';
            newBubble.style.left = (parseInt(newBubble.style.left) - speed) + 'px';
        } else if (myDirection === 2) {
            newBubble.style.top = (parseInt(newBubble.style.top) - speed) + 'px';
            newBubble.style.right = (parseInt(newBubble.style.right) - speed) + 'px';
        } else if (myDirection === 3) {
            newBubble.style.top = (parseInt(newBubble.style.top) + speed) + 'px';
            newBubble.style.left = (parseInt(newBubble.style.left) + speed) + 'px';
        } else {
            newBubble.style.top = (parseInt(newBubble.style.top) + speed) + 'px';
            newBubble.style.right = (parseInt(newBubble.style.right) + speed) + 'px';
        }
        if (newBubble.style.top <= 0) return clearInterval(mytime);
        if (newBubble.style.left <= 0) return clearInterval(mytime);
        if (newBubble.style.right >= window.innerWidth) return clearInterval(mytime);
        if (newBubble.style.bottom >= window.innerWidth) return clearInterval(mytime);
    }, 1000 / 60);

    setTimeout(function () {
        newBubble.classList.add('bubble-hide');
        setTimeout(function () {
            newBubble.remove();
        }, 2000);
    }, Math.floor(Math.random() * 1000) + 2000);
}, 1000);
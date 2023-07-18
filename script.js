document.addEventListener("DOMContentLoaded", async function() {
  const carousel = document.querySelector(".carousel");
  const prevButton = document.getElementById("prevButton");
  const nextButton = document.getElementById("nextButton");
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");
  const weatherInfo = document.querySelector(".weather-box-container");

  let currentIndex = 0;
  let images = [];

  function showSlide(index) {
    const slides = Array.from(document.querySelectorAll(".slide"));
    slides.forEach((slide) => (slide.style.display = "none"));
    slides[index].style.display = "block";
  }

  function goToNextSlide() {
    currentIndex++;
    if (currentIndex >= images.length) {
      currentIndex = 0;
    }
    showSlide(currentIndex);
  }

  function goToPrevSlide() {
    currentIndex--;
    if (currentIndex < 0) {
      currentIndex = images.length - 1;
    }
    showSlide(currentIndex);
  }

  prevButton.addEventListener("click", goToPrevSlide);
  nextButton.addEventListener("click", goToNextSlide);

  async function fetchWeatherData(location) {
    const apiKey = '255e515f27msh41ac6839c3e9f4dp1948fejsn7abe8b13ea98';
    const url = `https://weatherapi-com.p.rapidapi.com/current.json?q=${encodeURIComponent(location)}`;

    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
      }
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      console.log(result);
      return result;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch weather data');
    }
  }

  async function generateRandomImages(tags, count) {
    const accessKey = '1GvjFGygM0x2s6isByr7BBHQNmE8epYcOa4wPmVbZrg'; 
    console.log(tags);
    try {
      const response = await fetch(`https://api.unsplash.com/photos/random?query=${tags}&count=${count}&client_id=${accessKey}`);
      const data = await response.json();

      const images = data.map((item) => item.urls.regular);
      console.log(images);

      return images;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to generate random images');
    }
  }

  // Set default weather info and carousel images for 'India'
  try {
    const weatherData = await fetchWeatherData('India');
    const temperature = weatherData.current.temp_c;
    const description = weatherData.current.condition.text;

    weatherInfo.innerHTML = `
      <h1>India</h1>
      <hr>
      <div id="bigTemp">${temperature}<sup>°C</sup></div>
      <p>${description}</p>
    `;

    images = await generateRandomImages('India', 5);
    currentIndex = 0;

    showSlide(currentIndex);

    const slideImages = document.querySelectorAll(".slide img");
    slideImages.forEach((image, index) => {
      image.src = images[index];
    });
  } catch (error) {
    console.error(error);
  }
  searchButton.addEventListener("click", function() {
    const location = searchInput.value.trim();
    searchLocation(location);
  });
  document.addEventListener("keydown", function(event) {
    if (event.key === "/") {
      // Focus the search input when '/' key is pressed
      event.preventDefault(); // Prevent '/' character from being entered in the input field
      searchInput.focus(); // Set focus to the search input field
    }
    else if (event.key === "Enter") {
      // Perform search when Enter key is pressed
      event.preventDefault(); // Prevent form submission
      const location = searchInput.value.trim();
      searchLocation(location); 
    }
  });
  const extra = '';
  async function searchLocation(location) {
    if (location !== "") {
      try {
        const weatherData = await fetchWeatherData(location);
        const temperature = weatherData.current.temp_c;
        const description = weatherData.current.condition.text;
        weatherInfo.innerHTML = `
          <h1>${location}</h1>
          <hr>
          <div id="bigTemp">${temperature}<sup>°C</sup></div>
          <p>${description}</p>
        `;
        const tagg = location+' ' + description;
        // console.log(tagg);
        images = await generateRandomImages(tagg, 5);
        currentIndex = 0;

        showSlide(currentIndex);

        const slideImages = document.querySelectorAll(".slide img");
        slideImages.forEach((image, index) => {
          image.src = images[index];
        });
      } catch (error) {
        window.alert("Please Enter Valid location");
        console.error(error);
      }
    }
  }
});

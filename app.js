const myApp = { movieArray: [] };

myApp.key = "ca2c13c7d22715aaa9867db7666b846d";
myApp.url =
  " https://api.themoviedb.org/3/discover/movie?api_key=ca2c13c7d22715aaa9867db7666b846d&language=en-US&sort_by=vote_average.asc&include_adult=false&page=2&include_video=false&release_date.gte=2000&vote_count.gte=1500&with_watch_monetization_types=flatrate";
myApp.init = () => {};

//  Create a loop to loop through the pages based on userclick and push the object into a new array
myApp.getNewArray = (year, movieRating) => {
  console.log("fetch is running");

  // Fetch on movieRating
  fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=ca2c13c7d22715aaa9867db7666b846d&language=en-US&sort_by=vote_average.${movieRating}&include_adult=false&page=1&include_video=false&${year}&vote_count.gte=1500&with_watch_monetization_types=flatrate`
  )
    .then((results) => {
      return results.json();
    })
    .then((jsonData) => {
      jsonData.results.forEach((arrayItem) => {
        myApp.movieArray.push(arrayItem);
      });
    });

  // Fetch on movieYear
  fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=ca2c13c7d22715aaa9867db7666b846d&language=en-US&sort_by=vote_average.${movieRating}&include_adult=false&page=2&include_video=false&${year}&vote_count.gte=1500&with_watch_monetization_types=flatrate`
  )
    .then((results) => {
      return results.json();
    })
    .then((jsonData) => {
      jsonData.results.forEach((arrayItem) => {
        myApp.movieArray.push(arrayItem);
      });
    });

  // Last fetch call
  fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=ca2c13c7d22715aaa9867db7666b846d&language=en-US&sort_by=vote_average.${movieRating}&include_adult=false&page=3&include_video=false&${year}&vote_count.gte=1500&with_watch_monetization_types=flatrate`
  )
    .then((results) => {
      return results.json();
    })
    .then((jsonData) => {
      jsonData.results.forEach((arrayItem) => {
        myApp.movieArray.push(arrayItem);
      });
      // myApp.movieArray = myApp.movieRandomizer(myApp.movieArray).splice(0, 5);
      console.log(myApp.movieArray);

      // console.log(myApp.movieArrayDecisive);
      myApp.movieArrayIndecisive = myApp
        .movieRandomizer(myApp.movieArray)
        .splice(0, 5);
      myApp.movieArrayHopeless = myApp
        .movieRandomizer(myApp.movieArray)
        .splice(0, 1);
      myApp.movieArrayDecisive = myApp.movieArray.splice(0, 10);
      document.querySelector(".inventory").innerHTML = "";
      console.log(myApp.movieArrayIndecisive);
      if (myApp.results.includes("Decisive")) {
        myApp.displayImages(myApp.movieArrayDecisive);
      } else if (myApp.results.includes("Indecisive")) {
        myApp.displayImages(myApp.movieArrayIndecisive);
      } else {
        myApp.displayImages(myApp.movieArrayHopeless);
      }

      console.log(myApp.results);
    });
  console.log(myApp.movieArray);
};

// Store the user input from dropdown menu into a new array
function getSelectedItems() {
  const items = document.getElementsByClassName("selectVal");

  myApp.results = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const userInput = item.options[item.selectedIndex].text;
    myApp.results.push(userInput);
    console.log(userInput);
  }
  // console.log(myApp.results);
}

// When the user clicks the submit button
const submitButton = document.querySelector(".submitButton");

// array randomizer
myApp.movieRandomizer = (array) => {
  console.log("randomizer is running");

  return array.sort(() => 0.5 - Math.random());
};

// Create a function to display the images from the array
myApp.displayImages = function (array) {
  array.forEach((arrayItem) => {
    const listEl = document.createElement("li");
    const imgEl = document.createElement("img");
    const imgGrid = document.querySelector(".inventory");
    // const inventoryEl = document.querySelector(".inventory");

    imgEl.src = `https://image.tmdb.org/t/p/w500${arrayItem.poster_path}`;
    listEl.append(imgEl);
    imgGrid.appendChild(listEl);
  });
};

// Execute this code based on user click
submitButton.addEventListener("click", function (event) {
  console.log("button click is running");

  event.preventDefault();
  myApp.movieArray = [];

  const yearChoice = document.querySelector("#movieYear");
  const scoreChoice = document.querySelector("#movieScore");

  myApp.getNewArray(yearChoice.value, scoreChoice.value);

  // console.log("button click is running");
  //   // listEl.innerHTML = `
  //   // <div.card>
  //   // <div.moviePoster>
  //   // <img src="">
  //   // <p>vote_average</p>
  //   // //<button>Icon of a heart</button>
  //   // </div>
  //   // </div>
  //   // `;

  //PSEUDOCODE
  //grab the value from user selections
  // display the images using the api
  // get the correct amount of images from the array
  // call 3 pages worth from the api
  // create a new array and store the value inside
  // Get the user input from the dropdown menu and store the selection in an array
  // using an array randomize and display the images
});

myApp.init();

const myApp = {};

myApp.key = "ca2c13c7d22715aaa9867db7666b846d";
myApp.url =
  " https://api.themoviedb.org/3/discover/movie?api_key=ca2c13c7d22715aaa9867db7666b846d&language=en-US&sort_by=vote_average.asc&include_adult=false&page=2&include_video=false&release_date.gte=2000&vote_count.gte=1500&with_watch_monetization_types=flatrate&providers";
myApp.init = () => {};
const submitButton = document.querySelector(".submitButton");

//  3 fetches to obtain 60 movie objects for array
myApp.getNewArray = (year, movieRating) => {
  // 1st fetch
  fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=ca2c13c7d22715aaa9867db7666b846d&language=en-US&sort_by=vote_average.${movieRating}&include_adult=false&page=1&include_video=false&${year}&vote_count.gte=1500&with_watch_monetization_types=flatrate&providers`
  )
    .then((results) => {
      return results.json();
    })
    .then((jsonData) => {
      jsonData.results.forEach((arrayItem) => {
        myApp.movieArray.push(arrayItem);
      });
    });

  // 2nd fetch
  fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=ca2c13c7d22715aaa9867db7666b846d&language=en-US&sort_by=vote_average.${movieRating}&include_adult=false&page=2&include_video=false&${year}&vote_count.gte=1500&with_watch_monetization_types=flatrate&providers`
  )
    .then((results) => {
      return results.json();
    })
    .then((jsonData) => {
      jsonData.results.forEach((arrayItem) => {
        myApp.movieArray.push(arrayItem);
      });
    });

  // 3rd fetch
  fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=ca2c13c7d22715aaa9867db7666b846d&language=en-US&sort_by=vote_average.${movieRating}&include_adult=false&page=3&include_video=false&${year}&vote_count.gte=1500&with_watch_monetization_types=flatrate&providers`
  )
    .then((results) => {
      return results.json();
    })
    .then((jsonData) => {
      jsonData.results.forEach((arrayItem) => {
        myApp.movieArray.push(arrayItem);
      });

      myApp.movieArrayIndecisive = myApp
        .movieRandomizer(myApp.movieArray)
        .splice(0, 5);

      myApp.movieArrayHopeless = myApp
        .movieRandomizer(myApp.movieArray)
        .splice(0, 1);

      myApp.movieArrayDecisive = myApp.movieArray.splice(0, 10);

      document.querySelector(".inventory").innerHTML = ""; //clear grid

      //display 10, 5, or 1 movie depending on user selection
      if (myApp.results.includes("Decisive")) {
        myApp.displayImages(myApp.movieArrayDecisive);
      } else if (myApp.results.includes("Indecisive")) {
        myApp.displayImages(myApp.movieArrayIndecisive);
      } else {
        myApp.displayImages(myApp.movieArrayHopeless);
      }
      location.href = "#grid";
    });
};

// Store the user input from dropdown menu into a new array
function getSelectedItems() {
  const items = document.getElementsByClassName("selectVal");

  myApp.results = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const userInput = item.options[item.selectedIndex].value;
    myApp.results.push(userInput);
  }
}

document
  .querySelector(".submitButton")
  .addEventListener("click", getSelectedItems);

// array randomizer
myApp.movieRandomizer = (array) => {
  return array.sort(() => 0.5 - Math.random());
};

//function to obtain streaming providers for movie
myApp.getProviders = function (providers, listEl) {
  const providerContainer = document.createElement("div");
  const providerLink = document.createElement("a");
  const errorMessage = document.createElement("p");

  errorMessage.className = "errorMessage";

  if (providers) {
    providerLink.innerText = `Where to Watch`;
    providerLink.setAttribute("href", providers.link);
    providerLink.setAttribute("target", "_blank");
    providerContainer.className = "providerContainer";
    providerLink.className = "providerLink";
    providerContainer.append(providerLink);
    listEl.appendChild(providerContainer);
  } else {
    listEl.append(errorMessage);
    errorMessage.innerText = `Not Available in Canada`;
  }
};

// Create a function to display the images from the array
myApp.displayImages = function (array) {
  //getting streaming providers for each movie
  array.forEach((arrayItem) => {
    const listEl = document.createElement("li");
    const imgGrid = document.querySelector(".inventory");
    fetch(
      `https://api.themoviedb.org/3/movie/${arrayItem.id}/watch/providers?api_key=ca2c13c7d22715aaa9867db7666b846d`
    )
      .then((results) => {
        return results.json();
      })
      .then((jsonData) => {
        myApp.getProviders(jsonData.results.CA, listEl);
      });

    listEl.innerHTML = `
          <div class="card">
            <div class="moviePoster">
              <img src= "https://image.tmdb.org/t/p/w500${arrayItem.poster_path}" title="${arrayItem.title}"/>
            </div>
            <button type="button" class='likeButton'>
              +
            </button>
          </div>
          `;

    imgGrid.appendChild(listEl);
  });
};

// Delegation
function resultsDelegation(event) {
  event.preventDefault();
  const cardBody = event.target.parentElement;
  const moviePoster = cardBody.querySelector(".moviePoster");
  //console.log(moviePoster.firstElementChild);

  if (event.target.classList.contains("likeButton")) {
    if (event.target.classList.contains("test")) {
      //this is to remove the class
      event.target.classList.remove("test");
      event.target.textContent = "+";
    } else {
      // add the class
      event.target.classList.add("test");
      event.target.textContent = "-";

      // Get information
      const movieInfo = {
        title: moviePoster.firstElementChild.title,
      };

      // localStorage logic

      //set the movieInfo object to localStorage
      localStorage.setItem("movieInfo", JSON.stringify(movieInfo));

      // retrieve the movieInfo stored into localStorage by the user
      const retrievedMovieInfo = localStorage.getItem("movieInfo");
      console.log("retrievedMovieInfo: ", JSON.parse(retrievedMovieInfo));

      //Display the movie title to the HTML with .myDiv
      document.querySelector("#myDiv").innerHTML = movieInfo.title;

      console.log(movieInfo.title);
    }
  }
}

document
  .querySelector(".inventory")
  .addEventListener("click", resultsDelegation);

// function deleteItems() {
//   //remove the item stored in the localStorage
//   localStorage.removeItem("movieInfo");

//   // // remove the movie displayed when clicked
//   // const myDiv = document.getElementById("myDiv");
//   // const parent = myDiv.parentNode;
//   // parent.removeChild(myDiv);
//   // console.log("removedd");
// }

function deleteItems() {
  localStorage.removeItem("movieInfo");

  const myDiv = document.getElementById("myDiv");
  const parent = myDiv.parentNode;
  parent.removeChild(myDiv);
  console.log("Movie has been removedd");
}

// Try to fix this
// document
//   .querySelector(".inventory")
//   .addEventListener("click", resultsDelegation);

// Execute this code based on user click
submitButton.addEventListener("click", function (event) {
  event.preventDefault();

  myApp.movieArray = [];

  const yearChoice = document.querySelector("#movieYear");
  const scoreChoice = document.querySelector("#movieScore");

  myApp.getNewArray(yearChoice.value, scoreChoice.value);

  //Stretch goals
  // Like button and favourite's list using localStorage
  // Fix CSS
  // Cleanup code
  // Store if and array statements into a function
  // Use a drawer to save our favourite's list
  // Card flip animation-
});

myApp.init();

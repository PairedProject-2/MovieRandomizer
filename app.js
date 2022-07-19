const myApp = {};

myApp.key = "ca2c13c7d22715aaa9867db7666b846d";
myApp.url =
    " https://api.themoviedb.org/3/discover/movie?api_key=ca2c13c7d22715aaa9867db7666b846d&language=en-US&sort_by=vote_average.asc&include_adult=false&page=2&include_video=false&release_date.gte=2000&vote_count.gte=1500&with_watch_monetization_types=flatrate&providers";
myApp.init = () => {};
const submitButton = document.querySelector(".submitButton");

//  Create a loop to loop through the pages based on userclick and push the object into a new array
myApp.getNewArray = (year, movieRating) => {
    console.log("fetch is running");

    // Fetch on movieRating
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

    // Fetch on movieYear
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

    // Last fetch call
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
            document.querySelector(".inventory").innerHTML = "";

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
        const userInput = item.options[item.selectedIndex].value; //We need the value, not the text
        myApp.results.push(userInput);
        console.log(userInput);
    }
}

// array randomizer
myApp.movieRandomizer = (array) => {
    console.log("randomizer is running");

    return array.sort(() => 0.5 - Math.random());
};

myApp.getProviders = function (providers, listEl) {
    //   //create a div, give it a class name
    const providerContainer = document.createElement("div");
    const providerLink = document.createElement("a");
    const errorMessage = document.createElement("p");

    errorMessage.className = "errorMessage";
    if (providers) {
        providerLink.innerText = `Where to Watch`;
        providerLink.setAttribute("href", providers.link);

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
    array.forEach((arrayItem) => {
        const listEl = document.createElement("li");
        const imgEl = document.createElement("img");
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
    <img src= "https://image.tmdb.org/t/p/w500${arrayItem.poster_path}"/>
    </div>
    <button class="likeButton"><i class="fa-solid fa-heart-circle-plus"></i></button>
    </div>
    `;

        imgGrid.appendChild(listEl);
    });
};

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
    // Card flip animation
    //
});

myApp.init();

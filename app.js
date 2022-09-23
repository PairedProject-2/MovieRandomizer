const myApp = {};

myApp.key = "ca2c13c7d22715aaa9867db7666b846d";
myApp.inventoryElement = document.querySelector(".inventory");

myApp.init = () => {
    myApp.showList();
    myApp.checkFavList();
};
const submitButton = document.querySelector(".submitButton");
const favouriteButton = document.querySelectorAll(".getFavouritesList");

//  3 fetches to obtain 60 movie objects for array
myApp.getNewArray = (year, movieRating) => {
    // 1st fetch
    fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=ca2c13c7d22715aaa9867db7666b846d&language=en-US&sort_by=vote_average.${movieRating}&include_adult=false&page=1&include_video=false&${year}&vote_count.gte=1250&with_watch_monetization_types=flatrate&providers`
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
        `https://api.themoviedb.org/3/discover/movie?api_key=ca2c13c7d22715aaa9867db7666b846d&language=en-US&sort_by=vote_average.${movieRating}&include_adult=false&page=2&include_video=false&${year}&vote_count.gte=1250&with_watch_monetization_types=flatrate&providers`
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
        `https://api.themoviedb.org/3/discover/movie?api_key=ca2c13c7d22715aaa9867db7666b846d&language=en-US&sort_by=vote_average.${movieRating}&include_adult=false&page=3&include_video=false&${year}&vote_count.gte=1250&with_watch_monetization_types=flatrate&providers`
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

            myApp.movieArrayDecisive = myApp
                .movieRandomizer(myApp.movieArray)
                .splice(0, 10);

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
myApp.getSelectedItems = function () {
    const items = document.getElementsByClassName("selectVal");

    myApp.results = [];

    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const userInput = item.options[item.selectedIndex].value;
        myApp.results.push(userInput);
    }
};

// array randomizer
myApp.movieRandomizer = (array) => {
    return array.sort(() => 0.5 - Math.random());
};

//function to obtain streaming providers link for individual movie
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
        errorMessage.innerText = `Not available for streaming in Canada`;
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
        // const movieSummary = arrayItem.overview.split(",");
        // const newMovieSummary = movieSummary.join("+");

        listEl.innerHTML = `
          <div class="card">
            <div class="moviePoster">
              <img 
              src= "https://image.tmdb.org/t/p/w500${arrayItem.poster_path}"
              alt = "a poster of the movie ${arrayItem.title}"
              title = "${arrayItem.title}"
              
              />
              <div class="content">
              <p>${arrayItem.overview}</p>
            </div>
            </div>
            
            <button class="likeButton">
              <i class="fa-solid fa-heart-circle-plus"></i>
            </button>
            <p class="voteAverage">${arrayItem.vote_average}</p>
          </div>
          `;
        console.log(arrayItem.overview);
        imgGrid.appendChild(listEl);
    });
    myApp.checkForDuplicates();
};

// Execute this code based on user click
submitButton.addEventListener("click", function (event) {
    event.preventDefault();

    myApp.movieArray = [];

    const yearChoice = document.querySelector("#movieYear");
    const scoreChoice = document.querySelector("#movieScore");

    myApp.getNewArray(yearChoice.value, scoreChoice.value);
});

myApp.inventoryElement //querying ul list that will contain movie cards
    .addEventListener("click", function (event) {
        const linkToProvider =
            event.target.offsetParent.offsetParent.nextElementSibling.firstChild
                .href;
        const movieTitle =
            event.target.offsetParent.previousElementSibling.firstElementChild
                .title;
        let localItems = JSON.parse(localStorage.getItem("localItem"));
        if (localItems === null) {
            favouritesList = []; //creation of favouritesList array and set it
        } else {
            // equal to items in local storage
            favouritesList = localItems;
        }

        favouritesList.push({ movieTitle, linkToProvider });
        localStorage.setItem("localItem", JSON.stringify(favouritesList));
        myApp.showList(); //function to display items on page

        myApp.checkForDuplicates(); //function that loops over localStorage array and
        //checks if movie linked to fav button.
        //Disables button and sets class to 'liked'
    });

myApp.showList = function () {
    let output = "";
    let favouritesListHtml = document.querySelector(".favouritesList");
    let localItems = JSON.parse(localStorage.getItem("localItem"));
    if (localItems === null) {
        favouritesList = [];
    } else {
        favouritesList = localItems;
    }

    favouritesList.forEach((listItem, index) => {
        if (listItem.linkToProvider) {
            output += `
        <li>
        <a href = "${listItem.linkToProvider}" target = "_blank">${listItem.movieTitle}</a>
        <button class="deleteMovie" onClick="deleteMovie(${index})"><i class="fa-solid fa-trash-can"></i></button>
        </li>
        `;
            favouritesListHtml.innerHTML = output;
        } else {
            const searchTerm = listItem.movieTitle.split(" ");
            const newSearchTerm = searchTerm.join("+"); //if no provider link, split movie
            //title and inject into IMDB search endpoint
            output += `                                 
            <li>
            <a href = "https://www.imdb.com/find?q=${newSearchTerm}" target = "_blank">${listItem.movieTitle}</a>
            <button class="deleteMovie" onClick="deleteMovie(${index})"><i class="fa-solid fa-trash-can"></i></button>
            </li>
            `;
            favouritesListHtml.innerHTML = output;
        }
    });
};

function deleteMovie(index) {
    let favouritesListShow = document.querySelector(".favouritesList");
    favouritesList.splice(index, 1);
    localStorage.setItem("localItem", JSON.stringify(favouritesList));
    if (favouritesList.length === 0) {
        favouritesListShow.innerHTML = "";
    }
    myApp.showList(); //re-render favourites list
    myApp.checkFavList(); //reverses "liked" class and disabled on button if movie is removed
    //from favourites list
}

myApp.checkForDuplicates = function () {
    const buttonArray = document.querySelectorAll(".likeButton");
    let localItems = JSON.parse(localStorage.getItem("localItem"));
    for (let i = 0; i < buttonArray.length; i++) {
        let currentButton = buttonArray[i];
        for (let i = 0; i < localItems.length; i++) {
            if (
                currentButton.offsetParent.firstElementChild.firstElementChild
                    .title === localItems[i].movieTitle
            ) {
                currentButton.setAttribute("disabled", "");
                currentButton.classList.add("liked");
            }
        }
        //loops over button array and then the localStorage array. If the name of the movie
        //attached to the button is equal to a movie in local Storage, set the button to
        //disabled and add 'liked' class to button
    }

    myApp.checkFavList(); //re-checks buttons to make sure that fav list and like buttons are in sync
};

myApp.checkFavList = function () {
    const buttonArray = document.querySelectorAll(".likeButton");
    let localItems = JSON.parse(localStorage.getItem("localItem"));
    const mainList = []; //an array that reflects the movies stored in local storage
    localItems.forEach((item) => {
        mainList.push(item.movieTitle);
    });

    for (let i = 0; i < buttonArray.length; i++) {
        let currentButton = buttonArray[i];
        //loops over buttons and if the movie attached to the button is not on the main list
        //remove the liked class and disabled attribute from button
        if (
            currentButton.classList.contains("liked") &&
            !mainList.includes(
                currentButton.offsetParent.firstElementChild.firstElementChild
                    .title
            )
        ) {
            currentButton.classList.toggle("liked");
            currentButton.removeAttribute("disabled");
        }
    }
};

//query's all the "fav list" buttons and gives them function to show or hide list
favouriteButton.forEach((button) => {
    button.addEventListener("click", function (event) {
        event.preventDefault();
        const listElement = document.querySelectorAll(".favourites");

        if (!listElement[0].classList.contains("show")) {
            listElement[0].classList.toggle("show");
            location.href = "#favourites";
        } else {
            listElement[0].classList.toggle("show");
            location.href = "#main";
        }
    });
});

myApp.init();

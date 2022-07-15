const myApp = {};

myApp.key = "ca2c13c7d22715aaa9867db7666b846d";
myApp.url =
    " https://api.themoviedb.org/3/discover/movie?api_key=ca2c13c7d22715aaa9867db7666b846d&language=en-US&sort_by=vote_average.asc&include_adult=false&page=2&include_video=false&release_date.gte=2000&vote_count.gte=3000&with_watch_monetization_types=flatrate";
myApp.init = () => {};

//  Create a loop to loop through the pages based on userclick and push the object into a new array
myApp.getNewArray = (year, movieRating) => {
    for (let i = 1; i < 4; i++) {
        fetch(
            `https://api.themoviedb.org/3/discover/movie?api_key=ca2c13c7d22715aaa9867db7666b846d&language=en-US&sort_by=vote_average.${movieRating}&include_adult=false&page=${i}&include_video=false&${year}&vote_count.gte=3000&with_watch_monetization_types=flatrate`
        )
            .then((results) => {
                return results.json();
            })
            .then((jsonData) => {
                jsonData.results.forEach((arrayItem) => {
                    myApp.movieArray.push(arrayItem);
                });
                myApp.movieArray = myApp.movieRandomizer(myApp.movieArray);
            });
    }
};
// When the user clicks the submit button
const submitButton = document.querySelector(".submitButton");

// array randomizer
myApp.movieRandomizer = (array) => {
    return array.sort(() => 0.5 - Math.random());
};

// Execute this code based on user click
submitButton.addEventListener("click", function (event) {
    event.preventDefault();
    myApp.movieArray = [];

    const yearChoice = document.querySelector("#movieYear");
    const scoreChoice = document.querySelector("#movieScore");

    myApp.getNewArray(yearChoice.value, scoreChoice.value);
    const listEl = document.createElement("li");
    const imgEl = document.createElement("img");
    const imgGrid = document.querySelector(".grid");
    console.log(myApp.movieArray);

    //PSEUDOCODE
    //grab the value from user selections
    // display the images using the api
    // get the correct amount of images from the array
    // call 3 pages worth from the api
    // create a new array and store the value inside
    // using .map to filter and display the images
    // using this array to randomize the images shown
});

myApp.init();

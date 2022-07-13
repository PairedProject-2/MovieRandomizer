const myApp = {};

myApp.key = "ca2c13c7d22715aaa9867db7666b846d";
myApp.url =
    " https://api.themoviedb.org/3/discover/movie?api_key=ca2c13c7d22715aaa9867db7666b846d&language=en-US&sort_by=vote_average.desc&include_adult=false&include_video=false&release_date.gte=2000&vote_count.gte=3000&with_watch_monetization_types=flatrate";
myApp.init = () => {};

const submitButton = document.querySelector(".submitButton");

submitButton.addEventListener("click", function (event) {
    event.preventDefault();
    const yearChoice = document.querySelector("#movieYear");
    const scoreChoice = document.querySelector("#movieScore");
    console.log(`choice of year: ${yearChoice.value} 
    choice of score = ${scoreChoice.value}
    `);
    const listEl = document.createElement("li");
    const imgEl = document.createElement("img");
    const imgGrid = document.querySelector(".grid");

    //PSEUDOCODE
    //grab the value from user selections
    //
    fetch(myApp.url)
        .then((response) => {
            return response.json();
        })
        .then((jsonData) => {
            const imgUrlTemplate = "https://image.tmdb.org/t/p/w500/";
            console.log(jsonData);
            imgEl.src = `${imgUrlTemplate}${jsonData.results[1].poster_path}`;
            listEl.append(imgEl);
            imgGrid.append(listEl);
        });
});

myApp.init();

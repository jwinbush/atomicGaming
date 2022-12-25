const key = "8fad681bde3344619f61cdf3bb3a898a";

let today,
    threeMonthsAgo,
    nextYear = "";

const InitializeDate = () => {
    // Get Todays Date
    today = new Date().toISOString().slice(0, 10);

    // Calculate Three months ago, so we later can fetch newly released games
    let arrToday = today.split(/[--]/);
    let minusThreeMonths = parseInt(arrToday[1]) - 3;

    if (parseInt(arrToday[2]) > 28) arrToday[2] = parseInt(arrToday[2]) - 3;
    if (minusThreeMonths.toString().length === 1)
        minusThreeMonths = `0${minusThreeMonths}`;

    arrToday[1] = minusThreeMonths;
    threeMonthsAgo = arrToday.join("-");

    // Calculate 12 Months forward, so we later can fetch upcoming games
    arrToday = today.split(/[--]/);
    if (parseInt(arrToday[2]) > 28) arrToday[2] = parseInt(arrToday[2]) - 3;
    const plusOneYear = parseInt(arrToday[0]) + 1;
    arrToday[0] = plusOneYear;
    nextYear = arrToday.join("-");
};

InitializeDate();

const fetchNewGames = async() => {
    try {
        gameList.innerHTML = `<img src="/img/loading.gif" alt="" /`;
        const response = await fetch(
            `https://api.rawg.io/api/games?key=${key}&dates=${threeMonthsAgo},${today}&ordering=-rating`
        );
        const data = await response.json();
        gameList.innerHTML = "";
        fetchGamesList(data);
    } catch (error) {
        console.error(error);
    }
};

const fetchTopGames = async() => {
    try {
        gameList.innerHTML = `<img src="/img/loading.gif" alt="" />`;
        const response = await fetch(
            `https://api.rawg.io/api/games?key=${key}&ordering=-added`
        );
        const data = await response.json();
        gameList.innerHTML = "";
        fetchGamesList(data);
    } catch (error) {
        console.error(error);
    }
};

const fetchUpcomingGames = async() => {
    try {
        gameList.innerHTML = `<img src="/img/loading.gif" alt="" />`;
        const response = await fetch(
            `https://api.rawg.io/api/games?key=${key}&dates=${today},${nextYear}&ordering=-added`
        );
        const data = await response.json();
        gameList.innerHTML = "";
        fetchGamesList(data);
    } catch (error) {
        console.error(error);
    }
};

// // DOM
const buttons = document.querySelectorAll(".btn");
const gameList = document.querySelector(".movie-list");
let movieItem = document.querySelectorAll(".movie-list li");

const handleUpdate = (e) => {
    if (!e.target.classList.contains("selected")) {
        // styling
        gameList.innerHTML = "";
        for (let i = 0; i < buttons.length; i++)
            buttons[i].classList.remove("selected");
        e.target.classList.add("selected");

        // fetch data
        if (e.target.dataset.name === "top-games") {
            fetchTopGames();
        } else if (e.target.dataset.name === "upcoming-games") {
            fetchUpcomingGames();
        } else {
            fetchNewGames();
        }
    }
};

for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", handleUpdate);
}


const fetchGamesList = (data) => {
    const e = data.results; // Each "e" is an object containing information of a game
    for (let i = 0; i < e.length; i++) {
        gameList.innerHTML += `
    
        <div class="box">
            <img src="${e[i].short_screenshots[0].image}" alt="screenshot of game">            
                <div class="box-text">
                    <h2>${e[i].name}</h2>
                    <h3>${e[i].released}</h3>
                    <div class="rating-download ">
                        <div class="rating ">
                            <i class="bx bxs-star "></i>
                            <span>${e[i].rating}</span>
                        </div>
                        <a href="#" class="box-btn "><i class="bx bx-down-arrow-alt "></i></a>
                    </div>
                </div>
        </div>
   
    `;
        movieItem = document.querySelectorAll(".movie-list");
        setTimeout(function() {
            movieItem[i].classList.remove("fade");
        }, 100);
    }
};
fetchNewGames();
fetchTopGames();
fetchUpcomingGames();
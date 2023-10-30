
// to store movies
let movies=[];
let currentPage=1;
async function fetchMovies(page) {
    try {
       const response = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=f531333d637d0c44abc85b3e74db2186&language=en-US&page=${page}`); 
       const result = await response.json();
        movies = result.results;
        console.log("movies", movies);
        renderMovies(movies);
    } catch (error) {
        console.log(error);
    }
}

// fetch movie from localStorage
function getMovieNamesFromLocalStoage() {
    favoriteMovies = JSON.parse(localStorage.getItem("favoriteMovies"));
    return favoriteMovies ===null?[]:favoriteMovies;

}
 
// add movie to localstorage
function addMovieNameToLocalStorage(movie){
    const favMovieNames = getMovieNamesFromLocalStoage();
    localStorage.setItem("favoriteMovies",JSON.stringify([...favMovieNames,movie]))
}
// remove movie from localstorage

function  removeMovieNameFromLocalStorage(movie){
    const favMovieNames = getMovieNamesFromLocalStoage();
    localStorage.setItem("favoriteMovies",JSON.stringify(favMovieNames.filter((movieName)=>movieName!=movie)));
}


// function to display the movies in the html page
const renderMovies =(movies)=>{
    const movieList = document.getElementById("movies-list");
    movieList.innerHTML="";
    movies.map((movie)=>{
       const { poster_path,title,vote_count,vote_average}= movie;
       const listItem=document.createElement("li");
       listItem.className="card";
       let imgSrc =poster_path? `https://image.tmdb.org/t/p/original/${poster_path}`
       :"https://w7.pngwing.com/pngs/116/765/png-transparent-clapperboard-computer-icons-film-movie-poster-angle-text-logo-thumbnail.png"
       listItem.innerHTML+=`<img class="poster" src=${imgSrc} alt=${title}/>
                        <p class="title">${title}</p>
                        <section class="vote-favoriteIcon" >
                            <section class="vote">
                                <p class="vote-count">${vote_count}</p>
                                <p class="vote-average">${vote_average}</p>
                            </section>
                            <i class="favorite-icon fa-regular fa-heart fa-2xl" id="${title}" ></i>
                        </section> `;
           
           const favoriteIconBtn = listItem.querySelector('.favorite-icon');
           favoriteIconBtn.addEventListener('click',(event)=>{
            const {id} = event.target;
            console.log('id of the movie', id);
            if(favoriteIconBtn.classList.contains("fa-solid")){
                removeMovieNameFromLocalStorage(id)
                favoriteIconBtn.classList.remove("fa-solid")
            }
            else {
                 addMovieNameToLocalStorage(id)
                favoriteIconBtn.classList.add("fa-solid")
            }

           })            
          movieList.appendChild(listItem);              
    });
};
// logic to sort by date
// for checking if the sort by date button clicking first time or not
let firstSortByDateClick = true;
 const sortByDateButton = document.getElementById("sort-by-date");
function sortByDate(){
    let sortedMovies;
    if(firstSortByDateClick){
        sortedMovies = movies.sort((a,b)=> new Date(a.release_date)- new Date(b.release_date));
        sortByDateButton.textContent ="Sort by date (latest to oldest)";
        firstSortByDateClick = false;
    }
    else if(!firstSortByDateClick){
        sortedMovies = movies.sort((a,b)=> new Date(b.release_date)- new Date(a.release_date));
        sortByDateButton.textContent ="Sort by date (oldest to latest)";
        firstSortByDateClick = true;
    }
    renderMovies(sortedMovies);
}
// for sorting the rating 
let firstSortByRatingClick = true;
const sortByRatingButton = document.getElementById("sort-by-rating");

function sortByRating(){
    let sortedMovies;
    if(firstSortByRatingClick){
        sortedMovies = movies.sort((a,b)=> a.vote_average- b.vote_average);
        sortByRatingButton.textContent ="Sort by rating (most to least)";
        firstSortByRatingClick = false;
    }
    else if(!firstSortByDateClick){
        sortedMovies = movies.sort((a,b)=> b.vote_average- a.vote_average);
        sortByRatingButton.textContent ="Sort by  rating (least to most)";
        firstSortByRatingClick = true;
    }
    renderMovies(sortedMovies);
}


sortByDateButton.addEventListener("click",sortByDate);
sortByRatingButton.addEventListener("click",sortByRating);

const prevButton = document.querySelector("button#prev-button");
const PageNumberButton = document.querySelector("button#page-number-button");
const nextButton = document.querySelector("button#next-button");

prevButton.disabled= true;

prevButton.addEventListener('click',()=>{
    currentPage--;
    fetchMovies(currentPage);
    PageNumberButton.textContent= `Current Page: ${currentPage}`;
    if(currentPage==1){
        prevButton.disabled=true;
        nextButton.disabled=false;
    }  else if(currentPage==2){
        prevButton.disabled=false;
        nextButton.disabled=false;
    }

})

nextButton.addEventListener('click',()=>{
    currentPage++;
    fetchMovies(currentPage);
    PageNumberButton.textContent= `Current Page: ${currentPage}`

    if(currentPage==445){
        prevButton.disabled=false;
        nextButton.disabled=true;
    }  else if(currentPage==1){
        prevButton.disabled=true;
        nextButton.disabled=false;

    }
     
    else{
        prevButton.disabled=false;
        nextButton.disabled=false;
    }
})

fetchMovies(currentPage);

// to store movies
let movies=[];
let currentPage=1;
async function fetchMovies(page) {
    try {
       const response = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=f531333d637d0c44abc85b3e74db2186&language=en-US&page=${page}`); 
       const result = await response.json();
        movies = result.results;
        renderMovies(movies);
    } catch (error) {
        console.log(error);
    }
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
                            <i class="fa-regular fa-heart fa-2xl" id="favorite-icon"></i>
                        </section> `;
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

sortByDateButton.addEventListener("click",sortByDate);
fetchMovies(currentPage);
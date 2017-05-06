/**
 * Created by Mati on 2017-05-02.
 */
//api-key v3: 9f85caf9509b78649e71794938765dcf
//api-key v4auth: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5Zjg1Y2FmOTUwOWI3ODY0OWU3MTc5NDkzODc2NWRjZiIsInN1YiI6IjU5MDhhODA2OTI1MTQxNjQ0YTAwZjZhMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.hhsYqDVJ0Lt7Ow9q6rI9h4HkHP2e11BbDiTHwxYnuuQ

//example that works: https://api.themoviedb.org/3/movie/550?api_key=9f85caf9509b78649e71794938765dcf

var configuration;
var posterSize = 1; // [0-6]
var animationSpeed = 500; //ms


searchURL =
    "http://api.themoviedb.org/3" +
    "/search/movie"+
    "?api_key=9f85caf9509b78649e71794938765dcf"+
    "&language=pl"+
    "&callback=?";





var sortMovies = function(){

    var list = $('.movie-container > div').clone();
    $('.movie-container').empty();

    list.sort(function(a, b){
        var aa = a.children[0].children[0].innerHTML; //title a
        var bb = b.children[0].children[0].innerHTML; //title b

        return aa.localeCompare(bb);
    });

    for (var i=0; i<list.length; i++)
        $('.movie-container').append(list[i]);
    $('.movie-btn').on("click",moreInfo);
}




var displayMoreInfo = function(movie){

    $('.sidebar-description').css("display","block");
    $('.sidebar-category').css("display","block");
    $('.sidebar-imbd-container').css("display","block");
    $('.sidebar-companies').css("display","block");
    $('.sidebar-countries').css("display","block");


    if (movie.poster_path != null)
        var posterUrl = configuration.images.base_url+configuration.images.poster_sizes[posterSize+2]+movie.poster_path;
    else
        var posterUrl = "img/poster.jpg";



    $('.sidebar-poster').attr("src", posterUrl);

    $('.sidebar-title').html(movie.title);

    if (movie.overview != null)
        $('.sidebar-description').html(movie.overview);
    else
        $('.sidebar-description').css("display","none");


    var category = "";
    if (movie.genres.length == 0){
        $('.sidebar-category').css("display","none");
    }
    else{

        for (var i=0; i<movie.genres.length; i++){
            category+= " "+ movie.genres[i]['name'];
            if (i!= movie.genres.length-1)
                category+=", ";
        }
        $('.sidebar-category').html("<strong>gatunek: </strong>"+category);
    }





    $('.sidebar-imbd').attr("href", "http://www.imdb.com/title/"+movie.imdb_id+"/");

    var companies = movie.production_companies;

    if (companies.length == 0){
        $('.sidebar-companies').css("display","none");
    }else{
        var companiesString = "";
        for (var i=0; i<companies.length; i++){
            companiesString +=  companies[i].name;
            if (i!= companies.length-1)
                companiesString +=", ";
        }
        $('.sidebar-companies').html("<strong>Wytwórnia: </strong>"+companiesString);
    }



    var countries = movie.production_countries;
    var countriesString = "";
    for (var i=0; i<countries.length; i++){
        countriesString +=  countries[i].name;
        if (i!= countries.length-1)
            countriesString +=", ";
    }
    $('.sidebar-countries').html("<strong>kraj powstania: </strong>"+countriesString);



};





var hideSideBar = function(){

    $('#movies').unbind();

    $( "#sidebar" ).animate({
        width: "0",
    }, animationSpeed, function() {
        // Animation complete.
    });
}


var displaySideBar = function(data){
    displayMoreInfo(data);
    $( "#sidebar" ).animate({
        width: "90%",
    }, animationSpeed, function() {
        $('#movies').on("click",hideSideBar);

    });

};




var moreInfo = function(){

    $.getJSON("https://api.themoviedb.org/3/movie/"+this.value+"?api_key=9f85caf9509b78649e71794938765dcf&language=pl&callback=?", {
        format: "json"
    }).done(function( data ) {
        displaySideBar(data);
    });

    

};


var createDOM = function(movie){

    var parent = document.getElementsByClassName("movie-container")[0];


    var wrapper = document.createElement("div");
    wrapper.className="col-md-6";

    var div = document.createElement("div");
    div.className = "movie";

    var title = document.createElement("p");
    title.className="movie-title";
    title.innerHTML = movie.title;


    if (movie.poster_path != null)
        var posterUrl = configuration.images.base_url+configuration.images.poster_sizes[posterSize]+movie.poster_path;
    else
        var posterUrl = "img/poster.jpg";

    var poster = document.createElement("img");
    poster.src = posterUrl;
    poster.className = "movie-poster";

    //description

    var description = document.createElement("div");
    description.className = "movie-description";

    var pubDate = document.createElement("p");
    pubDate.className="movie-date";
    pubDate.title="data premiery";
    if (movie.release_date != "")
        pubDate.innerHTML = movie.release_date.split('-').reverse().join('.') + "r.";

    var popular = document.createElement("p");
    popular.className="movie-popularity";
    popular.title="popularność";
    popular.innerHTML = '<strong><i class="fa fa-star" aria-hidden="true"></i></strong>';
    popular.innerHTML += movie.popularity;


    var average = document.createElement("div");
    average.className="movie-average";
    average.innerHTML = '<p>'+movie.vote_average+'</p>';

    if(movie.vote_average > 7){
        average.className+=" high-mark";
    }else if(movie.vote_average > 4){
        average.className+=" medium-mark";
    }
    else{
        average.className+=" low-mark";
    }

    var count = document.createElement("p");
    count.className="movie-count";
    var word = "";
    switch(movie.vote_count){
        case 1:
            word = " głos";
            break;
        case 2:
        case 3:
        case 4:
            word = " głosy";
            break;
        default:
            word = " głosów";
            break;
    }
    count.innerHTML += movie.vote_count + word;




    description.appendChild(average);
    description.appendChild(count);
    description.appendChild(popular);
    description.appendChild(pubDate);



    var button = document.createElement("button");
    button.value = movie.id;
    button.className = "btn movie-btn";
    button.innerHTML = "Więcej";





    div.appendChild(title);
    div.appendChild(poster);
    div.appendChild(description);
    div.appendChild(button);
    wrapper.appendChild(div);
    parent.appendChild(wrapper);

}


var showData = function(data){

    var numOfMovies = data.results.length;

    $('.movie-container').empty();

    for(var i=0; i<numOfMovies; i++){
        createDOM(data.results[i]);
    }
    $('.movie-btn').on("click",moreInfo);
}







var search = function(){
    hideSideBar();
    var query = "&query=";
    var search = $('#input').val().split(' ').join('+');
    query+= search;

    $.getJSON( (searchURL+query), {
        format: "json"
    }).done(function( data ) {
        showData(data);
    });
};



$(document).ready(function(){


        $.getJSON("https://api.themoviedb.org/3/configuration?api_key=9f85caf9509b78649e71794938765dcf&callback=?", {
            format: "json"
        }).done(function( data ) {
            configuration = data;
        });

    $('#btn-search').on("click",search);

    $("#input").keyup(function(event){
        if(event.keyCode == 13){
            $("#btn-search").click();
        }
    });

    $('#sort').on("click", sortMovies);


});






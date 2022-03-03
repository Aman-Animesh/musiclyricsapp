'use strict'


const button  = document.querySelector('#search-button');
const searchInput = document.querySelector('#search-input');
const searchResult  = document.querySelector('#search-results-list');


const searchResultsContainer  = document.querySelector('.results__container');
const searchResultsList  = document.querySelector('#search-results-list');

const lyricsContainer  = document.querySelector('.lyrics__container');
const lyricsLoader  = document.querySelector('#lyrics-loader');
const lyricsResultsContainer  = document.querySelector('#lyrics-results');

const searchLoader  = document.querySelector('#search-results-loader');


const apiURL = "https://api.lyrics.ovh";

function showdata(placeName){
    placeName.classList.add('d-none'); 
}
function hidedata(placeName)
{
    placeName.classList.remove('d-none');
}

  button.addEventListener("click" , (e) => {
    e.preventDefault();
  let searchValue = searchInput.value;
  if(!searchValue){
      alert("Nothing to Search");
  }
  else
  {
      searchingStart(searchValue);
  }
});

async function searchingStart(searchValue)
{
    const searchResult = await fetch(`${apiURL}/suggest/${searchValue}`);    
    const data = await searchResult.json();    
    
    displayLyricsList(data);
    hidedata(searchResultsContainer);
    showdata(searchLoader); 
}


function displayLyricsList(data)
{
    
    searchResult.innerHTML = `${
        data.data.map(song=>`<div class="result__item row d-flex justify-content-center align-items-center text-center text-sm-left">
        <p class="col-10 col-sm-6 mb-0 result__item__title"><strong>${song.artist.name}</strong> - ${song.title}</p>
        <button id="getLyrics" class="col-8 col-sm-3 btn button" data-artist="${song.artist.name}" data-title="${song.title}">Get Lyrics</button>   
        
    </div>`).join('')
    }
    
    `;
}


searchResult.addEventListener('click', e => {
    const clickedElement = e.target;
    if(clickedElement.tagName ==='BUTTON')
    {
        const artist = clickedElement.getAttribute('data-artist');
        const songTitle = clickedElement.getAttribute('data-title');
        
        getLyrics(artist,songTitle);

    }
    
});

async function getLyrics(artist,songTitle){

    const getingLyrics = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);    
    if(getingLyrics.statusText !="OK")
    {
        showdata(searchResultsContainer);
        hidedata(lyricsContainer);
        lyricsResultsContainer.innerHTML=`${
            `<p>Lyrics Not Found </p>`
        }`
        
    }
    else
    {
        const dataLyrics = await getingLyrics.json();
    const lyrics = dataLyrics.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');
    hidedata(lyricsContainer);
    showdata(lyricsLoader);
    showdata(searchResultsContainer);
    displayLyrics(dataLyrics,artist,songTitle);
    }
    
}

function displayLyrics(dataLyrics,artist,songTitle){
    let artistName = artist;
  
        lyricsResultsContainer.innerHTML= `${
            `<h5><Strong id = "artist">${artist}</strong> - ${songTitle}</h5>
            <p>${dataLyrics.lyrics} </p>
            <button class="backButton" onClick="doingBack()">Back</button>
            `
            
           
        }`

    }
    

function doingBack(artist)
{
    const artistName = document.querySelector('#artist').textContent;
    console.log(artistName);
    searchingStart(artistName);
    lyricsContainer.classList.add('d-none');
    
}
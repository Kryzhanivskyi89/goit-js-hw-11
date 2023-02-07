import './css/styles.css';
import Notiflix from 'notiflix';
import  SearchImages from './fetchImages'
const searchImages = new SearchImages();
const refs = {
    searchInput: document.getElementsByName('searchQuery'),
    form: document.querySelector(".search-form"),
    btn: document.getElementsByName("search"),
    galleryList: document.querySelector(".list"),
    loadMoreBtn:document.querySelector(".load-more")
};

refs.form.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch(e) {
    e.preventDefault();
    const form = e.currentTarget;
    searchImages.searchQuery = form.elements.searchQuery.value.trim();
    searchImages.resetPage();
    clearGalleryList(); 
    console.log(searchImages.fetchImages()) 
    try {
        const images = await searchImages.fetchImages(); 
        const markup = images.hits.reduce(
            (markup, images) => createGallery(images) + markup,
            "");
        updateGalleryList(markup);
        loadMoreBtnShow();
    if (form.elements.searchQuery.value === "") {
        onFetchError();
        clearGalleryList();
        loadMoreBtnHide();
        };      
    }catch(error) {
        onFetchError(error);       
        console.log("error");
    }finally{form.reset()};
};

async function onLoadMore() {
    try {
        const images = await searchImages.fetchImages();
        const markup = images.hits.reduce(
            (markup, images) => createGallery(images) + markup,
            "");          
        updateGalleryList(markup);
        // if (searchImages.queryPage = Math.ceil(images.totalHits/40+1)) {
        //     endOfSearchResults();        
        //     loadMoreBtnHide(); 
        //     console.log(searchImages.queryPage)
        // };
    }catch(error) {
        onFetchError(error);
        console.log("error");
    };       
};

function createGallery({ webformatURL, tags, likes, views, comments, downloads}) {     
    return `        
            <li class="list-item">                
                <div class="photo-card">
                    <img class="image"src="${webformatURL}" alt="${tags}" width="250" height="200" loading="lazy" />
                    <div class="info">
                        <p class="info-item">
                        <b>Likes: <span> ${likes}</span></b> 
                        </p>
                        <p class="info-item">
                        <b>Views: <span> ${views}</span></b>
                        </p>
                        <p class="info-item">
                        <b>Comments: <span> ${comments}</span></b>
                        </p>
                        <p class="info-item">
                        <b> Downloads: <span> ${downloads}</span></b>
                        </p>
                    </div>
                </div>    
            </li>        
    `;  
};
function clearGalleryList() {     
    refs.galleryList.innerHTML= "";    
};

function updateGalleryList(markup) {     
    refs.galleryList.insertAdjacentHTML("beforeend", markup);     
};
function loadMoreBtnShow() {
    refs.loadMoreBtn.style.display= "flex";
};
function loadMoreBtnHide() {
    refs.loadMoreBtn.style.display= "none";
};

function onFetchError(error) {
    Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again');
};
function endOfSearchResults() {
    Notiflix.Notify.failure('We are sorry, but you have reached the end of search results');
};


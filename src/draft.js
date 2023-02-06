import './css/styles.css';
import Notiflix from 'notiflix';
import  API from './fetchImages'

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
    const inputValue = form.elements.searchQuery.value;      
    try {
        const images = await API.fetchImages(inputValue);        
        const markup = images.reduce(
            (markup, images) => createGallery(images) + markup,
              "");        
        // createGallery(images);
        updateGalleryList(markup);
        }catch(error) {
        onFetchError(error);
        console.log("error");
        }finally{form.reset()}         
}

function onLoadMore() {
}
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
    console.log(markup)
    refs.galleryList.innerHTML = markup;        
};
function updateGalleryList(markup) {     
    refs.galleryList.innerHTML = markup;    
};

function onFetchError(error) {
    Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again');
};

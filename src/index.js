import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from "notiflix";
import { fetchArticles } from "./news-service";

const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let query = '';
let page = 1;
const perPage = 40;
let simpleLightBox;

searchForm.addEventListener('submit', onSearch);

// Отрисовка страницы //

function renderCards(images) {
    const articles = images
    .map(image => {
        const {
            id,
            webformatURL,
            largeImageURL,
            tags,
            likes,
            views,
            comments,
            downloads,
        } = image;

        return `
        <a class="photo__link" href="${largeImageURL}">
            <div class="photo-card" id="${id}">
                <img class="photo-card__img" src="${webformatURL}" alt="${tags}" loading="lazy" />
                <div class="info">
                    <p class="info-item">
                        <b>Likes: </b>${likes}
                    </p>
                    <p class="info-item">
                        <b>Views: </b>${views}
                    </p>
                    <p class="info-item">
                        <b>Comments: </b>${comments}
                    </p>
                    <p class="info-item">
                        <b>Downloads: </b>${downloads}
                    </p>
                </div>
            </div>
        </a>
      `
    })
    .join('');

    gallery.insertAdjacentHTML('beforeend', articles);

    // Прокручивание страницы //

    const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

    window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
    });
}

// Настройка запроса //

function onSearch(e) {
    e.preventDefault();

    page = 1;
    query = e.currentTarget.elements.searchQuery.value;
    gallery.innerHTML = '';

    if (query === '') {
        Notiflix.Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
    }

    fetchArticles(query, page, perPage)
        .then(data => {
            if (data.totalHits === 0) {
                Notiflix.Notify.failure(
                    'Sorry, there are no images matching your search query. Please try again.'
                );
            } else {
                renderCards(data.hits);
                simpleLightBox = new SimpleLightbox('.gallery a').refresh();
                Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
            }
        })
        .catch(error => console.log(error))
        .finally(() => {
            searchForm.reset();
        });

    return nextPage();
}

// Загрузка страницы //

loadMoreBtn.addEventListener('click', () => {

        fetchArticles(query, page, perPage)
        .then(data => {
            renderCards(data.hits);
            simpleLightBox = new SimpleLightbox('.gallery a').refresh();
            page += 1;
            simpleLightBox.refresh();
        
        const allPages = Math.ceil(data.totalHits / perPage);

        if (page > allPages) {
            Notiflix.Notify.failure(`We're sorry, but you've reached the end of search results.`);
        }})
        .catch(error => console.log(error));
});
    
function nextPage() {
    loadMoreBtn.classList.add("is-visible");
    page += 1;
}


/*loadMoreBtn.addEventListener('click', onloadMore);
function onloadMore(
    fetchArticles(query, page, perPage)
        .then(data => {
            renderCards(data.hits);
            simpleLightBox = new SimpleLightbox('.gallery a').refresh();
            page += 1;
            simpleLightBox.refresh();
        
        const allPages = Math.ceil(data.totalHits / perPage);

        if (page > allPages) {
            Notiflix.Notify.failure(`We're sorry, but you've reached the end of search results.`);
        }})
        .catch(error => console.log(error));
);*/
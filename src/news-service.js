import axios, { all } from "axios";
import { API_KEY } from "./api-key";
import Notiflix from "notiflix";

// Перехват ответа //

axios.defaults.baseURL = 'https://pixabay.com/api/';
axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        Notiflix.Notify.failure('Error!');
        return Promise.reject(error);
    },
);

// Настройка запроса //

export { fetchArticles };

async function fetchArticles(query, page, perPage) {
    const response = await axios.get(
        `?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`,
    );
    return response.data;
}
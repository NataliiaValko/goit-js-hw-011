import axios from 'axios';

export default class NewApiPixabay {
  #BASE_URL = 'https://pixabay.com/api/';
  #KEY = '31000801-179358ed9db1a9fc0904af43d';
  constructor() {
    this.valueForSearch = '';
    this.numberPage = 1;
    this.perPage = 40;
  }

  fetchGallery() {
    return axios.get(`${this.#BASE_URL}`, {
      params: {
        key: this.#KEY,
        q: this.valueForSearch,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: this.perPage,
        page: this.numberPage,
      },
    });
  }

  get ValueForSearch() {
    return this.valueForSearch;
  }

  set ValueForSearch(value) {
    this.valueForSearch = value;
  }

  incrementPage() {
    this.numberPage += 1;
  }

  resetPage() {
    this.numberPage = 1;
  }
}

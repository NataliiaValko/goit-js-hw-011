import axios from 'axios';

export default class NewApiPixabay {
  #BASE_URL = 'https://pixabay.com/api/';
  #KEY = '31000801-179358ed9db1a9fc0904af43d';
  constructor() {
    this.valueForSearch = '';
    this.numberPage = '1';
    // this.image_type = 'photo';
    // this.no_more_response = false;
  }

  fetchGallery() {
    return axios.get(`${this.#BASE_URL}`, {
      params: {
        key: this.#KEY,
        q: this.valueForSearch,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 40,
        page: this.numberPage,
      },
    });
  }

  // async fetchGallery() {
  //   try {
  //     const response = await fetch(this.getURLRequest());
  //     const responseObject = await response.json();
  //     const array = await responseObject.hits;
  //     return this.makesValidationArray(array);
  //   } catch {
  //     pnotifyErrorResponse();
  //   }
  // }

  get ValueForSearch() {
    return this.valueForSearch;
  }

  set ValueForSearch(value) {
    this.valueForSearch = value;
  }

  // makesValidationArray(array) {
  //   if (array.length === 0 && this.numberPage === 1) {
  //     pnotifyInvalidResponse();
  //     this.no_more_response = true;
  //   }

  //   if (array.length === 0 && this.numberPage > 1) {
  //     pnotifyNoMoreResponse();
  //     this.no_more_response = true;
  //   }

  //   this.incrementPage();
  //   return array;
  // }

  incrementPage() {
    this.numberPage += 1;
  }

  resetPage() {
    this.numberPage = 1;
  }
}

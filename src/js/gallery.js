import Notiflix from 'notiflix';
import NewApiPixabay from './apiPixabay';
import { getNewSimpleLightbox } from './simplelightbox';
// import axios from 'axios';

const refs = {
  form: document.querySelector('#search-form'),
  input: document.querySelector('.search-form__input'),
  btnClose: document.querySelector('.search-form__button'),
  gallery: document.querySelector('.gallery__list'),
  // btnLoadMore: document.querySelector('.load-more'),
};

const newApiPixabay = new NewApiPixabay();

const getValidateArray = array => {
  return array.map(
    ({
      webformatURL,
      largeImageURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    }) => {
      return {
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      };
    }
  );
};

const makeMarkup = (array, target) => {
  const markup = array
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<li class="gallery__item gallery">
      <a class="gallery__link" href="${largeImageURL}">
      <img class="gallery__img" src="${webformatURL}" alt="${tags}" loading="lazy" width=400/>
      </a>
      <div class="gallery__info">
      <ul class="gallery__details-list"><li class="gallery__details-item"><p class="gallery__details">
          <b>Likes</b>
          ${likes}
        </p></li>
        <li class="gallery__details-item"><p class="gallery__details">
          <b>Views</b>
          ${views}
        </p></li>
        <li class="gallery__details-item"><p class="gallery__details">
          <b>Comments</b>
          ${comments}
        </p></li>
        <li class="gallery__details-item"><p class="gallery__details">
          <b>Downloads</b>
          ${downloads}
        </p></li></ul>

      </div>
    </li>`
    )
    .join('');
  return target.insertAdjacentHTML('beforeend', markup);
};

const onSubmit = async e => {
  e.preventDefault();
  refs.gallery.innerHTML = '';

  newApiPixabay.valueForSearch = e.currentTarget.elements.searchQuery.value;
  newApiPixabay.resetPage();

  try {
    const { data } = await newApiPixabay.fetchGallery();

    let totalPages = Math.ceil(data.totalHits / data.hits.length) || null;

    if (data.totalHits === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      // refs.btnLoadMore.style.display = 'none';
    } else if (newApiPixabay.numberPage === totalPages) {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      // refs.btnLoadMore.style.display = 'none';
      makeMarkup(getValidateArray(data.hits), refs.gallery);
      getNewSimpleLightbox();
      lightbox.refresh();
    } else {
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
      makeMarkup(getValidateArray(data.hits), refs.gallery);
      getNewSimpleLightbox();
      lightbox.refresh();
      // refs.btnLoadMore.style.display = 'none';
      // refs.btnLoadMore.style.display = 'block';
      // const { height: cardHeight } = document
      //   .querySelector('.container--gallery')
      //   .firstElementChild.getBoundingClientRect();
    }
  } catch (err) {
    console.log(err);
  }

  newApiPixabay.incrementPage();
};

refs.form.addEventListener('submit', onSubmit);

import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import NewApiPixabay from './apiPixabay';
// import axios from 'axios';

const refs = {
  form: document.querySelector('#search-form'),
  input: document.querySelector('.search-form__input'),
  btnClose: document.querySelector('.search-form__button'),
  targetObserver: document.querySelector('.target-element'),
  gallery: document.querySelector('.gallery__list'),
  btnLoadMore: document.querySelector('.load-more'),
};

const lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
  captionsData: 'alt',
});

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

const scrollPage = () => {
  const { height: cardHeight } =
    refs.gallery.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
};

const onSubmit = async e => {
  e.preventDefault();
  refs.btnLoadMore.style.display = 'none';

  if (newApiPixabay.valueForSearch !== refs.input.value) {
    newApiPixabay.resetPage();
    refs.gallery.innerHTML = '';
  }

  newApiPixabay.valueForSearch =
    newApiPixabay.valueForSearch === refs.input.value
      ? newApiPixabay.valueForSearch
      : refs.input.value;

  try {
    const { data } = await newApiPixabay.fetchGallery();

    let totalPages = Math.ceil(data.totalHits / data.hits.length) || null;

    if (data.totalHits === 0) {
      refs.gallery.innerHTML = '';
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      refs.btnLoadMore.style.display = 'none';
      newApiPixabay.resetPage();
    } else if (newApiPixabay.numberPage === totalPages) {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      makeMarkup(getValidateArray(data.hits), refs.gallery);
      lightbox.refresh();
      refs.btnLoadMore.style.display = 'none';
      newApiPixabay.resetPage();

      scrollPage();
    } else {
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
      makeMarkup(getValidateArray(data.hits), refs.gallery);
      lightbox.refresh();
      refs.btnLoadMore.style.display = 'flex';
      newApiPixabay.incrementPage();

      scrollPage();
    }
  } catch (err) {
    console.log(err);
  }
};

refs.form.addEventListener('submit', onSubmit);
refs.btnLoadMore.addEventListener('click', onSubmit);

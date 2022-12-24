import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import NewApiPixabay from './apiPixabay';

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

// const scrollPage = () => {
//   const { height: cardHeight } =
//     refs.gallery.firstElementChild.getBoundingClientRect();
//   window.scrollBy({
//     top: cardHeight * 2,
//     behavior: 'smooth',
//   });
// };

const onSubmit = async e => {
  e.preventDefault();
  if (refs.input.value.trim() === '') {
    return;
  }

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
    const {
      data: { totalHits, hits },
    } = await newApiPixabay.fetchGallery();

    let totalPages = Math.ceil(totalHits / hits.length) || null;

    console.log('subm');
    if (totalHits === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else if (newApiPixabay.numberPage === totalPages) {
      Notify.info("We're sorry, but you've reached the end of search results.");
      makeMarkup(getValidateArray(hits), refs.gallery);
      lightbox.refresh();
    } else {
      makeMarkup(getValidateArray(hits), refs.gallery);
      lightbox.refresh();
      if (newApiPixabay.numberPage === 1) {
        Notify.success(`Hooray! We found ${totalHits} images.`);
      }

      newApiPixabay.incrementPage();
      intersectionObserver.observe(refs.targetObserver);
    }
  } catch (err) {
    console.log(err);
  }
};

refs.form.addEventListener('submit', onSubmit);

const intersectionObserverOptions = {
  root: null,
  rootMargin: '0px 0px 200px 0px',
  threshold: 1.0,
};

const intersectionObserver = new IntersectionObserver((enteries, observe) => {
  enteries.forEach(async entry => {
    if (!entry.isIntersecting || newApiPixabay.numberPage === 1) {
      return;
    }
    try {
      const {
        data: { totalHits, hits },
      } = await newApiPixabay.fetchGallery();
      console.log('scr');
      let totalPages = Math.ceil(totalHits / newApiPixabay.perPage) || null;

      if (newApiPixabay.numberPage === totalPages) {
        Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
        makeMarkup(getValidateArray(hits), refs.gallery);
        lightbox.refresh();
        newApiPixabay.resetPage();
        intersectionObserver.unobserve(refs.targetObserver);
      } else {
        makeMarkup(getValidateArray(hits), refs.gallery);
        lightbox.refresh();
        newApiPixabay.incrementPage();
      }
    } catch (err) {
      console.log(err);
    }
  });
}, intersectionObserverOptions);

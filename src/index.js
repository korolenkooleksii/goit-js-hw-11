import Notiflix from 'notiflix';
import SearchApiImages from './SearchApiImages.js';

const form = document.querySelector('.search-form');
const searchBtn = document.querySelector('[type="submit"]');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

const searchApiImages = new SearchApiImages();

form.addEventListener('submit', searchImg);
loadMoreBtn.addEventListener('click', loadMore);

function searchImg(e) {
  e.preventDefault();

  const form = e.currentTarget;
  const value = form.elements.search.value.trim();

  searchApiImages.searchQuery = value;

  searchApiImages
    .getImages(value)
    .then(hits => {
      if (hits.length === 0) {
        Notiflix.Notify.info(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }

      if (searchApiImages.page === 1) {
        Notiflix.Notify.success(
          `Hooray! We found ${searchApiImages.totalHits} images.`
        );
      }

      createImagesCollection(hits);
    })
    .catch(errorShow)
    .finally(resetForm);
}

function loadMore() {
  searchApiImages
    .getImages(searchApiImages.searchQuery)
    .then(hits => {
      if (hits.length === 0) {
        Notiflix.Notify.info(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }

      if (searchApiImages.page === 1) {
        Notiflix.Notify.success(
          `Hooray! We found ${searchApiImages.totalHits} images.`
        );
      }

      createImagesCollection(hits);
    })
    .catch(errorShow)
    .finally(resetForm);
}

function createImagesCollection(arr) {
  const markupImagesCollectiom = arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" width="640" height="427" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>${likes}
    </p>
    <p class="info-item">
      <b>Views</b>${views}
    </p>
    <p class="info-item">
      <b>Comments</b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>${downloads}
    </p>
  </div>
</div>`;
      }
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', markupImagesCollectiom);
}

function clearImagesWrapper() {
  imagesWrapper.innerHTML = '';
}

function resetForm() {
  () => form.reset();
};

function errorShow(error) {
  console.error(error);
  Notiflix.Notify.failure(`${error}`);
}

import Notiflix from 'notiflix';
import SearchApiImages from './script/SearchApiImages.js';
import LoadMoreBtn from './script/components/loadMoreBtn.js';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
// const loadMoreBtn = document.querySelector('.load-more');
// т.к. loadMoreBtn это обект (новый экземпляр
// LoadMoreBtn), то вешаем клик на кнопку,
// т.е. loadMoreBtn.button

const searchApiImages = new SearchApiImages();
const loadMoreBtn = new LoadMoreBtn({ selector: '.load-more', isHidden: true });

form.addEventListener('submit', searchImg);
loadMoreBtn.button.addEventListener('click', fetchImages);

function searchImg(e) {
  e.preventDefault();

  const form = e.currentTarget;
  const value = form.elements.search.value.trim();

  searchApiImages.searchQuery = value;

  searchApiImages.resetPage();
  clearImagesCollection();

  loadMoreBtn.show();

  fetchImages().finally(resetForm);
}

function fetchImages() {
  loadMoreBtn.disable();
  return searchApiImages
    .getImages()
    .then(hits => {
      if (hits.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        loadMoreBtn.hide();
        return;
      }

      if (searchApiImages.page === 2) {
        Notiflix.Notify.success(
          `Hooray! We found ${searchApiImages.totalHits} images.`
        );
      }

      createImagesCollection(hits);
    })
    .catch(errorShow);
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
  loadMoreBtn.enable();
}

function clearImagesCollection() {
  gallery.innerHTML = '';
}

function resetForm() {
  () => form.reset();
}

function errorShow(error) {
  console.error(error);
  Notiflix.Notify.failure(`${error}`);
}

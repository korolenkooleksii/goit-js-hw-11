import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
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

let totalPages = null;

const lightbox = new SimpleLightbox('.gallery a');

function searchImg(e) {
  e.preventDefault();

  const form = e.currentTarget;
  const value = form.elements.search.value.trim();

  if (value.length === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  searchApiImages.searchQuery = value;

  searchApiImages.resetPage();
  clearImagesCollection();
  loadMoreBtn.show();
  fetchImages();
  resetForm();
}

async function fetchImages() {
  try {
    loadMoreBtn.disable();
    const hits = await searchApiImages.getImages();

    totalPages = Math.ceil(searchApiImages.totalHits / searchApiImages.perPage);

    if (hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      clearImagesCollection();
      loadMoreBtn.hide();
      return;
    }

    if (searchApiImages.page === 2) {
      Notify.success(`Hooray! We found ${searchApiImages.totalHits} images.`);
    }

    if (searchApiImages.page > totalPages) {
      Notify.info("We're sorry, but you've reached the end of search results.");
      loadMoreBtn.hide();
    }

    createImagesCollection(hits);

    if (searchApiImages.page > 2) scrollTheCollection();

    lightbox.refresh();
  } catch (error) {
    errorShow();
  }
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
  <div class="wrap-photo">
    <a href="${largeImageURL}">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" width="640"
  /></a>
  </div>
  <div class="info">
    <p class="info-item"><b>Likes</b>${likes}</p>
    <p class="info-item"><b>Views</b>${views}</p>
    <p class="info-item"><b>Comments</b>${comments}</p>
    <p class="info-item"><b>Downloads</b>${downloads}</p>
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
  form.reset();
}

function errorShow(error) {
  Notify.failure('Error');
  loadMoreBtn.hide();
  console.error(error.massege);
}

function scrollTheCollection() {
  const { height: cardHeight } =
    gallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

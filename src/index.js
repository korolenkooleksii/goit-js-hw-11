import { Notify } from 'notiflix';
import axios from 'axios';
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

async function fetchImages() {
  loadMoreBtn.disable();

  try {
    const hits = await searchApiImages.getImages()
    console.log("fetchImages  hits", hits)
    
    
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

    createImagesCollection(hits);

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
  Notify.failure('Error');
  loadMoreBtn.hide();
  console.error(error.massege);
  
}

// const KEY = '3551348-9d68666fc5ce894df97e3b30d';
// const ENDPOINT = 'https://pixabay.com/api/';

// function getImages() {
//   const URL = `${ENDPOINT}?key=${KEY}&q=cat&image_type=photo&orientation=horizontal&safesearch=true&per_page=4&page=1`;

//   try {
//     return axios.get(URL).then(response => {
//       console.log(response);
//       console.log(5 + 5);
//       Notify.success(`Hooray!`);
//     });
//   } catch (error) {
//     console.log(error);
//   }
// }

// getImages();

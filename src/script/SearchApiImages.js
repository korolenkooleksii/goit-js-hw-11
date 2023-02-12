const KEY = '33551348-9d68666fc5ce894df97e3b30d';
const ENDPOINT = 'https://pixabay.com/api/';

export default class SearchApiImages {
  constructor() {
    this.page = 1;
    this.searchQuery = '';
    this.totalHits = null;
  }

  getImages() {
    const URL = `${ENDPOINT}?key=${KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=4&page=${this.page}`;

    return fetch(URL).then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }

      return response.json();
    }).then(data => {
      this.totalHits = data.totalHits;
      this.nextPage();
      return data.hits;
    });
  }

  nextPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}

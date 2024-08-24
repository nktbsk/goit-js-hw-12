import { fetchImages } from './js/pixabay-api';
import { renderGallery } from './js/render-functions';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('#load-more');
const loader = document.querySelector('#loader');

let query = '';
let page = 1;

form.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch(event) {
  event.preventDefault();
  query = event.currentTarget.elements.query.value.trim();

  if (!query) {
    iziToast.error({ title: 'Error', message: 'Search query cannot be empty' });
    return;
  }

  try {
    loader.classList.remove('hidden');
    gallery.innerHTML = '';
    page = 1;

    const { hits, totalHits } = await fetchImages(query, page);
    if (hits.length === 0) {
      iziToast.warning({
        title: 'No results',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
      });
      loadMoreBtn.classList.add('hidden');
      return;
    }

    gallery.innerHTML = renderGallery(hits);
    const lightbox = new SimpleLightbox('.gallery a');
    lightbox.refresh();

    if (hits.length < totalHits) {
      loadMoreBtn.classList.remove('hidden');
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong, please try again later',
    });
  } finally {
    loader.classList.add('hidden');
  }
}

async function onLoadMore() {
  page += 1;

  try {
    loader.classList.remove('hidden');
    const { hits, totalHits } = await fetchImages(query, page);

    gallery.insertAdjacentHTML('beforeend', renderGallery(hits));
    const lightbox = new SimpleLightbox('.gallery a');
    lightbox.refresh();

    const galleryItems = document.querySelectorAll('.gallery-item');
    const cardHeight = galleryItems[0].getBoundingClientRect().height;
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });

    if (galleryItems.length >= totalHits) {
      loadMoreBtn.classList.add('hidden');
      iziToast.info({
        title: 'End of results',
        message: "We're sorry, but you've reached the end of search results.",
      });
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong, please try again later',
    });
  } finally {
    loader.classList.add('hidden');
  }
}

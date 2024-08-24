export function renderGallery(images) {
  return images
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
        return `
        <li class="gallery-item">
          <a class="a-img" href="${largeImageURL}">
            <img class="gallery-img" src="${webformatURL}" alt="${tags}" loading="lazy" />
          </a>
          <div class="info">
            <p class="p-likes" >Likes ${likes}</p>
            <p class="p-views" >Views ${views}</p>
            <p class="p-comments" >Comments ${comments}</p>
            <p class="p-downloads" >Downloads ${downloads}</p>
          </div>
        </li>`;
      }
    )
    .join('');
}

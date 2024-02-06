/**
 * Client-side JS logic
 */

$(document).ready(function() {
  const escape = function(str) {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  //ajax requests
  const loadMaps = function() {
    const deferred = $.Deferred();

    $.ajax({
      method: 'GET',
      url: '/maps'
    })
      .done(function(response) {
        deferred.resolve(response);
      })
      .fail(function(error) {
        console.error('Error loading maps:', error);
        deferred.reject(error);
      });
    return deferred.promise();
  };

  const createMapElement = function(map) {
    if (!map) {
      console.error('Invalid data:', map);
      return null;
    }

    let $map = $(`
    <article class="map">
      <header class="map-info">
        <h2 class="map-title">Map Title</h2>
        <span class="map-creator">Created by: Creator</span>
      </header>
      <div class="description">
        <p>Description of map</p>
      </div>
      <footer class="map-footer">
        <div class="map-icon">
          <i class="fas fa-heart"></i>
        </div>
      </footer>
    </article>
    `);

    return $map;
  };

});

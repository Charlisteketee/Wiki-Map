// Client facing scripts here

// Function to like a map
const likeMap = (mapId) => {
  return fetch('/api/maps/' + mapId + '/like', {
      method: 'POST'
  })
  .then(response => {
      if (response.ok) {
          console.log('Map liked successfully!');
      } else {
          console.error('Failed to like map');
      }
  })
  .catch(error => {
      console.error('Error liking map:', error);
  });
};

// Use likeMap function to like a map
likeMap(mapData.id);

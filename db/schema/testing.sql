SELECT maps.id, maps.title, maps.description, maps.longitude, maps.latitude, (favourites.*)
FROM favourites
JOIN maps on map_id = maps.id
WHERE favourites.user_id = '1'

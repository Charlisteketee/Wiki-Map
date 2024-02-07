SELECT maps.id, maps.title, maps.description, maps.longitude, maps.latitude
FROM maps
JOIN favourites ON favourites.map_id = maps.id
WHERE favourites.user_id = 1
AND maps.id = 1;
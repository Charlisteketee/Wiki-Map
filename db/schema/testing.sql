  SELECT maps.*, COUNT(favourites.map_id) AS favourites_count
  FROM maps
  LEFT JOIN favourites ON maps.id = favourites.map_id
  GROUP BY maps.id
  ORDER BY favourites_count DESC;

    SELECT maps.id, maps.title, maps.description, maps.longitude, maps.latitude
    FROM maps
    JOIN points ON points.map_id = maps.id
    WHERE points.contributor_id = 3
    AND maps.id = 3;

// Define a route to save or update map data that aligns with the AJAX request URL
router.post('/save-map', async (req, res) => {
  console.log('Received request to save/update map', req.body);

  // Extracting user_id from cookies
  const user_id = req.cookies.user_id;

  // Extracting form data from request body
  const { mapId, title, description, longitude, latitude, points } = req.body;

  try {
    const client = await db.connect();

    try {
      await client.query('BEGIN');

      // Check if mapId is provided; if provided, it means we're updating an existing map
      if (mapId) {
        // Update the existing map details
        const mapUpdateQuery = `
          UPDATE maps 
          SET title = $1, description = $2, longitude = $3, latitude = $4, updated_at = CURRENT_DATE
          WHERE id = $5 AND user_id = $6`;
        const mapUpdateValues = [title, description, longitude, latitude, mapId, user_id];
        await client.query(mapUpdateQuery, mapUpdateValues);
      } else {
        // Insert a new map record
        const mapInsertQuery = `
          INSERT INTO maps (user_id, title, description, longitude, latitude, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, CURRENT_DATE, CURRENT_DATE)
          RETURNING id`;
        const mapInsertValues = [user_id, title, description, longitude, latitude];
        const mapInsertResult = await client.query(mapInsertQuery, mapInsertValues);

        mapId = mapInsertResult.rows[0].id;
      }

      // Insert or update points related to the map
      if (points && points.length > 0) {
        for (const point of points) {
          if (point.id) {
            // Update existing point
            const pointUpdateQuery = `
              UPDATE points 
              SET longitude = $1, latitude = $2, title = $3, body = $4, image_url = $5, updated_at = CURRENT_DATE
              WHERE id = $6 AND contributor_id = $7 AND map_id = $8`;
            const pointUpdateValues = [
              point.longitude,
              point.latitude,
              point.title,
              point.body,
              point.image_url,
              point.id,
              user_id,
              mapId
            ];
            await client.query(pointUpdateQuery, pointUpdateValues);
          } else {
            // Insert new point
            const pointInsertQuery = `
              INSERT INTO points (contributor_id, map_id, longitude, latitude, title, body, image_url, created_at, updated_at)
              VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_DATE, CURRENT_DATE)`;
            const pointInsertValues = [
              user_id, // Using user_id as contributor_id for all points
              mapId,
              point.longitude,
              point.latitude,
              point.title,
              point.body,
              point.image_url
            ];
            await client.query(pointInsertQuery, pointInsertValues);
          }
        }
      }

      await client.query('COMMIT');
      res.status(200).json({ message: 'Map data saved/updated successfully' });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error during transaction, rolled back:', error);
      res.status(500).json({ error: 'Internal Server Error, transaction rolled back' });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    res.status(500).json({ error: 'Failed to connect to the database' });
  }
});

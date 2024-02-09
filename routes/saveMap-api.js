const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Define a route to save map data that aligns with the AJAX request URL
router.post('/save-map', async (req, res) => {
  console.log('Received request to save map', req.body);

  // Extracting user_id from cookies
  const user_id = req.cookies.user_id;

  // Extracting form data from request body
  const { title, description, longitude, latitude, points } = req.body;

  try {
    const client = await db.connect();

    try {
      await client.query('BEGIN');

      const mapInsertQuery = `
        INSERT INTO maps (user_id, title, description, longitude, latitude, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, CURRENT_DATE, CURRENT_DATE)
        RETURNING id`;
      const mapInsertValues = [user_id, title, description, longitude, latitude];
      const mapInsertResult = await client.query(mapInsertQuery, mapInsertValues);

      const mapId = mapInsertResult.rows[0].id;

      if (points && points.length > 0) {
        for (const point of points) {
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

      await client.query('COMMIT');
      res.status(200).json({ message: 'Map data saved successfully' });
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

module.exports = router;

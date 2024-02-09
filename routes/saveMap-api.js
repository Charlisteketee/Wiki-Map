const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Define a route to save map data
router.post('/save-map', async(req, res) => {
  try {
    const { user_id, title, description, longitude, latitude, points } = req.body;

    // Start a transaction
    const client = await db.connect();
    await client.query('BEGIN');

    // Insert into maps table
    const mapInsertQuery = `INSERT INTO maps (user_id, title, description, longitude, latitude, created_at, updated_at)
                            VALUES ($1, $2, $3, $4, $5, CURRENT_DATE, CURRENT_DATE)
                            RETURNING id`;
    const mapInsertValues = [user_id, title, description, longitude, latitude];
    const mapInsertResult = await client.query(mapInsertQuery, mapInsertValues);

    const mapId = mapInsertResult.rows[0].id;

    // Insert into points table
    for (const point of points) {
      const pointInsertQuery = `INSERT INTO points (map_id, longitude, latitude, title, body, image_url, created_at, updated_at)
                                VALUES ($1, $2, $3, $4, $5, $6, CURRENT_DATE, CURRENT_DATE)`;
      const pointInsertValues = [mapId, point.longitude, point.latitude, point.title, point.body, point.image_url];
      await client.query(pointInsertQuery, pointInsertValues);
    }

    // Commit the transaction
    await client.query('COMMIT');
    client.release();

    res.status(200).json({ message: 'Map data saved successfully' });
  } catch (error) {
    // Rollback the transaction if an error occurs
    await client.query('ROLLBACK');
    client.release();

    console.error('Error saving map data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;

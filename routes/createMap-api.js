const express = require('express');
const router = express.Router();

router.get('/api/createMap', (req, res) => {
  console.log('Accessed createMap route'); // Add this line
  res.render('createMap');
});

module.exports = router;

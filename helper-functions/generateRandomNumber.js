// Function to generate a unique random number
const db = require('../db/connection');

async function generateUniqueRandomNumber(tableName, columnName) {
  let randomNumber;
  let isUnique = false;

  // Keep generating random numbers until a unique one is found
  while (!isUnique) {
    randomNumber = Math.floor(Math.random() * 1000) + 1; // Generates a random number between 1 and 1000

    // Check if the generated number already exists in the database
    const exists = await checkIfNumberExistsInDatabase(randomNumber);

    if (!exists) {
      // Number is unique; break the loop
      isUnique = true;
    }
  }

  return randomNumber;
}

// Example function to check if a number exists in the database
async function checkIfNumberExistsInDatabase(number, tableName, columnName) {
  try {
    const query = `SELECT ${columnName} FROM ${tableName} WHERE ${columnName} = $1`;
    const result = await db.query(query, [number]);

    // Check if any rows were returned
    return result.rows.length > 0;
  } catch (error) {
    console.error(error.message);
    return false; // Return false on error or if no match found
  }
}

// Usage example
generateUniqueRandomNumber()
  .then((uniqueNumber) => {
    console.log(`Generated unique random number: ${uniqueNumber}`);
  })
  .catch((error) => {
    console.error(error);
  });
generateUniqueRandomNumber('maps', 'map_id')

module.exports = generateUniqueRandomNumber;

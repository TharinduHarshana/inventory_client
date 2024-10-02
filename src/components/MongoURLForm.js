import React, { useState } from 'react';

const MongoURLForm = () => {
  const [mongoURL, setMongoURL] = useState(localStorage.getItem('mongoURL') || '');

  // List of MongoDB URLs you want to select from
  const mongoURLOptions = [
    'mongodb+srv://InventoryDB:admin123@inventorydb.sop76.mongodb.net/InventoryDB',
    'mongodb+srv://oneplacemarket1:THaRindu%40%2300@inventorymngdb.eiwak.mongodb.net/inventoryMngDB',
    'mongodb://localhost:27017/myLocalDB',
  ];

  const handleSave = async () => {
    try {
      // Save MongoDB URL to local storage
      localStorage.setItem('mongoURL', mongoURL);

      // Send the new MongoDB URL to the backend
      const response = await fetch('http://localhost:8000/update-mongo-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newMongoURI: mongoURL }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      alert('Failed to update MongoDB URL');
    }
  };

  return (
    <div className="container">
      <h3>Update MongoDB URL</h3>
      <div className="form-group">
        <label htmlFor="mongoURLSelect">Select MongoDB Connection URL:</label>
        <select
          className="form-control"
          id="mongoURLSelect"
          value={mongoURL}
          onChange={(e) => setMongoURL(e.target.value)}
        >
          <option value="">-- Select MongoDB URL --</option>
          {mongoURLOptions.map((url, index) => (
            <option key={index} value={url}>
              {url}
            </option>
          ))}
        </select>
      </div>
      <button className="btn btn-primary mt-3" onClick={handleSave}>
        Save
      </button>
    </div>
  );
};

export default MongoURLForm;

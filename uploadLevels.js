import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAZqHTg5QDJlTEAP3bVdQOM9oy-8zfLQII",
    authDomain: "game-based-learning-3a957.firebaseapp.com",
    projectId: "game-based-learning-3a957",
    storageBucket: "game-based-learning-3a957.appspot.com",
    messagingSenderId: "226620441583",
    appId: "1:226620441583:web:6400b6d60dfbf72b212c1a",
    measurementId: "G-2142X6GY7M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function uploadLevels() {
  try {
    // Read the JSON file
    const levelsData = JSON.parse(readFileSync(join(__dirname, 'src/assets/levels.json'), 'utf8'));
    
    // Reference to the collection
    const collectionRef = collection(db, 'settings/levels/configuration');
    
    // Upload each level as a separate document
    const uploadPromises = levelsData.map(async (level) => {
      try {
        // Use level.id as the document ID
        await setDoc(doc(collectionRef, level.id.toString()), level);
        console.log(`Successfully uploaded level ${level.id}`);
      } catch (error) {
        console.error(`Error uploading level ${level.id}:`, error);
      }
    });

    await Promise.all(uploadPromises);
    console.log('All levels uploaded successfully!');
  } catch (error) {
    console.error('Error reading or parsing the JSON file:', error);
  }
}

// Run the upload function
uploadLevels(); 
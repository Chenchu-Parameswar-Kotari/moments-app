import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  deleteDoc,
  query,
  orderBy,
  where,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';

// Upload story image
export const uploadStoryImage = async (uri, userId) => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    
    const imagePath = `stories/${userId}/${Date.now()}.jpg`;
    const imageRef = ref(storage, imagePath);
    await uploadBytes(imageRef, blob);
    
    const downloadURL = await getDownloadURL(imageRef);
    return { success: true, url: downloadURL };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Create a new story
export const createStory = async (userId, userName, userAvatar, imageUri) => {
  try {
    // Upload image first
    const uploadResult = await uploadStoryImage(imageUri, userId);
    
    if (!uploadResult.success) {
      return uploadResult;
    }
    
    // Story expires in 24 hours
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    
    const storyData = {
      userId,
      userName,
      userAvatar,
      imageUrl: uploadResult.url,
      viewers: [],
      createdAt: serverTimestamp(),
      expiresAt: expiresAt.toISOString(),
    };
    
    const docRef = await addDoc(collection(db, 'stories'), storyData);
    return { success: true, storyId: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get all active stories (not expired)
export const getActiveStories = async () => {
  try {
    const now = new Date().toISOString();
    const q = query(
      collection(db, 'stories'),
      where('expiresAt', '>', now),
      orderBy('expiresAt', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    const stories = [];
    
    querySnapshot.forEach((doc) => {
      stories.push({ id: doc.id, ...doc.data() });
    });
    
    // Group stories by user
    const groupedStories = stories.reduce((acc, story) => {
      if (!acc[story.userId]) {
        acc[story.userId] = {
          userId: story.userId,
          userName: story.userName,
          userAvatar: story.userAvatar,
          stories: []
        };
      }
      acc[story.userId].stories.push(story);
      return acc;
    }, {});
    
    return { success: true, stories: Object.values(groupedStories) };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Mark story as viewed
export const viewStory = async (storyId, userId) => {
  try {
    const storyRef = doc(db, 'stories', storyId);
    const { arrayUnion } = await import('firebase/firestore');
    const { updateDoc } = await import('firebase/firestore');
    
    await updateDoc(storyRef, {
      viewers: arrayUnion(userId)
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Delete a story
export const deleteStory = async (storyId) => {
  try {
    await deleteDoc(doc(db, 'stories', storyId));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Subscribe to stories in real-time
export const subscribeToStories = (callback) => {
  const now = new Date().toISOString();
  const q = query(
    collection(db, 'stories'),
    where('expiresAt', '>', now),
    orderBy('expiresAt', 'asc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const stories = [];
    querySnapshot.forEach((doc) => {
      stories.push({ id: doc.id, ...doc.data() });
    });
    
    // Group stories by user
    const groupedStories = stories.reduce((acc, story) => {
      if (!acc[story.userId]) {
        acc[story.userId] = {
          userId: story.userId,
          userName: story.userName,
          userAvatar: story.userAvatar,
          stories: []
        };
      }
      acc[story.userId].stories.push(story);
      return acc;
    }, {});
    
    callback(Object.values(groupedStories));
  });
};


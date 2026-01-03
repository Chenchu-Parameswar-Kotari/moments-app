import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  limit,
  where,
  onSnapshot,
  arrayUnion,
  arrayRemove,
  serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';

// Upload image to Firebase Storage
export const uploadImage = async (uri, path) => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    
    const imageRef = ref(storage, path);
    await uploadBytes(imageRef, blob);
    
    const downloadURL = await getDownloadURL(imageRef);
    return { success: true, url: downloadURL };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Create a new post/moment
export const createPost = async (userId, imageUri, caption) => {
  try {
    // Upload image first
    const imagePath = `posts/${userId}/${Date.now()}.jpg`;
    const uploadResult = await uploadImage(imageUri, imagePath);
    
    if (!uploadResult.success) {
      return uploadResult;
    }
    
    // Create post document
    const postData = {
      userId,
      imageUrl: uploadResult.url,
      caption,
      likes: [],
      comments: [],
      createdAt: serverTimestamp(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    };
    
    const docRef = await addDoc(collection(db, 'posts'), postData);
    return { success: true, postId: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get all posts (feed)
export const getPosts = async (limitCount = 20) => {
  try {
    const q = query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const posts = [];
    
    querySnapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, posts };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get posts by user
export const getPostsByUser = async (userId) => {
  try {
    const q = query(
      collection(db, 'posts'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const posts = [];
    
    querySnapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, posts };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Like a post
export const likePost = async (postId, userId) => {
  try {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      likes: arrayUnion(userId)
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Unlike a post
export const unlikePost = async (postId, userId) => {
  try {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      likes: arrayRemove(userId)
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Add comment to a post
export const addComment = async (postId, userId, userName, text) => {
  try {
    const postRef = doc(db, 'posts', postId);
    const comment = {
      userId,
      userName,
      text,
      createdAt: new Date().toISOString()
    };
    
    await updateDoc(postRef, {
      comments: arrayUnion(comment)
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Delete a post
export const deletePost = async (postId) => {
  try {
    await deleteDoc(doc(db, 'posts', postId));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Listen to posts in real-time
export const subscribeToFeed = (callback) => {
  const q = query(
    collection(db, 'posts'),
    orderBy('createdAt', 'desc'),
    limit(20)
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const posts = [];
    querySnapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() });
    });
    callback(posts);
  });
};


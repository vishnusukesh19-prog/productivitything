import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

export function useUserData(collectionName) {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setData([]);
      setLoading(false);
      return;
    }

    const q = query(collection(db, collectionName), where('uid', '==', user.uid));
    const unsub = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setData(items);
      setLoading(false);
    }, (error) => {
      console.error('Data sync error:', error);
      setLoading(false);
    });

    return unsub;
  }, [user, collectionName]);

  const addItem = async (itemData) => {
    if (!user) {
      throw new Error('Not authenticated');
      return;
    }
    try {
      const docRef = await addDoc(collection(db, collectionName), { ...itemData, uid: user.uid, createdAt: new Date() });
      console.log('Item added with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Add failed:', error.code, error.message);
      throw new Error(`Add failed: ${error.message}. Code: ${error.code}`);
    }
  };

  const updateItem = async (id, updates) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, collectionName, id), updates);
      console.log('Item updated');
    } catch (error) {
      console.error('Update failed:', error);
      throw error;
    }
  };

  const deleteItem = async (id) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, collectionName, id));
      console.log(`${collectionName} item ${id} deleted permanently`);
    } catch (error) {
      console.error('Delete failed:', error);
      throw new Error(`Delete failed: ${error.message}. Code: ${error.code}`);
    }
  };

  return { data, loading, addItem, updateItem, deleteItem };
}
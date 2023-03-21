// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getStorage, getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const setConfig = () => {
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: 'AIzaSyBRhY_PMtdvg4lWgr5-MtNaIPWX49aYY9g',
    authDomain: 'red-social-86167.firebaseapp.com',
    projectId: 'red-social-86167',
    storageBucket: 'red-social-86167.appspot.com',
    messagingSenderId: '789021750749',
    appId: '1:789021750749:web:9d433311052199edb2f234',
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  return getStorage(app);
};

export const storeFile = async (file: File) => {
  const storage = setConfig();
  // Create a storage reference from our storage service
  const storageRef = ref(storage, file.name);

  // 'file' comes from the Blob or File API
  const snapshot = await uploadBytes(storageRef, file);
  console.log('Uploaded a file!');
  console.log(snapshot.metadata);
  const url = await getDownloadURL(storageRef);
  console.log({ url });
};

export const getUrl = async (fileName: string) => {
  const storage = setConfig();
  const storageRef = ref(storage, fileName);
  const url = await getDownloadURL(storageRef);
  console.log({ url });
  return url;
};

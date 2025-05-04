// Firebase config and upload utility
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBMIwMHh0LgZ9vDDltWEWa7DjVpYYGUG20",
  authDomain: "medconnect-7bfd0.firebaseapp.com",
  projectId: "medconnect-7bfd0",
  storageBucket: "medconnect-7bfd0.appspot.com",
  messagingSenderId: "290130468800",
  appId: "1:290130468800:web:1b9807e5abf6db972f7225",
  measurementId: "G-LVMM4BSYX2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export function uploadFileToFirebase(file, onProgress) {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, `prescriptions/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        if (onProgress) {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress(progress);
        }
      },
      (error) => reject(error),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(resolve).catch(reject);
      }
    );
  });
} 
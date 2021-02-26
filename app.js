import './uploads.js';
import { upload } from './uploads.js';
import firebase from 'firebase/app';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDMhd66IcOS1vVqShOeQJYtS-b4FBORYyg',
  authDomain: 'upload-file-4150d.firebaseapp.com',
  projectId: 'upload-file-4150d',
  storageBucket: 'upload-file-4150d.appspot.com',
  messagingSenderId: '971029319640',
  appId: '1:971029319640:web:4265a8fb4bce0134c16cad',
};

firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
console.log(storage);
upload('#file', {
  multi: true,
  accept: ['.png', '.jpg', '.jpeg'],
  onUpload(files, blocks) {
    files.forEach((file, i) => {
      const ref = storage.ref(`images/${file.name}`);
      const task = ref.put(file);
      task.on(
        'state_changed',
        (snapshot) => {
          const percentage = (
            (snapshot.bytesTransferred / snapshot.totalBytes) *
            100
          ).toFixed(0);
          const block = blocks[i].querySelector('.prev_info-progress');
          block.textContent = percentage + '%';
          block.style.width = percentage + '%';
        },
        (error) => {
          console.log(error);
        },
        () => {
          task.snapshot.ref.getDownloadURL().then((url) => {
            console.log(url);
          });
        }
      );
    });
    console.log('files:', files);
  },
});

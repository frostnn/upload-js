import './uploads.js';
import upload from './uploads.js';

upload('#file', {
  multi: true,
  accept: ['.png', '.jpg', '.jpeg'],
});

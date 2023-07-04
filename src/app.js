import './styles.scss';
import 'bootstrap';
import * as yup from 'yup';
import onChange from 'on-change';
import { render } from './view.js';
import axios from 'axios';
import parse from './parser.js';

console.log('You are doing everything, right! Go on!!!');

const makeRequest = (url) => {
  const link = `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`;
  return axios.get(link);
};

export default (state) => {
  const watchedState = onChange(state, render);

  const form = document.querySelector('.rss-form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url').trim();
    console.log('url', url);
    const schema = yup.object().shape({
      url: yup.string().url().notOneOf(watchedState.urls),
    });

    schema
      .validate({ url })
      .then((validData) => {
        watchedState.valid = true;
        console.log('Валидация прошла успешно', validData);
        watchedState.urls.push(url);
        watchedState.valid = null;
      })
      .then(() => makeRequest(url))
      .then((responce) => {
        console.log('responce', responce);
        if (responce.status >= 200 && responce.status < 300) {
          const data = parse(responce.data.contents);
          const { feed, posts } = data;
          console.log('posts', posts);
          watchedState.feeds.unshift(feed);
          console.log('watchedState.feeds', watchedState.feeds);
          watchedState.posts.unshift(posts);
          console.log('watchedState.posts', watchedState.posts);
          return;
        }
        throw new Error('networkError');
      })
      .catch((e) => {
        console.log('e', e);
        console.log('e.name!!!!', e.name === 'ValidationError');
        watchedState.urlErrors = e.message;
        watchedState.valid = false;
      });
  });
};

import './styles.scss';
import 'bootstrap';
import axios from 'axios';
import * as yup from 'yup';
import onChange from 'on-change';
import i18next from 'i18next';
import render from './view.js';
import parse from './parser.js';
import ru from './text/ru';

yup.setLocale({
  mixed: {
    notOneOf: 'existsAllready',
    requried: 'emptyInput',
  },
  string: {
    url: 'notValidUrl',
  },
});

const makeRequest = (url) => {
  const link = `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`;
  return axios.get(link);
};

export default (state) => {
  const i18n = i18next.createInstance();
  i18n.init({ lng: 'ru', debug: false, resources: { ru } });

  const watchedState = onChange(state, render(state, i18n));

  const form = document.querySelector('.rss-form');

  const updatePosts = (changedState) => {
    changedState.urls.forEach((url) =>
      makeRequest(url).then((responce) => {
          const { posts } = parse(responce.data.contents);
          const postsLinks = changedState.posts.map((post) => post.link);
          const newPosts = posts.filter(({ link }) => !postsLinks.includes(link));
          changedState.posts.push(...newPosts);
          // render(state);
        })
        .catch((error) => {
          console.log(error);
        }));
    setTimeout(() => updatePosts(watchedState), 5000);
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url');
    const schema = yup.object().shape({
      url: yup.string().url().trim().notOneOf(watchedState.urls),
    });

    schema
      .validate({ url })
      .then(() => {
        watchedState.errors = '';
        watchedState.valid = true;
      })
      .then(() => makeRequest(url))
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          watchedState.urls.push(url);
          const data = parse(response.data.contents);
          const { feed, posts } = data;
          watchedState.feeds.unshift(feed);
          watchedState.posts.push(...posts);
          return Promise.resolve();
        }
        throw new Error('Network Error');
      })
      .catch((error) => {
        console.log('e.message!!!!', error);
        watchedState.errors = error.message;
        watchedState.valid = false;
      });
  });

  const postContainer = document.querySelector('.posts');
  console.log('postContainer', postContainer);
  postContainer.addEventListener('click', (e) => {
    console.log('e.target', e.target);
    if (e.target.dataset.postId) {
      console.log('e.target.dataset', e.target.dataset.postId);
      const targetId = e.target.dataset.postId;
      watchedState.stateUI.readedPosts.push(targetId);
      watchedState.stateUI.modal = targetId;
    }
  });

  updatePosts(watchedState);
};

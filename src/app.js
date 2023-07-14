import './styles.scss';
import 'bootstrap';
import axios from 'axios';
import * as yup from 'yup';
import onChange from 'on-change';
import i18next from 'i18next';
import render from './view.js';
import parse from './parser.js';
import ru from './text/ru';
import _ from 'lodash';

const schema = (urls) => yup.string().url().notOneOf(urls);

yup.setLocale({
  mixed: {
    notOneOf: 'existsAllready',
  },
  string: {
    url: 'notValidUrl',
  },
});

const makeRequest = (text) => {
  const url = new URL(text);
  const link = `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`;
  return axios.get(link);
};

const updatePosts = (changedState) => {
  const promises = changedState.urls.map((url) => makeRequest(new URL(url)));
  const promise = Promise.allSettled(promises);
  promise.then((responces) => {
    responces
      .filter((responce) => responce.status === 'fulfilled')
      .forEach((responce) => {
        const { feed, posts } = parse(responce.value.data.contents);
        const postsLinks = changedState.posts.map((post) => post.link);
        const newPosts = posts.filter(({ link }) => !postsLinks.includes(link))
        .map(post => ({ ...post, feedId: feed.id, postId: _.uniqueId() }));
        changedState.posts.push(...newPosts);
      });
  })
    .catch((error) => {
      console.log(error);
    });
  setTimeout(() => updatePosts(changedState), 5000);
};

const elements = {
  inputField: document.getElementById('url-input'),
  feedBack: document.querySelector('p.feedback'),
  feedsContainer: document.querySelector('.feeds'),
  postsContainer: document.querySelector('.posts'),
  modal: document.querySelector('.modal'),
  form: document.querySelector('.rss-form'),
  button: document.querySelector('.btn'),
};

export default (state) => {
  const i18n = i18next.createInstance();
  i18n.init({ lng: 'ru', debug: false, resources: { ru } }).then(() => {
    const watchedState = onChange(state, render(state, elements, i18n));

    elements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const url = formData.get('url');
      watchedState.formState = 'processing';

      schema(watchedState.urls)
        .validate(url)
        .then(() => {
          watchedState.error = '';
          return makeRequest(url)
        })
        .then((response) => {
          if (response.status >= 200 && response.status < 300) {
            watchedState.urls.push(url);
            const data = parse(response.data.contents);
            const { feed, posts } = data;
            feed.id = _.uniqueId();
            const postsWithId = posts.map(post => ({ ...post, feedId: feed.id, postId: _.uniqueId() }));
            watchedState.feeds.unshift(feed);
            watchedState.posts.push(...postsWithId);
            watchedState.formState = 'successed';
            return;
          }
          throw new Error('Network Error');
        })
        .catch((error) => {
          watchedState.error = error.message;
          watchedState.formState = 'error';
        });
      updatePosts(watchedState);
    });

    const postContainer = document.querySelector('.posts');
    postContainer.addEventListener('click', (e) => {
      if (e.target.dataset.postId) {
        const targetId = e.target.dataset.postId;
        watchedState.stateUI.readedPosts.push(targetId);
        watchedState.stateUI.modal = targetId;
      }
    });
  });
};

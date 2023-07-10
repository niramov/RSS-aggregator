import './styles.scss';
import 'bootstrap';
import * as yup from 'yup';
import onChange from 'on-change';
import { render } from './view.js';
import axios from 'axios';
import parse from './parser.js';
import _ from 'lodash';

yup.setLocale({
  mixed: {
    notOneOf: 'existsAllready',
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
  const watchedState = onChange(state, render(state));

  const form = document.querySelector('.rss-form');

  const updatePosts = (watchedState) => {
    watchedState.urls.forEach((url) => {
      makeRequest(url)
        .then((responce) => {
          const { posts } = parse(responce.data.contents);
          const postsLinks = watchedState.posts.map((post) => post.link);
          const newPosts = posts.filter(({ link }) => !postsLinks.includes(link));
          watchedState.posts.push(...newPosts);
          render(watchedState);
        })
        .catch((error) => {
          watchedState.errors = error.message;
        });
    });
    setTimeout(() => updatePosts(watchedState), 5000);
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url').trim();
    const schema = yup.object().shape({
      url: yup.string().url().notOneOf(watchedState.urls),
    });

    schema
      .validate({ url })
      .then(() => {
        watchedState.valid = true;
      })
      .then(() => {
        watchedState.urls.push(url);
        return makeRequest(url);
      })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          const data = parse(response.data.contents);
          const { feed, posts } = data;
          watchedState.feeds.unshift(feed);
          watchedState.posts.push(...posts);
          return Promise.resolve();
        }
        throw new Error('Network Error');
      })
      .catch((e) => {
        console.log('e.message!!!!', e);
        watchedState.errors = e.message;
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

    // const targetButton = e.target.closest('.btn-outline-primary');
    // console.log('targetButton', targetButton);
    // if (targetButton) {
    //   const targetId = targetButton.dataset.postId;
    //   watchedState.stateUI.readedPosts.push(targetId);
    //   watchedState.stateUI.modal = targetId;
    // }
  });

  updatePosts(watchedState);
};

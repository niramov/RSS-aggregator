import './styles.scss';
import 'bootstrap';
import * as yup from 'yup';
import onChange from 'on-change';
import { render } from './view.js';

console.log('You are doing everything, right! Go on!!!');

const f = () => {
  const state = {
    url: '',
    valid: '',
    feeds: [],
  };

  const watchedState = onChange(state, render);

  const form = document.querySelector('.rss-form');
  // const inputField = form.querySelector('#url-input');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const value = formData.get('url');
    console.log('value', value);
    const schema = yup.object().shape({
      url: yup.string().url('Некорректный URL').notOneOf(watchedState.feeds),
    });

    schema
      .validate({ url: value })
      .then((validData) => {
        watchedState.valid = true;
        console.log('Валидация прошла успешно', validData);
      })
      .catch((e) => {
        console.log('validationError', e);
        watchedState.valid = false;
      });
  });
};

f();

import './styles.scss';
import 'bootstrap';
import * as yup from 'yup';
import onChange from 'on-change';
import { render } from './view.js';

console.log('You are doing everything, right! Go on!!!');

export default (state) => {
  const watchedState = onChange(state, render);

  const form = document.querySelector('.rss-form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const value = formData.get('url');
    console.log('value', value);
    const schema = yup.object().shape({
      url: yup.string().url().notOneOf(watchedState.feeds),
    });

    schema
      .validate({ url: value })
      .then((validData) => {
        watchedState.valid = true;
        console.log('Валидация прошла успешно', validData);
        watchedState.feeds.push(value);
        watchedState.valid = null;
      })
      .catch((e) => {
        console.log('e', e.message, typeof e.message);
        watchedState.urlErrors = e.message;
        watchedState.valid = false;
      });
  });
};

import i18next from 'i18next';
import ru from './text/ru';

const render = (path, value) => {
  i18next.init({ lng: 'ru', debug: false, resources: { ru } });

  console.log('i18next', i18next.t('errors.notValidUrl'));

  const inputField = document.getElementById('url-input');
  // const addButton = document.querySelector('[aria-label="add"]');
  const feedBack = document.querySelector('p.feedback');
  console.log('feedback', feedBack);

  if (path === 'valid') {
    if (value === true) {
      inputField.classList.remove('error');
      feedBack.classList.remove('text-danger');
      feedBack.classList.add('text-success');
      feedBack.textContent = i18next.t('succeedMessage');
      inputField.value = '';
      inputField.focus();
    }
    if (value === false) {
      inputField.classList.add('error');
      feedBack.classList.remove('text-success');
      feedBack.classList.add('text-danger');
    }
  }

  if (path === 'urlErrors') {
    const feedbackText = value.includes('url must be a valid')
      ? i18next.t('errors.notValidUrl')
      : i18next.t('errors.existsAllready');
    console.log('value!!!!!!!!!', value);
    feedBack.textContent = feedbackText;
  }
};

export { render };

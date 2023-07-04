import i18next from 'i18next';
import ru from './text/ru';

const createListElement = (listName) => {
  const borderDiv = document.createElement('div');
  borderDiv.classList.add('card', 'border-0');

  const bodyDiv = document.createElement('div');
  bodyDiv.classList.add('card-body');

  const h2 = document.createElement('h2');
  h2.classList.add('card-title', 'h4');
  h2.textContent = listName === 'feeds' ? 'Фиды' : 'Посты';
  bodyDiv.append(h2);

  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');
  ul.dataset.el = listName;

  borderDiv.append(bodyDiv, ul);

  return borderDiv;
};

// const createFeed = (feed) => {
//   const listContainer = document.querySelector(`.${path}`);
//   if (listContainer.childNodes.length === 0) {
//     createListElement()
//   }
// }

const render = (path, value) => {
  i18next.init({ lng: 'ru', debug: false, resources: { ru } });

  const inputField = document.getElementById('url-input');

  const feedBack = document.querySelector('p.feedback');
  console.log('feedback', feedBack);

  if (path === 'valid') {
    if (value === true) {
      inputField.classList.remove('error');
      feedBack.classList.remove('text-danger');
      feedBack.classList.add('text-success');
      // feedBack.textContent = i18next.t('succeedMessage');
      inputField.value = '';
      inputField.focus();
    }
    if (value === false) {
      inputField.classList.add('error');
      feedBack.classList.remove('text-success');
      feedBack.classList.add('text-danger');
    }
  }

  if (path === 'feeds') {
    console.log('value', value);
    const listContainer = document.querySelector(`.${path}`);
    if (listContainer.childNodes.length === 0) {
      listContainer.append(createListElement(path));
    }

    const list = listContainer.querySelector('[data-el]');
    const el = document.createElement('li');
    el.classList.add('list-group-item', 'border-0', 'border-end-0');

    const head = document.createElement('h3');
    head.classList.add('h6', 'm-0');
    head.textContent = value[0].title;

    const description = document.createElement('p');
    description.classList.add('m-0', 'small', 'text-black-50');
    description.textContent = value[0].description;

    el.append(head, description);
    list.append(el);
  }

  if (path === 'posts') {
    console.log('valuePosts', value);
    const listContainer = document.querySelector(`.${path}`);
    if (listContainer.childNodes.length === 0) {
      listContainer.append(createListElement(path));
    }

    value[0].forEach((post) => {
      const list = listContainer.querySelector('[data-el]');
      const el = document.createElement('li');
      el.classList.add(
        'list-group-item',
        'd-flex',
        'border-0',
        'justify-content-between',
        'border-end-0',
        'align-items-start'
      );

      const a = document.createElement('a');
      a.setAttribute('href', post.link);
      a.classList.add('fw-bold');
      a.dataset.id = 1;
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
      a.textContent = post.title;

      const button = document.createElement('button');
      button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
      button.classList.add('type', 'button');
      button.dataset.id = 1;
      button.dataset.bsToggle = 'modal';
      button.dataset.bsTarget = '#modal';
      button.textContent = 'Просмотр';

      el.append(a, button);
      list.append(el);
    });
    feedBack.textContent = i18next.t('succeedMessage');
  }

  if (path === 'urlErrors') {
    const feedbackText = value.includes('url must be a valid')
      ? i18next.t('errors.notValidUrl')
      : i18next.t('errors.existsAllready');
    feedBack.textContent = feedbackText;
  }
};

export { render };

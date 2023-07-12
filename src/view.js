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

export default (watchedState, i18n) => (path, value) => {
  const inputField = document.getElementById('url-input');
  const feedBack = document.querySelector('p.feedback');

  if (path === 'valid') {
    if (value === true) {
      inputField.classList.remove('error');
      feedBack.classList.remove('text-danger');
      feedBack.classList.add('text-success');
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
    const listContainer = document.querySelector(`.${path}`);
    listContainer.innerHTML = '';
    listContainer.append(createListElement(path));

    value.forEach((post) => {
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

      const fw = watchedState.stateUI.readedPosts.includes(post.postId) ? 'fw-normal' : 'fw-bold';
      const a = document.createElement('a');
      a.setAttribute('href', post.link);
      a.classList.add(fw);
      a.dataset.postId = post.postId;
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
      a.textContent = post.title;

      const button = document.createElement('button');
      button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
      button.classList.add('type', 'button');
      button.dataset.postId = post.postId;
      button.dataset.bsToggle = 'modal';
      button.dataset.bsTarget = '#modal';
      button.textContent = 'Просмотр';

      el.append(a, button);
      list.append(el);
    });
    feedBack.textContent = i18n.t('succeedMessage');
  }

  if (path === 'error') {
    feedBack.textContent = '';
    switch (value) {
      case 'ParserError':
        feedBack.textContent = i18n.t('errors.parserError');
        break;
      case 'Network Error':
        feedBack.textContent = i18n.t('errors.networkError');
        break;
      case 'notValidUrl':
        feedBack.textContent = i18n.t('errors.notValidUrl');
        break;
      case 'existsAllready':
        feedBack.textContent = i18n.t('errors.existsAllready');
        break;
      default:
        throw new Error('Unknown value!', value);
    }
  }

  if (path === 'stateUI.readedPosts') {
    value.forEach((targetId) => {
      const targetPost = watchedState.posts.find(({ postId }) => postId === targetId);
      console.log('targetPost', targetPost);
      const element = document.querySelector(`[data-post-id="${targetId}"]`);
      console.log('element', element);
      element.classList.remove('fw-bold');
      element.classList.add('fw-normal');
    });
  }

  if (path === 'stateUI.modal') {
    const modalTitle = document.querySelector('.modal-title');
    const modalBody = document.querySelector('.modal-body');
    const modalLink = document.querySelector('.modal-footer > a');
    const targetPost = watchedState.posts.find(({ postId }) => postId === value);
    modalTitle.textContent = targetPost.title;
    modalBody.textContent = targetPost.description;
    modalLink.href = targetPost.link;
  }
};

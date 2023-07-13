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

const renderForm = (elements, value, i18n) => {
  switch (value) {
    case 'processing':
      elements.button.setAttribute('disable', '');
      elements.inputField.classList.remove('error');
      elements.feedBack.classList.remove('text-danger');
      elements.feedBack.textContent = '';
      break;
    case 'successed':
      elements.inputField.classList.remove('error');
      elements.feedBack.classList.remove('text-danger');
      elements.feedBack.classList.add('text-success');
      elements.feedBack.textContent = i18n.t('succeedMessage');
      elements.button.removeAttribute('disable');
      elements.inputField.value = '';
      elements.inputField.focus();
      break;
    case 'error':
      elements.inputField.classList.add('error');
      elements.feedBack.classList.remove('text-success');
      elements.feedBack.classList.add('text-danger');
      elements.button.removeAttribute('disable');
      break;
    default:
      console.log('Unknown value!!!', value);
  }
};

const renderFeeds = (elements, value) => {
  if (elements.feedsContainer.childNodes.length === 0) {
    elements.feedsContainer.append(createListElement('feeds'));
  }

  const list = elements.feedsContainer.querySelector('[data-el]');
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
};

const renderPosts = (watchedState, value, elements) => {
  elements.postsContainer.innerHTML = '';
  elements.postsContainer.append(createListElement('posts'));

  value.forEach((post) => {
    const list = elements.postsContainer.querySelector('[data-el]');
    const el = document.createElement('li');
    el.classList.add(
      'list-group-item',
      'd-flex',
      'border-0',
      'justify-content-between',
      'border-end-0',
      'align-items-start',
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
};

const renderErrors = (elements, value, i18n) => {
  elements.feedBack.textContent = '';
  switch (value) {
    case 'ParserError':
      elements.feedBack.textContent = i18n.t('errors.parserError');
      break;
    case 'Network Error':
      elements.feedBack.textContent = i18n.t('errors.networkError');
      break;
    case 'notValidUrl':
      elements.feedBack.textContent = i18n.t('errors.notValidUrl');
      break;
    case 'existsAllready':
      elements.feedBack.textContent = i18n.t('errors.existsAllready');
      break;
    case '':
      break;
    default:
      throw new Error('Unknown value!', value);
  }
};

const renderReadedPosts = (watchedState, value) => {
  value.forEach((targetId) => {
    const targetPost = watchedState.posts.find(({ postId }) => postId === targetId);
    console.log('targetPost', targetPost);
    const targetElement = document.querySelector(`[data-post-id="${targetId}"]`);
    console.log('element', targetElement);
    targetElement.classList.remove('fw-bold');
    targetElement.classList.add('fw-normal');
  });
};

const renderModal = (watchedState, value, elements) => {
  const modalTitle = elements.modal.querySelector('.modal-title');
  const modalBody = elements.modal.querySelector('.modal-body');
  const modalLink = elements.modal.querySelector('.modal-footer > a');
  const targetPost = watchedState.posts.find(({ postId }) => postId === value);
  modalTitle.textContent = targetPost.title;
  modalBody.textContent = targetPost.description;
  modalLink.href = targetPost.link;
};

export default (watchedState, elements, i18n) => (path, value) => {
  switch (path) {
    case 'formState':
      renderForm(elements, value, i18n);
      break;
    case 'error':
      renderErrors(elements, value, i18n);
      break;
    case 'feeds':
      renderFeeds(elements, value);
      break;
    case 'posts':
      renderPosts(watchedState, value, elements);
      break;
    case 'stateUI.readedPosts':
      renderReadedPosts(watchedState, value);
      break;
    case 'stateUI.modal':
      renderModal(watchedState, value, elements);
      break;
    default:
      break;
  }
};

import _ from 'lodash';

export default (object) => {
  const parser = new DOMParser();
  const data = parser.parseFromString(object, 'text/xml');
  const parserError = data.querySelector('parsererror');
  if (parserError) {
    const e = new Error();
    e.message = 'ParserError';
    throw e;
  }

  const feedTitle = data.querySelector('title').textContent;
  const feedDescription = data.querySelector('description').textContent;
  const feed = { title: feedTitle, description: feedDescription, id: _.uniqueId() };

  const items = data.querySelectorAll('item');

  const posts = [...items].map((item) => ({
    link: item.querySelector('link').textContent,
    title: item.querySelector('title').textContent,
    description: item.querySelector('description').textContent,
    feedId: feed.id,
    postId: _.uniqueId(),
  }));

  return { feed, posts };
};

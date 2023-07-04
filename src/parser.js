import _ from 'lodash';

export default (object) => {
  const parser = new DOMParser();
  const data = parser.parseFromString(object, 'text/xml');
  const parserError = data.querySelector('parsererror');
  if (parserError) {
    console.log('parserError!!!!!!');
    throw new Error('ParserError');
  }

  console.log('NO PARSEERRORS!!!!!!');
  const feedTitle = data.querySelector('title').textContent;
  const feedDescription = data.querySelector('description').textContent;
  const feed = { title: feedTitle, description: feedDescription, id: _.uniqueId() };

  const items = data.querySelectorAll('item');
  console.log('items', items);
  const posts = [...items].map((item) => ({
    link: item.querySelector('link').textContent,
    title: item.querySelector('title').textContent,
    description: item.querySelector('description').textContent,
    feedId: feed.id,
  }));

  return { feed, posts };
};

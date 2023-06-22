// import yup from 'yup';
const inputField = document.getElementById('url-input');

const render = (path, value) => {
  console.log(inputField);
  console.log('path', path);
  console.log('value', value);

  if (path === 'valid') {
    if (value === true) {
      console.log('inputField!!!!!!', inputField);
      inputField.classlist.remove('error');
    } else {
      inputField.classlist.add('error');
    }
  }
};

export { render };

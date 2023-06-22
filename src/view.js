// import yup from 'yup';
const render = (path, value) => {
  console.log('path', path);
  console.log('value', value);
  const inputField = document.getElementById('url-input');
  console.log('inputField', inputField);

  if (path === 'valid') {
    if (value === true) {
      console.log('inputFieldTRUE', inputField);
      inputField.classList.remove('error');
      inputField.value = '';
      inputField.focus();
    }
    if (value === false) {
      console.log('inputFieldFALSE', inputField);
      inputField.classList.add('error');
    }
  }
};

export { render };

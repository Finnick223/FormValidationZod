const getElementsFromForm = () => {
  const form = document.querySelector<HTMLFormElement>('form');
  if (!form) throw new Error('form doesnt exist');

  const inputName = form.querySelector<HTMLInputElement>(
    'input[name=inputName]',
  );
  const inputEmail = form.querySelector<HTMLInputElement>(
    'input[name=inputEmail]',
  );
  const password = form.querySelector<HTMLInputElement>('input[name=password]');
  const repasswd = form.querySelector<HTMLInputElement>('input[name=repasswd]');
  const terms = form.querySelector<HTMLInputElement>('input[name=terms]');

  if (!form || !inputName || !inputEmail || !password || !repasswd || !terms)
    throw new Error('Core elements not found');

  return {
    form,
    inputName,
    inputEmail,
    password,
    repasswd,
    terms,
  };
};

const testText = (field: HTMLInputElement, lng: number) => {
  const fieldLength = field.value.trim().length;
  return fieldLength >= lng;
};

const testEmail = (field: HTMLInputElement) => {
  const reg =
    // eslint-disable-next-line no-control-regex
    /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*(\.\w{2,})+$/;
  return reg.test(field.value);
};

const testPasswordStrength = (field: HTMLInputElement) => {
  //duze,male,specjalne,cyfry,co naajmniej 8, maks 20
  const reg =
    /^(?=.*\d)(?=.*[A-Z])(?=.*[!#$%&?@_"])(?=.*[a-z])(?=.*[a-zA-Z!#$@^%&?"])[a-zA-Z0-9!#$@^%&?]{8,20}$/;
  return reg.test(field.value);
};

const testPasswordRetype = (field: HTMLInputElement) => {
  const { password } = getElementsFromForm();
  return field.value === password.value;
};

const checkIfAgree = (field: HTMLInputElement) => {
  return field.checked;
};

const createFieldErrorText = (field: HTMLInputElement, text: string) => {
  field.classList.add('field-error');

  const div = document.createElement('div');
  div.classList.add('error-text');
  div.innerHTML = text;

  if (!field.nextElementSibling?.classList.contains('error-text')) {
    field.parentElement?.insertBefore(div, field.nextElementSibling);
  }
};

const removeFieldErrorText = (field: HTMLInputElement) => {
  field.classList.remove('field-error');
  const errorText = field.nextElementSibling;
  if (errorText !== null && errorText.classList.contains('error-text')) {
    errorText.remove();
  }
};

function clearErrors(field: HTMLInputElement) {
  for (const el of [field]) {
    removeFieldErrorText(el);
  }
}

//! INIT

const init = () => {
  const { form, inputName, inputEmail, password, repasswd, terms } =
    getElementsFromForm();
  form.setAttribute('novalidate', 'true');
  let errors = false;

  inputName.addEventListener('input', () => {
    clearErrors(inputName);
    errors = false;
    if (!testText(inputName, 3)) {
      createFieldErrorText(inputName, 'nieprawidlowe imie');
    }
  });

  inputEmail.addEventListener('input', () => {
    clearErrors(inputEmail);
    errors = false;
    if (!testEmail(inputEmail)) {
      createFieldErrorText(inputEmail, 'nieprawidłowy format e-maila');
      errors = true;
    }
  });

  password.addEventListener('input', () => {
    clearErrors(password);
    errors = false;
    if (!testPasswordStrength(password)) {
      createFieldErrorText(
        password,
        'Haslo powinno zawierac 8-20 znakow, male, duze litery, cyfry, znaki specjalne',
      );
      errors = true;
    }
  });

  repasswd.addEventListener('input', () => {
    clearErrors(repasswd);
    errors = false;
    if (!testPasswordRetype(repasswd)) {
      createFieldErrorText(repasswd, 'Hasla nie są identyczne');
      errors = true;
    }
  });

  terms.addEventListener('input', () => {
    clearErrors(terms);
    errors = false;
    if (!checkIfAgree(terms)) {
      createFieldErrorText(terms, 'zaznacz zgode');
      errors = true;
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!errors) form.submit();
  });
};
init();

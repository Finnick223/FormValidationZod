import { z } from 'zod';

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
  const button = form.querySelector('.btn');

  if (
    !form ||
    !inputName ||
    !inputEmail ||
    !password ||
    !repasswd ||
    !terms ||
    !button
  )
    throw new Error('Core elements not found');

  return {
    form,
    inputName,
    inputEmail,
    password,
    repasswd,
    terms,
    button,
  };
};

const createErrorText = (field: HTMLInputElement, error: any) => {
  if (error != null) {
    field.classList.add('field-error');
    const errorText = document.createElement('p');
    errorText.textContent = `${error}`;
    errorText.classList.add('error-text');
    if (!field?.nextElementSibling?.classList.contains('error-text')) {
      field?.parentNode?.insertBefore(errorText, field.nextSibling);
    }
  }
};

const removeFieldErrorText = (field: HTMLInputElement) => {
  field.classList.remove('field-error');
  const errorText = field.nextElementSibling;
  if (errorText !== null && errorText.classList.contains('error-text')) {
    errorText.remove();
  }
};

const init = () => {
  const { form, inputName, inputEmail, password, repasswd, terms, button } =
    getElementsFromForm();
  form.setAttribute('novalidate', 'true');

  const SignUpSchema = z
    .object({
      inputName: z.string().min(5).max(18),
      inputEmail: z.string().email().min(1),
      password: z
        .string()
        .regex(
          /^(?=.*\d)(?=.*[A-Z])(?=.*[!#$%&?@_"])(?=.*[a-z])(?=.*[a-zA-Z!#$@^%&?"])[a-zA-Z0-9!#$@^%&?]{8,20}$/,
          'Password 8-20 small, big letters, number, special',
        ),
      repasswd: z.string().min(1),
      terms: z.boolean().refine((data) => data, {
        message: 'Check terms',
      }),
    })
    .refine((data) => data.password === data.repasswd, {
      message: "Passwords don't match",
      path: ['repasswd'],
    });

  form.addEventListener('input', (e) => {
    e.preventDefault();

    type SignUpForm = z.infer<typeof SignUpSchema>;

    const data: SignUpForm = {
      inputName: inputName.value,
      inputEmail: inputEmail.value,
      password: password.value,
      repasswd: repasswd.value,
      terms: terms.checked,
    };

    const targetinput = e.target as HTMLInputElement;
    console.log('Data', data);
    try {
      const res = SignUpSchema.parse(data);
      removeFieldErrorText(targetinput);
      button?.addEventListener(
        'click',
        () => {
          submitViaAPI(res);
        },
        { once: true },
      );
    } catch (err: any) {
      const getErrorForInput = (input: string) => {
        return err.flatten().fieldErrors[input] ?? null;
      };
      removeFieldErrorText(targetinput);
      createErrorText(targetinput, getErrorForInput(targetinput.name));
    }
  });

  function submitViaAPI(data: z.infer<typeof SignUpSchema>) {
    console.log('Submitted!');
    console.log(data);
  }
};
init();

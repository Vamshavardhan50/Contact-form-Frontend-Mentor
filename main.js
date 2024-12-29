const form = document.getElementById('form');
const firstName = document.getElementById('first-name');
const lastName = document.getElementById('last-name');
const email = document.getElementById('email');
const radioButtons = document.querySelectorAll('input[name="query-type"]');
const message = document.getElementById('message');
const consent = document.getElementById('consent');
const messageSent = document.querySelector('.message-sent');


const clearError = (input) => {
  const errorElement = document.getElementById(`${input.id}-error`);
  if (errorElement) {
    errorElement.setAttribute('hidden', '');
    errorElement.innerText = '';
    input.setAttribute('aria-invalid', 'false');
  }
};

const showError = (input, message) => {
  const errorElement = document.getElementById(`${input.id}-error`);
  if (errorElement) {
    errorElement.removeAttribute('hidden');
    errorElement.innerText = message;
    input.setAttribute('aria-invalid', 'true');
  }
};

const validateRequiredField = (input, errorMessage) => {
  if (!input.checkValidity()) {
    showError(input, errorMessage);
    return false;
  }
  return true;
};

// Validación para cada campo de texto
const handleTextInput = (input) => {
  input.addEventListener('input', () => {
    clearError(input);
  });
};

// Validación para el campo de email
const handleEmailValidation = (email) => {
  email.addEventListener('input', () => {
    const requiredErrorElement = document.getElementById('email-required-error');
    clearError(requiredErrorElement);

    if (email.validity.typeMismatch) {
      showError(email, 'Please enter a valid email address');
    } else {
      clearError(email);
    }
  });
};

// Validación para radio buttons
const handleRadioButtonValidation = (radioButtons) => {
  radioButtons.forEach(radioButton => {
    radioButton.addEventListener('change', () => {
      const selectedQueryType = document.querySelector('input[name="query-type"]:checked');
      if (selectedQueryType) {
        clearError(document.getElementById('query-type-fieldset'));
      }
    });
  });
};

const handleConsentValidation = (consent) => {
  consent.addEventListener('change', () => {
    clearError(consent);
  });
};

// Validación al enviar el formulario
form.addEventListener('submit', (e) => {
  e.preventDefault();
  let isValid = true;
  let firstInvalidField = null; 

  const checkValidityAndFocus = (input, errorMessage) => {
    const isFieldValid = validateRequiredField(input, errorMessage);
    if (!isFieldValid && !firstInvalidField) {
      firstInvalidField = input; // Guardar el primer campo con error
    }
    return isFieldValid;
  };

  isValid &= checkValidityAndFocus(firstName, 'This field is required');
  isValid &= checkValidityAndFocus(lastName, 'This field is required');

  if (email.validity.valueMissing) {
    showError(email, 'This field is required');
    if (!firstInvalidField) firstInvalidField = email;
    isValid = false;
  } else if (email.validity.typeMismatch) {
    showError(email, 'Please enter a valid email address');
    if (!firstInvalidField) firstInvalidField = email;
    isValid = false;
  }

  const queryType = document.querySelector('input[name="query-type"]:checked');
  if (!queryType) {
    showError(document.getElementById('query-type-fieldset'), 'Please select a query type');
    if (!firstInvalidField) firstInvalidField = document.getElementById('query-type-fieldset');
    isValid = false;
  }

  isValid &= checkValidityAndFocus(message, 'This field is required');

  if (consent.validity.valueMissing) {
    showError(consent, 'To submit this form, please consent to being contacted');
    if (!firstInvalidField) firstInvalidField = consent;
    isValid = false;
  }

   // Si hay un campo inválido, hacer foco y scroll hacia él
   if (firstInvalidField) {
    firstInvalidField.focus();
    firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  if (isValid) {
    const messageSuccessTemplate = document.querySelector('#message-success-template');
    const messageSuccessContent = messageSuccessTemplate.content.cloneNode(true);
    messageSent.appendChild(messageSuccessContent);
    messageSent.classList.add('show');
    form.reset();
    setTimeout(() => {
      messageSent.classList.add('hide');
      setTimeout(() => {
        messageSent.innerHTML = '';
        messageSent.classList.remove('show', 'hide');
      }, 1000);
    }, 3000);
  }
});

// Inicializar validaciones de campos
handleTextInput(firstName);
handleTextInput(lastName);
handleTextInput(message);
handleEmailValidation(email);
handleRadioButtonValidation(radioButtons);
handleConsentValidation(consent);
import PropTypes from "prop-types";

export const ENG = {
  header: {
    welcome: "Welcome to trip Sharing 2k19",
    trigram: "ENG"
  },
  placeholders: {
    mail: "Mail address...",
    password: "Password...",
    verifyPassword: "Password, again...",
    firstName: "First name...",
    lastName: "Last name...",
    newPassword: "New password...",
    verifyNewPassword: "Confirm new password..."
  },
  buttons: {
    loginForm: "Login form",
    registrationForm: "Registration form",
    updateUserForm: "Update personal data",
    changePasswordForm: "Change password",
    login: "Login",
    register: "Register",
    forgotPassword: "Forgot password ?",
    validate: "Validate"
  },
  errors: {
    default: "An unknown and unexpected error occured",
    uniqueMail: "This mail is already in use, please try another one",
    serverFailure: "Sorry, our server failed us, please try again later",
    wrongCredentials: "Something is wrong with your credentials, please try again",
    tooManyAttempts: "You made too many attempts, please retry in",
    emptyCredentials: "Please enter a mail address and a password",
    differentPasswords: "Your two passwords are different, please try again",
    mailError: "Unable to send a verification mail to your address, please check it and try again",
    wrongToken: "Unauthorized access, your session might have expired",
    alreadyVerified: "This verification has already been done",
    notVerified: "Please verify your account beforehand",
    improperMail: "Please enter a valid mail address",
    unknownConnection: "Login attempt from an unkwnown source, please check your mails to allow it",
    untrustedConnection:
      "Login attempt from an untrusted source, please check your mails to allow it",
    tooShortPassword: "Your password is too short, please use at least 8 characters"
  },
  messages: {
    registerSuccess: "Your account has been registered, please check your mails to verify it",
    verifySuccess: "Your mail address has been verified, you can now use it",
    allowSuccess: "This connection has been successfully added to your whitelist",
    updateUserSuccess: "Your personal data have been updated",
    changePasswordSuccess: "Your password has been updated",
    resetSuccess: "A link to reset your password has been sent, please check your mails"
  },
  captions: {
    changePassword: "Change password: ",
    resetPassword: "Reset your password: "
  }
};

export const FRA = {
  header: {
    welcome: "Bienvenue dans Trip Sharing 2k19",
    trigram: "FRA"
  },
  placeholders: {
    mail: "Adresse mail...",
    password: "Mot de passe...",
    verifyPassword: "Mot de passe, encore...",
    firstName: "Prénom...",
    lastName: "Nom de famille...",
    newPassword: "Nouveau mot de passe...",
    verifyNewPassword: "Confirmation du nouveau mot de passe..."
  },
  buttons: {
    loginForm: "Connexion",
    registrationForm: "Inscription",
    updateUserForm: "Données personnelles",
    changePasswordForm: "Mot de passe",
    login: "Connexion",
    register: "Inscription",
    forgotPassword: "Mot de passe oublié ?",
    validate: "Valider"
  },
  errors: {
    default: "Une erreur inconnue et inattendue est survenue",
    uniqueMail: "Cette adresse mail est déjà utilisée, veuillez en essayer une autre",
    serverFailure: "Le serveur ne répond pas, veuillez réeassyer plus tard",
    wrongCredentials: "Impossible de se connecter avec ces informations, veuillez réessayer",
    tooManyAttempts: "Trop de tentatives de connexion, veuillez réessayer dans",
    emptyCredentials: "Veuillez tout d'abord fournir une adresse mail et un mot de passe",
    differentPasswords: "Les deux mots de passe sont différents, veuillez réessayer",
    mailError:
      "Impossible d'envoyer le mail de confirmation à votre adresse, veuillez vérifier et réessayer",
    wrongToken: "Accès non autorisé, votre session a peut être expiré",
    alreadyVerified: "Cette vérification a déjà été réalisée",
    notVerified: "Veuillez d'abord vérifier votre adresse mail",
    improperMail: "Veuillez entrer une adresse mail valide",
    unknownConnection: "Tentative de connexion suspecte, veuillez vérifier vos mails",
    untrustedConnection: "Tentative de connexion non autorisée, veuillez vérifier vos mails",
    tooShortPassword: "Votre mot de passe doit faire un minimum de 8 caractères"
  },
  messages: {
    registerSuccess: "Votre compte a été créé. Un mail de validation a été envoyé",
    verifySuccess: "Votre compté a été vérifié, vous pouvez désormais l'utiliser",
    allowSuccess: "Cette connexion a été ajoutée à la liste autorisée",
    updateUserSuccess: "Vos données peersonnelles ont été changées",
    changePasswordSuccess: "Votre mot de passe a été changé",
    resetSuccess: "Un lien permettant de changer de mot de passe vous a été envoyé par mail"
  },
  captions: {
    changePassword: "Changer de mot de passe : ",
    resetPassword: "Entrez un nouveau mot de passe : "
  }
};

export const LanguagePropTypes = PropTypes.shape({
  header: PropTypes.shape({
    welcome: PropTypes.string.isRequired,
    trigram: PropTypes.string.isRequired
  }).isRequired,
  placeholders: PropTypes.shape({
    mail: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    verifyPassword: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    newPassword: PropTypes.string.isRequired,
    verifyNewPassword: PropTypes.string.isRequired
  }).isRequired,
  buttons: PropTypes.shape({
    loginForm: PropTypes.string.isRequired,
    registrationForm: PropTypes.string.isRequired,
    updateUserForm: PropTypes.string.isRequired,
    changePasswordForm: PropTypes.string.isRequired,
    login: PropTypes.string.isRequired,
    register: PropTypes.string.isRequired,
    forgotPassword: PropTypes.string.isRequired,
    validate: PropTypes.string.isRequired
  }),
  // Error codes
  errors: PropTypes.shape({
    // Default
    default: PropTypes.string.isRequired,
    // -1
    uniqueMail: PropTypes.string.isRequired,
    // -2
    serverFailure: PropTypes.string.isRequired,
    // -3
    wrongCredentials: PropTypes.string.isRequired,
    // -4
    tooManyAttempts: PropTypes.string.isRequired,
    // -5
    emptyCredentials: PropTypes.string.isRequired,
    // -6
    differentPasswords: PropTypes.string.isRequired,
    // -7
    mailError: PropTypes.string.isRequired,
    // -8
    wrongToken: PropTypes.string.isRequired,
    // -9
    alreadyVerified: PropTypes.string.isRequired,
    // -10
    notVerified: PropTypes.string.isRequired,
    // -11
    improperMail: PropTypes.string.isRequired,
    // -12
    unknownConnection: PropTypes.string.isRequired,
    // -13
    untrustedConnection: PropTypes.string.isRequired,
    // -14
    tooShortPassword: PropTypes.string.isRequired
  }).isRequired,
  messages: PropTypes.shape({
    registerSuccess: PropTypes.string.isRequired,
    verifySuccess: PropTypes.string.isRequired,
    allowSuccess: PropTypes.string.isRequired,
    updateUserSuccess: PropTypes.string.isRequired,
    changePasswordSuccess: PropTypes.string.isRequired,
    resetSuccess: PropTypes.string.isRequired
  }).isRequired,
  captions: PropTypes.shape({
    changePassword: PropTypes.string.isRequired,
    resetPassword: PropTypes.string.isRequired
  }).isRequired
});

export const codeToString = (error, time, language) => {
  switch (error) {
    case 0: {
      return undefined;
    }
    case -1: {
      return language.errors.uniqueMail;
    }
    case -2: {
      return language.errors.serverFailure;
    }
    case -3: {
      return language.errors.wrongCredentials;
    }
    case -4: {
      return language.errors.tooManyAttempts + time.substr(2);
    }
    case -5: {
      return language.errors.emptyCredentials;
    }
    case -6: {
      return language.errors.differentPasswords;
    }
    case -7: {
      return language.errors.mailError;
    }
    case -8: {
      return language.errors.wrongToken;
    }
    case -9: {
      return language.errors.alreadyVerified;
    }
    case -10: {
      return language.errors.notVerified;
    }
    case -11: {
      return language.errors.improperMail;
    }
    case -12: {
      return language.errors.unknownConnection;
    }
    case -13: {
      return language.errors.untrustedConnection;
    }
    case -14: {
      return language.errors.tooShortPassword;
    }
    default: {
      return language.errors.default;
    }
  }
};

export const Connection = {
  BASE_URL: "https://l8zby.sse.codesandbox.io/",
  AUDIENCE: "compassionate-volhard-l8zby",
  SENDER: "happy-frog-vg06i",
  ENDPOINTS: {
    LOGIN: "login/",
    REGISTER: "register/",
    RESET_GET: "reset/get/",
    VERIFY: "verify/",
    ALLOW: "allow/"
  }
};

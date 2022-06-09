const ERROR_ENUM = {
    BAD_CREDENTIALS: 'Fel användarnamn eller lösenord',
    SERVER_ERROR: 'Internal server error',
    MISSING_USERNAME: 'Användarnamn saknas',
    USERNAME_TO_SHORT: 'Användarnamn måste vara minst 3 tecken',
    USERNAME_TO_LONG: 'Användarnamn för långt (max 10)',
    USERNAME_TAKEN: 'Användarnamn upptaget.',
    EMAIL_TAKEN: 'Email används redan',
    USER_NOT_FOUND: 'Användare hittades inte.',
    MISSING_PASSWORD: 'Lösenord saknas',
    PASSWORD_TO_SHORT: 'Lösenordet måste vara minst 3 tecken.',
    PASSWORD_TO_LONG: 'Lösenordet för långt (max 30)',
    PASSWORD_NO_MATCH: 'Lösenorden matchar inte',
    NO_TEAMOWNER_MESSAGE: 'Endast teamägare kan byta generera ny barrunda, gåt till Web-applikationen för att lämna ditt team.',
    UNAUTHORIZED: 'unauthorized_client',
    INVALID_EMAIL_ADDRESS: "Ogiltig e-postadress",
    TEAMNAME_TO_SHORT: "Team namn för kort (min 2).",
    TEAMNAME_TO_LONG: "Team name för långt (max 20).",
    JOIN_TEAM_NOT_EXIST: "Teamet du vill joina finns inte.",
    ERROR_BCRYPT: "Felaktigt lösenord",
    TEAM_NAME_TAKEN: "Team namn upptaget"

}

module.exports = ERROR_ENUM;

const ERROR_ENUM = {
    SERVER_ERROR: 'Internal server error',
    EMAIL_TAKEN: 'Email används redan',
    USERNAME_TAKEN: 'Användarnamn upptaget.',
    USER_NOT_FOUND: 'Användare hittades inte.',
    UNAUTHORIZED: 'unauthorized_client',
    TEAM_NOT_FOUND: "Teamet du vill joina finns inte.",
    TEAM_NAME_TAKEN: "Team namn upptaget",
    PUBCRAWL_NOT_FOUND: "Barrundan hittades inte",
    NO_PUBCRAWL_FOR_ACCOUNT: "Ingen barrunda för kontot hittades"
}

module.exports = ERROR_ENUM;
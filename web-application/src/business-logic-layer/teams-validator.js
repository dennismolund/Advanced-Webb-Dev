const {TEAMNAME_TO_SHORT, TEAMNAME_TO_LONG} = require("../business-logic-layer/models/error_enum")

const validTeamName = (name) => {
    if (name.length > 20) throw new Error(TEAMNAME_TO_LONG);
    else if (name.length < 2) throw new Error(TEAMNAME_TO_SHORT);
}

module.exports = {
    validTeamName,
}
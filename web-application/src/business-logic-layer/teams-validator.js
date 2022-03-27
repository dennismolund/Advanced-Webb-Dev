const validTeamName = (name) => {
    if (name.length > 20) throw new Error('Team name cannot be longar than 20 character.');
    else if (name.length < 2) throw new Error('Team name cannot be shorter than 2 characters.')
}

module.exports = {
    validTeamName,
}
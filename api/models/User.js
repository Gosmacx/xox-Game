class User {
    constructor(id, username, role) {
        this.id = id;
        this.username = username;
        this.role = role
        this.moves = []
    }
}

module.exports = User

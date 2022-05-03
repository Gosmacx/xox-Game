class Room {
    constructor(id) {
        this.x = null
        this.o = null
        this.id = id
        this.moves = []
        this.turn = null
    }

    getPlayer(id) {
        if (this.o.id == id) return this.o
        else return this.x
    }
}


module.exports = Room
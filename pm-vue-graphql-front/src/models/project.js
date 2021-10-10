export default class Project {
    id
    title
    pages

    constructor(data) {
        this.id = data.id
        this.title = data.title
        this.pages = []
    }
}
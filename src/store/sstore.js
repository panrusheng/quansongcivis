import {observable, action} from "mobx";

class SStore {
    @observable author = 'none'
    @action
    setAuthor(author){
        this.author = author
    }
    @observable authors_story = []
    @action 
    setAuthorsStory(authors){
        this.authors_story = authors
    }
}

const sStore = new SStore()
export default sStore
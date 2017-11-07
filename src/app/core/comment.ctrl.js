
export default class CommentCtrl {

	constructor() {
		this.editing = false;
	}

	editComment() {
		this.updatedComment = this.comment.message;
		this.editing = true;
	}

	saveComment() {
		this.comment.message = this.updatedComment;
		this.editing = false;
	}

	cancelEdit() {
		this.editing = false;
	}
}
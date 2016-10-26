const BUTTON_IDLE = 0;
const BUTTON_PROCESSING = 1;
const BUTTON_SUCCESS = 2;
const BUTTON_FAILURE = 3;

class EmojiText extends React.Component {
    render() {
        const innerHTML = {
            __html: emojione.shortnameToImage(this.props.value)
        };

        return (<span onClick={this.props.onClick} className={this.props.className}><span dangerouslySetInnerHTML={innerHTML} /></span>);
    }
}

EmojiText.PropTypes = {
    value: React.PropTypes.string
};

class Comment extends React.Component {
    render() {
        return (
            <div className="row">
                <div className="col-xs-12">
                    <div className="">
                        <div className="pull-xs-left">
                            { !this.props.isCurrentUser ?
                            <div className="btn-group-vertical comment-vote-controls">
                                <button className="btn btn-secondary">
                                    <i className="fa fa-arrow-up" />
                                </button>
                                <button className="btn btn-secondary">
                                    <i className="fa fa-arrow-down" />
                                </button>
                            </div> : null }
                        </div>
                        <div className="">
                            <span><strong>{this.props.name}</strong></span>
                            { this.props.isCurrentUser ?
                            <span className="text-muted"> (You)</span> : null }
                            <p>{this.props.comment}</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

class Story extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            story: {},
            author: {},
            prompt: {},
            commentIds: [],
            comments: {},
            commentAuthors: {},
            commentButtonState: BUTTON_IDLE
        };

        this.addComment = this.addComment.bind(this);
        this.updateCommentText = this.updateCommentText.bind(this);
        this.loadStory = this.loadStory.bind(this);
        this.storyRequestSuccess = this.storyRequestSuccess.bind(this);
        this.storyRequestFailure = this.storyRequestFailure.bind(this);
        this.getComment = this.getComment.bind(this);
        this.getCommentSubmitButton = this.getCommentSubmitButton.bind(this);
        this.submitComment = this.submitComment.bind(this);
        this.submitCommentFailure = this.submitCommentFailure.bind(this);
        this.submitCommentSuccess = this.submitCommentSuccess.bind(this);
        this.setUpCommentSubmitButtonReset = this.setUpCommentSubmitButtonReset.bind(this);
        this.resetCommentSubmitButton = this.resetCommentSubmitButton.bind(this);
    }

    storyRequestSuccess(response) {
        let commentAuthors = response.comment_authors || [];

        /* Add a record for the current user to comment authors */
        if (this.props.user) {
            const currentUserId = 'current';
            commentAuthors[currentUserId] = {
                id: currentUserId,
                username: this.props.user.username,
            };
        }

        const newState = {
            loaded: true,
            story: response.story,
            author: response.author,
            prompt: response.prompt,
            commentIds: response.comment_ids,
            comments: response.comments,
            commentAuthors: commentAuthors,
            commentButtonState: BUTTON_IDLE
        };

        this.setState(newState);
    }

    storyRequestFailure(response) {
        //TODO(nathan): Show error message or retry with exponential falloff
        console.log("Loading story failed");
        console.table(response);
    }

    loadStory() {
        const data = { id: this.props.storyId };
        this.storyRequest = $.get('/api/story', data)
            .done((response) => {
                if (response.success)
                    this.storyRequestSuccess(response);
                else
                    this.storyRequestFailure(response);
            })
            .fail(this.storyRequestFailure)
    }

    componentDidMount() {
        this.loadStory();
    }

    componentWillUnmount() {
        if (this.storyRequest)
            this.storyRequest.abort();

        if (this.submitCommentRequest)
            this.submitCommentRequest.abort();
    }

    updateCommentText(event) {
        this.setState({
            commentText: event.target.value
        });
    }

    addComment(event) {
        // Submit the new comment to the server
        this.submitComment();

        // Mock comment on the page, and reset comment form
        // This just needs to not collide with the proper ids
        let randCommentId = 'new-' + (Math.random() * 9999999);

        let comment = {
            id: randCommentId,
            text: this.state.commentText,
            user_id: 'current' //TODO(nathan): Set the current user id
        };

        let comments = this.state.comments;
        comments[randCommentId] = comment;

        let commentIds = this.state.commentIds;
        commentIds.push(randCommentId);

        this.setState({
            comments: comments,
            commentIds: commentIds,
            commentText: '' //Clear input
        });
    }

    getComment(commentId) {
        const c = this.state.comments[commentId];
        const ca = this.state.commentAuthors[c.user_id];

        const props = {
            key: c.id,
            name: ca.username,
            comment: c.text,
            isCurrentUser: !!(this.props.user && ca.username === this.props.user.username)
        };

        return <Comment { ...props } />;
    }

    resetCommentSubmitButton() {
        this.setState({ commentButtonState: BUTTON_IDLE });
    }

    getCommentSubmitButton() {
        switch (this.state.commentButtonState) {
            case BUTTON_IDLE:
                return <button type="button" className="btn btn-primary btn-block m-t-1" onClick={this.addComment}>Submit</button>;
            case BUTTON_PROCESSING:
                return (
                    <button type="button" className="btn btn-primary btn-block m-t-1" readOnly>
                        <i className="fa fa-circle-o-notch fa-spin" /> Submitting&hellip;
                    </button>
                );
            case BUTTON_SUCCESS:
                return (
                    <button type="button" className="btn btn-success btn-block m-t-1" onClick={this.resetCommentSubmitButton}>
                        <i className="fa fa-check" /> Success.
                    </button>
                );
            default:
            case BUTTON_FAILURE:
                return (
                    <button type="button" className="btn btn-danger btn-block m-t-1" onClick={this.resetCommentSubmitButton}>
                        <i className="fa fa-times" /> Something went wrong, please try again.
                    </button>
                );
        }
    }

    setUpCommentSubmitButtonReset() {
        //Set up a timeout for resetting the comment submit button
        if (this.commentButtonResetTimeout)
            clearTimeout(this.commentButtonResetTimeout);

        // 2 second timeout
        this.commentButtonResetTimeout = setTimeout(this.resetCommentSubmitButton, 2000);
    }

    submitCommentSuccess(response) {
        //Comment already mocked, just set button state

        this.setState({
            commentButtonState: BUTTON_SUCCESS
        }, this.setUpCommentSubmitButtonReset);
    }

    submitCommentFailure(response) {
        this.setState({
            commentButtonState: BUTTON_FAILURE
        }, this.setUpCommentSubmitButtonReset);
    }

    submitComment() {
        const data = {
            response_id: this.props.storyId,
            text: this.state.commentText
        };

        this.submitCommentRequest = $.get('/api/comment', data)
            .done((response) => {
                if (response.success)
                    this.submitCommentSuccess(response);
                else
                    this.submitCommentFailure(response);
            })
            .fail(this.submitCommentFailure);

        this.setState({ commentButtonState: BUTTON_PROCESSING });
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-xs-12">
                        <div className="row m-t-1 m-b-1">
                            <div className="col-xs-12">
                                <a href={`/prompt/${this.state.prompt.id}`}>
                                    <i className="fa fa-chevron-left" /> Prompt
                                </a>
                            </div>
                        </div>

                        <div className="row">
                            { this.state.prompt.trove_objects && this.state.prompt.trove_objects.map( to =>
                            <div className="col-xs-4" key={to.id}>
                                <div className="prompt-image-wrapper" style={{backgroundImage: `url(${to.image_url})`}} />
                            </div> )}
                        </div>
                        <article className="row m-t-1">
                            <div className="col-xs-12">
                                <h2>{ this.state.story.title }</h2>
                                <p>{ this.state.story.text }</p>
                                <div className="btn-group button-row-controls" role="group" aria-label="story controls">
                                    <button type="button" className="btn btn-secondary"><i className="fa fa-arrow-up" /> 12</button>
                                    <button type="button" className="btn btn-secondary"><i className="fa fa-arrow-down" /></button>
                                    <button type="button" className="btn btn-secondary">
                                        <EmojiText value=":thumbsup:" />
                                        <EmojiText value=":grinning:" />
                                        <EmojiText value=":joy:" />
                                        <span> 5</span>
                                    </button>
                                    <span className="read-author">{ this.state.author.username }</span>
                                </div>
                            </div>
                        </article>

                        <section className="row m-t-1">
                            <div className="col-xs-12">
                                { this.state.commentIds.map(cid => this.getComment(cid)) }
                            </div>
                        </section>

                        <section className="row m-t-1">
                            <div className="col-xs-12">
                                <form method="post" action="">
                                    <textarea className="form-control story-comment" onChange={this.updateCommentText} value={this.state.commentText} />
                                    { this.getCommentSubmitButton() }
                                </form>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        );
    }
}

var el = document.getElementById("react-page");

if (el) {
    try {
        let props = JSON.parse(el.getAttribute("data-react-props"));

        ReactDOM.render(<Story { ...props } />, el);
    } catch (e) {
        console.log(e);
    }
}

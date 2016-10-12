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
                            <div className="btn-group-vertical comment-vote-controls">
                                <button className="btn btn-secondary">
                                    <i className="fa fa-arrow-up" />
                                </button>
                                <button className="btn btn-secondary">
                                    <i className="fa fa-arrow-down" />
                                </button>
                            </div>
                        </div>
                        <div className="">
                            <span><strong>{this.props.name}</strong></span>
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
            commentAuthors: {}
        };

        this.addComment = this.addComment.bind(this);
        this.updateCommentText = this.updateCommentText.bind(this);
        this.loadStory = this.loadStory.bind(this);
        this.storyRequestSuccess = this.storyRequestSuccess.bind(this);
        this.storyRequestFailure = this.storyRequestFailure.bind(this);
        this.getComment = this.getComment.bind(this);
    }

    storyRequestSuccess(response) {

        let commentAuthors = response.comment_authors;

        /* Add a record for the current user to comment authors */
        const currentUserId = 'current'; //TODO(nathan): something real?
        commentAuthors[currentUserId] = {
            id: currentUserId,
            username: 'Current User Here', //TODO(nathan): Get proper information for the current user
        };

        const newState = {
            loaded: true,
            story: response.story,
            author: response.author,
            prompt: response.prompt,
            commentIds: response.comment_ids,
            comments: response.comments,
            commentAuthors: commentAuthors
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
    }

    updateCommentText(event) {
        this.setState({
            commentText: event.target.value
        });
    }

    addComment(event) {
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
            comment: c.text
        }

        return <Comment { ...props } />;
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-xs-12">
                        <h2>Story</h2>

                        <div className="row">
                            <div className="col-xs-4">
                                <img className="img-fluid" src="/static/storytrove/images/mockup/i.jpg" />
                            </div>
                            <div className="col-xs-4">
                                <img className="img-fluid" src="/static/storytrove/images/mockup/a.jpg" />
                            </div>
                            <div className="col-xs-4">
                                <img className="img-fluid" src="/static/storytrove/images/mockup/g.jpg" />
                            </div>
                        </div>
                        <article className="row m-t-1">
                            <div className="col-xs-12">
                                <h2>{ this.state.story.title }</h2>
                                <p>{ this.state.story.text }</p>
                                <div className="btn-group button-row-controls" role="group" aria-label="story controls">
                                    <button type="button" className="btn btn-secondary"><i className="fa fa-book" /> 3</button>
                                    <button type="button" className="btn btn-secondary"><i className="fa fa-arrow-up" /> 12</button>
                                    <button type="button" className="btn btn-secondary"><i className="fa fa-arrow-down" /></button>
                                    <button type="button" className="btn btn-secondary">
                                        <EmojiText value=":thumbsup:" />
                                        <EmojiText value=":grinning:" />
                                        <EmojiText value=":joy:" />
                                        <span> 5</span>
                                    </button>
                                    <button type="button" className="btn btn-secondary">{ this.state.author.username }</button>
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
                                    <textarea className="form-control story-comment" onChange={this.updateCommentText} value={this.state.commentText}></textarea>
                                    <button type="button" className="btn btn-primary btn-block m-t-1" onClick={this.addComment}>Submit</button>
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

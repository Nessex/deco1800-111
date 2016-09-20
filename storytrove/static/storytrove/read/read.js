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

class StoryBlock extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
			read: 4,
            votes: 11,
			currentUser: {
				read: false,
				votes: false
			}
        };

		this.toggleRead = this.toggleRead.bind(this);
        this.toggleVote = this.toggleVote.bind(this);
    }

	toggleRead() {
		if(this.state.currentUser.read == false) {
			currentUserNew = this.state.currentUser.clone();
			currentUserNew.read = true;
			this.setState({
				thumbsUp: this.state.read + 1,
				currentUser: currentUserNew
			});
		} else {
			currentUserNew = this.state.currentUser.clone();
			currentUserNew.read = false;
			this.setState({
				currentUser: currentUserNew
			});
		}
	}
	
    toggleVote() {
		if(this.state.currentUser.votes == false) {
			currentUserNew = this.state.currentUser.clone();
			currentUserNew.votes = true;
			this.setState({
				thumbsUp: this.state.votes + 1,
				currentUser: currentUserNew
			});
		} else {
			currentUserNew = this.state.currentUser.clone();
			currentUserNew.votes = false;
			this.setState({
				currentUser: currentUserNew
			});
		}
    }


    render() {
		const btnToggleOnRead = this.state.read ? "btn-toggle-on btn btn-secondary" : "btn btn-secondary";
		const btnToggleOnVote = this.state.votes ? "btn-toggle-on btn btn-secondary" : "btn btn-secondary";
        return (
            <article className="story-block m-b-2">
                <a href="/story/example"><h2>My Story</h2></a>
                <p>Snippet. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laboru&hellip;</p>
                <div className="story-block-footer">
                    <div className="btn-group button-row-controls" role="group" aria-label="story controls">
                        <button type="button" className={btnToggleOnRead} onClick={this.toggleRead}><i className="fa fa-book" /> {this.state.read}</button>
                        <button type="button" className={btnToggleOnVote} onClick={this.toggleVote}><i className="fa fa-arrow-up" /> {this.state.votes}</button>
                        {/* Downvotes intentionally not shown */}
                        <button type="button" className="btn btn-secondary">
                            <EmojiText value=":thumbsup:" />
                            <EmojiText value=":grinning:" />
                            <EmojiText value=":joy:" />
                            <span> 5</span>
                        </button>
                        <button type="button" className="btn btn-secondary">User_1234</button>
                    </div>
                </div>
            </article>
        );
    }
}

class Read extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loaded: true, //TODO default to false once content loaded asynchronously
            storyIds: [],
            stories: {},
            filterReactions: []
        };

        this.toggleReaction = this.toggleReaction.bind(this);
        this.getReactionClass = this.getReactionClass.bind(this);
    }

    toggleReaction(reaction) {
        let reactions = this.state.filterReactions;
        const idx = reactions.indexOf(reaction);

        if (idx >= 0) {
            //Remove existing reaction from set
            reactions.splice(idx, 1);
        } else {
            //Add reaction to set
            reactions.push(reaction);
        }

        this.setState({
            filterReactions: reactions
        });
    }

    getReactionClass(reaction) {
        return this.state.filterReactions.indexOf(reaction) >= 0 ? "reaction-active" : "reaction-inactive";
    }

    render() {
        return (
            <div className="container">
                { !this.state.loaded ?
                <div className="row">
                    <div className="col-xs-12 text-xs-center">
                        <i className="fa fa-circle-o-notch fa-spin fa-2x" />
                    </div>
                </div> : null }

                { this.state.loaded ?
                <div className="row">
                    <div className="col-xs-12">
                        <h2>Read</h2>

                        <div className="row">
                            <div className="col-xs-8 offset-xs-2 emoji-row">
                                <EmojiText className={this.getReactionClass('thumbsup')} onClick={() => this.toggleReaction('thumbsup')} value=":thumbsup:" />
                                <EmojiText className={this.getReactionClass('thumbsdown')} onClick={() => this.toggleReaction('thumbsdown')} value=":thumbsdown:" />
                                <EmojiText className={this.getReactionClass('grinning')} onClick={() => this.toggleReaction('grinning')} value=":grinning:" />
                                <EmojiText className={this.getReactionClass('joy')} onClick={() => this.toggleReaction('joy')} value=":joy:" />
                                <EmojiText className={this.getReactionClass('cry')} onClick={() => this.toggleReaction('cry')} value=":cry:" />
                                <EmojiText className={this.getReactionClass('laughing')} onClick={() => this.toggleReaction('laughing')} value=":laughing:" />
                                <EmojiText className={this.getReactionClass('scream')} onClick={() => this.toggleReaction('scream')} value=":scream:" />
                                <EmojiText className={this.getReactionClass('thinking')} onClick={() => this.toggleReaction('thinking')} value=":thinking:" />
                            </div>
                        </div>

                        <section className="row">
                            <div className="col-xs-12">
                                <StoryBlock />
                                <StoryBlock />
                                <StoryBlock />
                                <StoryBlock />
                                <StoryBlock />
                            </div>
                        </section>
                    </div>

                    <div className="col-xs-12">
                        <div className="row m-t-1">
                            <div className="col-xs-6 text-xs-center">
                                <button type="button" className="btn btn-primary btn-block">
                                    Previous
                                </button>
                            </div>
                            <div className="col-xs-6 text-xs-center">
                                <button type="button" className="btn btn-primary btn-block">
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div> : null }
            </div>
        );
    }
}

ReactDOM.render(<Read />, document.getElementById("react-page"));

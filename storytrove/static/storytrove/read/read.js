// import React from 'react';
// import ReactDOM from 'react-dom';

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
			var currentUserNew = jQuery.extend(true, {}, this.state.currentUser);
			currentUserNew.read = true;
			this.setState({
				read: this.state.read + 1,
				currentUser: currentUserNew
			});
		} else {
			var currentUserNew = jQuery.extend(true, {}, this.state.currentUser);
			currentUserNew.read = false;
			this.setState({
				read: this.state.read - 1,
				currentUser: currentUserNew
			});
		}
	}
	
    toggleVote() {
		if(this.state.currentUser.votes == false) {
			var currentUserNew = jQuery.extend(true, {}, this.state.currentUser);
			currentUserNew.votes = true;
			this.setState({
				votes: this.state.votes + 1,
				currentUser: currentUserNew
			});
		} else {
			var currentUserNew = jQuery.extend(true, {}, this.state.currentUser);
			currentUserNew.votes = false;
			this.setState({
				votes: this.state.votes - 1,
				currentUser: currentUserNew
			});
		}
    }

    render() {
		const btnToggleOnRead = this.state.currentUser.read ? "btn-toggle-on btn btn-secondary" : "btn btn-secondary";
		const btnToggleOnVote = this.state.currentUser.votes ? "btn-toggle-on btn btn-secondary" : "btn btn-secondary";
        return (
            <article className="story-block m-b-2">
                <a href="/story/example"><h2>{ this.props.story.title }</h2></a>
                <p>{ this.props.story.truncated_text }&hellip;</p>
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
            loaded: false,
            storyIds: [/* "123" */],
            stories: {
                /*
                 * "123": {
                 *     votedUp: false,
                 *     votedDown: false,
                 *     reactions: [],
                 *     title: "",
                 *     votes: 0,
                 *     author: "",
                 *     truncated_text: ""
                 * }
                 */
            },
            filterReactions: []
        };

        this.toggleReaction = this.toggleReaction.bind(this);
        this.getReactionClass = this.getReactionClass.bind(this);
        this.getStoryBlock = this.getStoryBlock.bind(this);
        this.addReaction = this.addReaction.bind(this);
        this.removeReaction = this.removeReaction.bind(this);
        this.voteUp = this.voteUp.bind(this);
        this.voteDown = this.voteDown.bind(this);
        this.loadStories = this.loadStories.bind(this);
        this.loadStoriesSuccess = this.loadStoriesSuccess.bind(this);
        this.loadStoriesFailure = this.loadStoriesFailure.bind(this);
    }

    loadStoriesSuccess(response) {
        console.log("New stories loaded");
        let storyIds = [];
        let stories = {};

        response.stories.forEach(s => {
            storyIds.push(s.id);
            stories[s.id] = s;
        });

        this.setState({
            loaded: true,
            storyIds: storyIds,
            stories: stories
        })
    }

    loadStoriesFailure(response) {
        //TODO(nathan): Show error message or retry with exponential falloff
        console.log("Loading stories failed");
        console.table(response);
    }

    loadStories() {
        const data = {
            reaction: this.state.filterReactions.length > 0 ? this.state.filterReactions[0] : undefined
        };

        this.loadStoriesRequest = $.get('/api/stories', data)
            .done((response) => {
                if (response.success)
                    this.loadStoriesSuccess(response);
                else
                    this.loadStoriesFailure(response);
            })
            .fail(this.loadStoriesFailure);
    }

    componentDidMount() {
        this.loadStories();
    }

    componentWillUnmount() {
        if (this.loadStoriesRequest)
            this.loadStoriesRequest.abort();
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

    getStoryBlock(storyId) {
        const props = {
            key: storyId, //Required for react
            storyId: storyId,
            story: this.state.stories[storyId],
            addReaction: this.addReaction,
            removeReaction: this.removeReaction,
            voteUp: this.voteUp,
            voteDown: this.voteDown
        };

        return <StoryBlock { ...props } />
    }

    addReaction(storyId, reaction) {
        if (this.state.stories[storyId].reactions.indexOf(reaction) >= 0)
            return; //Already added

        let newState = React.addons.update(this.state, {
            stories: {
                [storyId]: {
                    reactions: { $push: [reaction] }
                }
            }
        });

        this.setState(newState);
    }

    removeReaction(storyId, reaction) {
        let reactions = this.state.stories[storyId].reactions;
        const idx = reactions.indexOf(reaction);
        reactions.splice(idx, 1);

        let newState = React.addons.update(this.state, {
            stories: {
                [storyId]: {
                    reactions: reactions
                }
            }
        });

        this.setState(newState);
    }

    voteUp(storyId) {
        let newState = React.addons.update(this.state, {
            stories: {
                [storyId]: {
                    votedDown: false,
                    votedUp: true
                }
            }
        });

        this.setState(newState);
    }

    voteDown(storyId) {
        let newState = React.addons.update(this.state, {
            stories: {
                [storyId]: {
                    votedDown: true,
                    votedUp: false
                }
            }
        });

        this.setState(newState);
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

                        <div className="row m-t-1">
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
                                { this.state.storyIds.map(id => this.getStoryBlock(id)) }
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

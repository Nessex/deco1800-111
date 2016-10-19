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
                <a href={`/story/${ this.props.story.id }` }><h2>{ this.props.story.title }</h2></a>
                <p>{ this.props.story.text }&hellip;</p>
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
                 *     text: ""
                 * }
                 */
            },
            filterReactions: [],
            resultOffset: 0,
            totalResults: 0,
            resultsPerPage: 5
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
        this.getStories = this.getStories.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.prevPage = this.prevPage.bind(this);
    }

    loadStoriesSuccess(response) {
        let storyIds = [];
        let stories = {};

        response.stories.forEach(s => {
            storyIds.push(s.id);
            stories[s.id] = s;
        });

        this.setState({
            loaded: true,
            storyIds: storyIds,
            stories: stories,
            totalResults: response.stories.length
        });
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

        this.setState({ loaded: false });
    }

    componentDidMount() {
        this.loadStories();
    }

    componentWillUnmount() {
        if (this.loadStoriesRequest)
            this.loadStoriesRequest.abort();
    }

    toggleReaction(reaction) {
        let reactions = []; //Default to removing reactions

        if (this.state.filterReactions.indexOf(reaction) < 0) {
            //Add reaction to set
            reactions = [reaction];
        }

        this.setState({
            filterReactions: reactions
        }, () => this.loadStories());
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

    getStories() {
        let out = [];
        let end = this.state.resultOffset + this.state.resultsPerPage;

        if (end > this.state.totalResults)
            end = this.state.totalResults;

        for (let i = this.state.resultOffset; i < end; i++) {
            out.push(this.getStoryBlock(this.state.storyIds[i]));
        }

        return out;
    }

    nextPage() {
        let newOffset = Math.min(this.state.totalResults - this.state.resultsPerPage, this.state.resultOffset + this.state.resultsPerPage);

        this.setState({
            resultOffset: newOffset
        });
    }

    prevPage() {
        let newOffset = Math.max(0, this.state.resultOffset - this.state.resultsPerPage);

        this.setState({
            resultOffset: newOffset
        });
    }

    render() {
        const previousDisabled = this.state.resultOffset === 0 ? { disabled: 'disabled' } : {};
        const nextDisabled = this.state.totalResults - this.state.resultsPerPage <= this.state.resultOffset ? { disabled: 'disabled' } : {};

        return (
            <div className="container">
                <div className="row">
                    <div className="col-xs-12">
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

                        { this.state.loaded ?
                        <section className="row">
                            { this.state.storyIds.length > 0 ?
                            <div className="col-xs-12">
                                { this.getStories() }
                            </div> : null }

                            { this.state.storyIds.length <= 0 ?
                            <div className="col-xs-12">
                                <div className="alert alert-info">
                                    <span>There are currently no stories with this reaction.</span>
                                    <a href="/browse/" className="btn btn-primary m-l-1">
                                        <i className="fa fa-pencil fa-fw" /> Try writing one
                                    </a>
                                </div>
                            </div> : null }
                        </section> : null }

                         { !this.state.loaded ?
                        <div className="row m-t-3 m-b-3">
                            <div className="col-xs-12 text-xs-center">
                                <i className="fa fa-circle-o-notch fa-spin fa-3x" />
                            </div>
                        </div> : null }
                    </div>

                    <div className="col-xs-12">
                        <div className="row m-t-1">
                            <div className="col-xs-6 text-xs-center">
                                <button type="button" className="btn btn-primary btn-block" { ...previousDisabled } onClick={this.prevPage}>
                                    Previous
                                </button>
                            </div>
                            <div className="col-xs-6 text-xs-center">
                                <button type="button" className="btn btn-primary btn-block" { ...nextDisabled } onClick={this.nextPage}>
                                    Next
                                </button>
                            </div>
                        </div>
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

        ReactDOM.render(<Read { ...props } />, el);
    } catch (e) {
        console.log(e);
    }
}
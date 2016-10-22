class StoryItem extends React.Component {
    render() {
        return (
            <div className="row story-item m-b-2">
                <div className="col-xs-12">
                    <span><strong>{ this.props.title }</strong></span>
                    <p>{ this.props.text }</p>
                    <a href={`/story/${ this.props.id }`}>
                        <span>Continue Reading</span>
                        <i className="fa fa-chevron-right fa-fw" />
                    </a>
                </div>
            </div>
        );
    }
}

StoryItem.PropTypes = {
    title: React.PropTypes.string,
    text: React.PropTypes.string,
    url: React.PropTypes.string
};

class Prompt extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            storyIds: [],
            stories: {
                /* e.g.
                 * id: "1234",
                 * title: "My New Story",
                 * text: "Lorem ipsum dolor sit amet. This is the first few sentences of the story.",
                 * url: "/story/1234"
                 */
            }
        };

        this.getStoryItemProps = this.getStoryItemProps.bind(this);
        this.loadStories = this.loadStories.bind(this);
        this.storiesRequestSuccess = this.storiesRequestSuccess.bind(this);
        this.storiesRequestFailure = this.storiesRequestFailure.bind(this);
    }

    componentWillUnmount() {
        if (this.storiesRequest)
            this.storiesRequest.abort();
    }

    componentDidMount() {
        /* Load in stories and details from the server */
        this.loadStories();
    }

    storiesRequestSuccess(response) {
        let stories = {};
        let storyIds = [];

        response.stories.forEach(s => {
            stories[s.id] = s;
            storyIds.push(s.id);
        });

        const newState = {
            loaded: true,
            stories: stories,
            storyIds: storyIds
        };

        this.setState(newState);
    }

    storiesRequestFailure(response) {
        //TODO(nathan): Show error message or retry with exponential falloff
        console.log("Loading stories failed");
        console.table(response);
    }

    loadStories() {
        this.setState({ loaded: false });

        const data = { prompt_id: this.props.promptId };
        this.storiesRequest = $.get('/api/stories', data)
            .done((response) => {
                if (response.success)
                    this.storiesRequestSuccess(response);
                else
                    this.storiesRequestFailure(response);
            })
            .fail(this.storiesRequestFailure);
    }

    getStoryItemProps(storyId) {
        let props = { key: storyId };
        return Object.assign(props, this.state.stories[storyId]);
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-xs-12">
                        <div className="row m-t-1 m-b-1">
                            <div className="col-xs-12">
                                <a href={`/browse/`}>
                                    <i className="fa fa-chevron-left" /> Browse Prompts
                                </a>
                            </div>
                        </div>

                        <h2>Prompt <span className="text-muted">(#{ this.props.promptId })</span></h2>
                        <div className="row">
                            {this.props.prompt.trove_objects && this.props.prompt.trove_objects.map( to =>
                            <div className="col-xs-4" key={to.id}>
                                <img className="img-fluid" src={to.image_url} />
                            </div> )}
                        </div>
                        <section className="row m-t-1">
                            <div className="col-xs-12">
                                <a href={`/write/${this.props.promptId}`} className="btn btn-primary btn-block">Write a story</a>
                                
                                <section className="m-t-1">
                                    { this.state.storyIds.map(sid => <StoryItem { ...this.getStoryItemProps(sid) } />)}
                                </section>
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

        ReactDOM.render(<Prompt { ...props } />, el);
    } catch (e) {
        console.log(e);
    }
}
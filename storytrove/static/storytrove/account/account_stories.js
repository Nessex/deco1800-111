class AccountStory extends React.Component {
    render() {
        return (
            <article className="account-story m-t-2">
                <h4>{ this.props.title }</h4>
                <p>{ this.props.text }</p>
                <a href={`/story/${ this.props.id }`}>Read More <i className="fa fa-chevron-right fa-fw" /></a>
            </article>
        );
    }
}

AccountStory.PropTypes = {
    title: React.PropTypes.string,
    preview: React.PropTypes.string
};

class AccountStories extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            storyIds: [],
            stories: {}
        };

        this.getStoryProps = this.getStoryProps.bind(this);
        this.getStories = this.getStories.bind(this);
        this.getStoriesSuccess = this.getStoriesSuccess.bind(this);
        this.getStoriesFailure = this.getStoriesFailure.bind(this);
    }

    componentDidMount() {
        /* Load in stories and details from the server */
        this.getStories();
        
        //Example data
        this.setState({
            storyIds: [],
            stories: {}
        });
    }

    componentWillUnmount() {
        if (this.getStoriesRequest)
            this.getStoriesRequest.abort();
    }

    getStories() {
        let data = {
            author: 'current'
        };

        this.getStoriesRequest = $.get('/api/stories', data)
            .done((response) => {
                if (response.success)
                    this.getStoriesSuccess(response);
                else
                    this.getStoriesFailure(response);
            })
            .fail(this.getStoriesFailure);
    }

    getStoriesSuccess(response) {
        let stories = {};
        let storyIds = [];

        response.stories.forEach(s => {
            stories[s.id] = s;
            storyIds.push(s.id);
        });

        this.setState({
            loading: false,
            stories: stories,
            storyIds: storyIds
        });
    }

    getStoriesFailure(response) {
        //TODO(nathan): Show error message or retry with exponential falloff
        console.log("Retrieving stories failed");
        console.table(response);
    }

    getStoryProps(storyId) {
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
                                <a href="/account/">
                                    <i className="fa fa-chevron-left" /> Account
                                </a>
                            </div>
                        </div>

                        <h2>Your Stories</h2>
                        
                        <section className="m-t-1">
                            { this.state.storyIds.map(sid => <AccountStory { ...this.getStoryProps(sid) } />) }
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

        ReactDOM.render(<AccountStories { ...props } />, el);
    } catch (e) {
        console.log(e);
    }
}

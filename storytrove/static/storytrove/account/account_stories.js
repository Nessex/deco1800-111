class AccountStory extends React.Component {
    render() {
        return (
            <article className="account-story">
                <h4>{ this.props.title }</h4>
                <p>{ this.props.text }</p>
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
            storyIds: ["1234", "5678"],
            stories: {
                "1234": {
                    id: "1234",
                    title: "My New Story",
                    preview: "Lorem ipsum dolor sit amet. This is the first few sentences of the story.",
                    url: "/story/1234"
                },
                "5678": {
                    id: "5678",
                    title: "My Second New Story",
                    preview: "Lorem ipsum Dolore dolore dolor consectetur labore qui labore laboris veniam magna labore reprehenderit.",
                    url: "/story/5678"
                }
            }
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

ReactDOM.render(<AccountStories />, document.getElementById("react-page"));

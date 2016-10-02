class AccountStory extends React.Component {
    render() {
        return (
            <article className="account-story">
                <h4>{ this.props.title }</h4>
                <p>{ this.props.preview }</p>
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
            storyIds: [],
            stories: {}
        };

        this.getStoryProps = this.getStoryProps.bind(this);
    }

    componentDidMount() {
        /* Load in stories and details from the server */
        
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

    getStoryProps(storyId) {
        let props = { key: storyId };
        return Object.assign(props, this.state.stories[storyId]);
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-xs-12">
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

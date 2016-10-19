class StoryItem extends React.Component {
    render() {
        return (
            <div className="row story-item">
                <div className="col-xs-12">
                    <span><strong>{ this.props.title }</strong></span>
                    <p>{ this.props.preview }</p>
                    <a href="">Continue Reading</a>
                </div>
            </div>
        );
    }
}

StoryItem.PropTypes = {
    title: React.PropTypes.string,
    preview: React.PropTypes.string, /* ellipsed string */
    url: React.PropTypes.string
}

class Prompt extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            storyIds: [],
            stories: {
                /* e.g.
                 * id: "1234",
                 * title: "My New Story",
                 * preview: "Lorem ipsum dolor sit amet. This is the first few sentences of the story.",
                 * url: "/story/1234"
                 */
            }
        };

        this.getStoryItemProps = this.getStoryItemProps.bind(this);
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

    getStoryItemProps(storyId) {
        let props = { key: storyId };
        return Object.assign(props, this.state.stories[storyId]);
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-xs-12">
                        <h2>Prompt</h2>
                        <div className="row">
                            <div className="col-xs-4">
                                <img className="img-fluid" src="/static/storytrove/images/mockup/f.jpg" />
                            </div>
                            <div className="col-xs-4">
                                <img className="img-fluid" src="/static/storytrove/images/mockup/d.jpg" />
                            </div>
                            <div className="col-xs-4">
                                <img className="img-fluid" src="/static/storytrove/images/mockup/h.jpg" />
                            </div>
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
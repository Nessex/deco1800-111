class EmojiText extends React.Component {
    render() {
        const innerHTML = {
            __html: emojione.shortnameToImage(this.props.value)
        };

        return (<span dangerouslySetInnerHTML={innerHTML} />);
    }
}

EmojiText.PropTypes = {
    value: React.PropTypes.string
};

class Read extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loaded: true, //TODO default to false
            storyIds: [],
            stories: {}
        };
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
                                <EmojiText value=":thumbsup:" />
                                <EmojiText value=":thumbsdown:" />
                                <EmojiText value=":grinning:" />
                                <EmojiText value=":joy:" />
                                <EmojiText value=":cry:" />
                                <EmojiText value=":laughing:" />
                                <EmojiText value=":scream:" />
                                <EmojiText value=":thinking:" />
                            </div>
                        </div>

                        <section className="row">
                            [Stories Here]
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

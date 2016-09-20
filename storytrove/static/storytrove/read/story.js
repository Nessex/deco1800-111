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

class Story extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-xs-12">
                        <h2>Story</h2>

                        <div className="row">
                            <div className="col-xs-4">
                                <img className="img-fluid" src="/static/storytrove/images/mockup/a.jpg" />
                            </div>
                            <div className="col-xs-4">
                                <img className="img-fluid" src="/static/storytrove/images/mockup/b.jpg" />
                            </div>
                            <div className="col-xs-4">
                                <img className="img-fluid" src="/static/storytrove/images/mockup/c.jpg" />
                            </div>
                        </div>
                        <article>
                            <h2>My Story</h2>
                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                            <div className="btn-group" role="group" aria-label="story controls">
                                <button type="button" className="btn btn-secondary"><i className="fa fa-book" /> 3</button>
                                <button type="button" className="btn btn-secondary"><i className="fa fa-arrow-up" /> 12</button>
                                <button type="button" className="btn btn-secondary"><i className="fa fa-arrow-down" /></button>
                                <button type="button" className="btn btn-secondary">
                                    <EmojiText value=":thumbsup:" />
                                    <EmojiText value=":grinning:" />
                                    <EmojiText value=":joy:" />
                                    <span> 5</span>
                                </button>
                                <button type="button" className="btn btn-secondary">User_1234</button>
                            </div>
                        </article>

                        <section>
                            <div>
                                <h2>Comments</h2>
                            </div>
                            <div>
                                <p>Comment 1</p>
                            </div>
                            <div>
                                <p>Comment 2</p>
                            </div>
                        </section>

                        <section>
                            <form method="post" action="">
                                <textarea className="story-comment"></textarea>
                                <button type="button" className="btn btn-primary">Submit</button>
                            </form>
                        </section>
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<Story />, document.getElementById("react-page"));

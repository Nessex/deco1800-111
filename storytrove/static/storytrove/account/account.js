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

class Account extends React.Component {
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
                        <h2>Manage Account</h2>
                        <div className="row">
                            <section className="col-xs-12 account-overview">
                                <div className="pull-xs-left">
                                    <img src="https://i.redd.it/yy2iqou5xjkx.jpg" className="edit-account-profile-picture" />
                                </div>
                                <div>
                                    <h3>Harambe</h3>
                                    Total Votes: 234<br />
                                    <span><EmojiText value=":thumbsup:" /> 9 </span>
                                    <span><EmojiText value=":joy:" /> 8 </span>
                                    <span><EmojiText value=":cry:" /> 7 </span>
                                </div>
                            </section>
                        </div>
                        <ul>
                            <li><a href="/account/edit/">Edit Details</a></li>
                            <li><a href="/account/achievements/">Achievements</a></li>
                            <li><a href="/account/stories/">Stories</a></li>
                            <li><a href="/account/comments/">Comments</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<Account />, document.getElementById("react-page"));

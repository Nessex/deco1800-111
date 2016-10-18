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
        const userImage = this.props.user_image ? this.props.user_image : '/static/images/empty_user.png';

        return (
            <div className="container">
                <div className="row">
                    <div className="col-xs-12">
                        <h2>Manage Account</h2>
                        <div className="row">
                            <section className="col-xs-12 account-overview">
                                <div className="pull-xs-left">
                                    <img src={userImage} className="edit-account-profile-picture" />
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
                        <div className="list-group m-t-1">
                            <a className="list-group-item list-group-item-action" href="/account/edit/">Edit Details</a>
                            <a className="list-group-item list-group-item-action" href="/account/achievements/">Achievements</a>
                            <a className="list-group-item list-group-item-action" href="/account/stories/">Stories</a>
                            <a className="list-group-item list-group-item-action" href="/account/comments/">Comments</a>
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

        ReactDOM.render(<Account { ...props } />, el);
    } catch (e) {
        console.log(e);
    }
}
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


class EditAccount extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    render() {
        const userImage = this.props.user.image ? this.props.user.image : '/static/images/empty_user.png';

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

                        <h2>Edit Account</h2>
                        <div className="row m-t-1">
                            <section className="col-xs-12 account-overview">
                                <div className="pull-xs-left">
                                    <img src={userImage} className="edit-account-profile-picture" />
                                </div>
                                <div>
                                    <h3>{ this.props.user.username }</h3>
                                    Total Votes: 234<br />
                                    <span><EmojiText value=":thumbsup:" /> 9 </span>
                                    <span><EmojiText value=":joy:" /> 8 </span>
                                    <span><EmojiText value=":cry:" /> 7 </span>
                                </div>
                            </section>
                        </div>
                        <div className="form-group m-t-1">
                            <label htmlFor="password">Change password</label>
                            <input type="password" className="form-control" id="password" placeholder="Type your new password" />

                            <label className="m-t-1" htmlFor="confirm-password">Confirm password</label>
                            <input type="password" className="form-control" id="confirm-password" placeholder="Type your new password again" />

                            <label className="m-t-1" htmlFor="user-image-picker">Profile Picture</label>
                            <p>Change your profile picture at <a href="https://gravatar.com">Gravatar</a></p>

                            <button type="button" className="btn btn-primary m-t-1">
                                Save
                            </button>
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

        ReactDOM.render(<EditAccount { ...props } />, el);
    } catch (e) {
        console.log(e);
    }
}
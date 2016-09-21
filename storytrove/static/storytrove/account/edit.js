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
        return (
            <div className="container">
                <div className="row">
                    <div className="col-xs-12">
                        <h2>Edit Account</h2>
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
                        <div className="form-group">
                            <label htmlFor="password">Change password</label>
                            <input type="password" className="form-control" id="password" placeholder="Type your new password" />

                            <label className="m-t-1" htmlFor="confirm-password">Confirm password</label>
                            <input type="password" className="form-control" id="confirm-password" placeholder="Type your new password again" />

                            <label className="m-t-1" htmlFor="user-image-picker">Profile Picture</label>
                            <input type="file" className="form-control" id="user-image-picker" />

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

ReactDOM.render(<EditAccount />, document.getElementById("react-page"));

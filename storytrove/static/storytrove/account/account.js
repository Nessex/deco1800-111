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

        this.getUserDisplay = this.getUserDisplay.bind(this);
    }

    getUserDisplay() {
        let totalVotes = 0;
        let emojis = {
            '+': ':thumbsup:',
            '-': ':thumbsdown:',
            '1': ':grinning:',
            '2': ':cry:',
            '3': ':laughing:',
            '4': ':scream:',
            '5': ':thinking:'
        };

        if (!this.props.user.reactions)
            return null;

        if (this.props.user.reactions.hasOwnProperty('+'))
            totalVotes += this.props.user.reactions['+'];

        if (this.props.user.reactions.hasOwnProperty('-'))
            totalVotes -= this.props.user.reactions['-'];

        let emojiCounters = Object.keys(this.props.user.reactions).map(r => {
            return (<span><EmojiText value={emojis[r]} /> {this.props.user.reactions[r]}</span>);
        });

        return (
            <div>
                <h3>{ this.props.user.username }</h3>
                Total Votes: { totalVotes }<br />
                { emojiCounters }
            </div>
        );
    }

    render() {
        const userImage = this.props.user.image ? this.props.user.image : '/static/images/empty_user.png';

        return (
            <div className="container">
                <div className="row m-t-1">
                    <div className="col-xs-12">
                        <h2>Manage Account</h2>
                        <div className="row m-t-1">
                            <section className="col-xs-12 account-overview">
                                <div className="pull-xs-left">
                                    <img src={userImage} className="edit-account-profile-picture" />
                                </div>
                                { this.getUserDisplay() }
                            </section>
                        </div>
                        <div className="list-group m-t-1">
                            <a className="list-group-item list-group-item-action" href="/account/password_change/">Change Your Password</a>
							<a className="list-group-item list-group-item-action" href="/logout/">Logout</a>
                            <a className="list-group-item list-group-item-action" href="/account/achievements/">Achievements</a>
                            <a className="list-group-item list-group-item-action" href="/account/stories/">Stories</a>
                            {/*<a className="list-group-item list-group-item-action" href="/account/comments/">Comments</a>*/}
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
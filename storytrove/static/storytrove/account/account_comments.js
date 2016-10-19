class AccountComment extends React.Component {
    render() {
        return (
            <article className="account-comment">
                <p>{ this.props.preview }</p>
                <span className="text-muted">{ this.props.timestamp }</span>
            </article>
        );
    }
}

AccountComment.PropTypes = {
    preview: React.PropTypes.string,
    timestamp: React.PropTypes.string,
    url: React.PropTypes.string
};

class AccountComments extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            commentIds: [],
            comments: {}
        };

        this.getCommentProps = this.getCommentProps.bind(this);
    }

    componentDidMount() {
        /* Load data from the server */

        /* example data */
        this.setState({
            commentIds: ["abc", "def"],
            comments: {
                "abc": {
                    preview: "Bad story",
                    timestamp: "21332442322",
                    url: "/story/2322"
                },
                "def": {
                    preview: "Good story",
                    timestamp: "21342242342",
                    url: "/story/1234"
                }
            }
        });
    }

    getCommentProps(commentId) {
        let props = { key: commentId };
        return Object.assign(props, this.state.comments[commentId]);
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-xs-12">
                        <h2>Your Comments</h2>
                        
                        <section className="m-t-1">
                            { this.state.commentIds.map(cid => <AccountComment { ...this.getCommentProps(cid) } />) }
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

        ReactDOM.render(<AccountComments { ...props } />, el);
    } catch (e) {
        console.log(e);
    }
}

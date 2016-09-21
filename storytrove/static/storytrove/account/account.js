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

class AccountStories extends React.Component {
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
                        <h2>Your Stories</h2>
                        <ul>
                            <li>
                                <p>Hello</p>
                            </li>
                            <li>
                                <p>World</p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<AccountStories />, document.getElementById("react-page"));

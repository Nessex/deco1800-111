class Achievements extends React.Component {
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
                        <h2>Achievements</h2>
                        <ul>
                            <li>
                                <p><strong>Achievement Name</strong></p>
                                <p>Achievement description lorem ipsum dolor sit amet&hellip;</p>
                            </li>
                            <li>
                                <p><strong>Achievement Name</strong></p>
                                <p>Achievement description lorem ipsum dolor sit amet&hellip;</p>
                            </li>
                            <li>
                                <p><strong>Achievement Name</strong></p>
                                <p>Achievement description lorem ipsum dolor sit amet&hellip;</p>
                            </li>
                            <li>
                                <p><strong>Achievement Name</strong></p>
                                <p>Achievement description lorem ipsum dolor sit amet&hellip;</p>
                            </li>
                            <li>
                                <p><strong>Achievement Name</strong></p>
                                <p>Achievement description lorem ipsum dolor sit amet&hellip;</p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<Achievements />, document.getElementById("react-page"));

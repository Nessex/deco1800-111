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
                        [Prompt Images]
                        [Story]
                        [List of Comments]
                        [Comment form]
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<Story />, document.getElementById("react-page"));

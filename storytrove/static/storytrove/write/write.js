class Write extends React.Component {
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
                        <h2>Writing</h2>
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<Write />, document.getElementById("react-page"));

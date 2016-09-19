class Prompt extends React.Component {
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
                        <h2>Prompt</h2>
                        [Images]
                        [List of Stories]
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<Prompt />, document.getElementById("react-page"));

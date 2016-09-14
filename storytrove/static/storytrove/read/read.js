class Read extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    render() {
        return (
            <div className="container homepage">
                <div className="row">
                    <div className="col-xs-12">
                        <h2>Reading</h2>
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<Read />, document.getElementById("react-page"));

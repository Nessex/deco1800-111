class Homepage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    render() {
        return (
            <div className="container homepage">
                <div className="row">
                    <div className="col-xs-6 text-xs-center">
                        <p><i className="fa fa-pencil-square-o fa-4x" aria-hidden="true" /></p>
                        <a href="/browse/" className="btn btn-primary">I want to write!</a>
                    </div>
                    <div className="col-xs-6 text-xs-center">
                        <p><i className="fa fa-book fa-4x" aria-hidden="true" /></p>
                        <a href="/read/" className="btn btn-primary">I want to read!</a>
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<Homepage />, document.getElementById("react-page"));

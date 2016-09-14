class Account extends React.Component {
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
                        <h2>Manage Account</h2>
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<Account />, document.getElementById("react-page"));

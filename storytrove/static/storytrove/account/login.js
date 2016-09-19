class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-xs-6">
                        <h2>Login</h2>

                    </div>
                    <div className="col-xs-6">
                        <h2>Register</h2>

                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<Login />, document.getElementById("react-page"));

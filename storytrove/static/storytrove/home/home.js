class Homepage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    render() {
        return (
            <div className="container homepage">
                <div className="row m-t-3 m-b-3">
                    <div className="col-xs-6 text-xs-center">
                        <a href="/browse/" className="btn btn-primary homepage-button">
                            <p><i className="fa fa-pencil-square-o fa-5x" aria-hidden="true" /></p>
                            <p>I want to write!</p>
                        </a>
                    </div>
                    <div className="col-xs-6 text-xs-center">
                        <a href="/read/" className="btn btn-primary homepage-button">
                            <p><i className="fa fa-book fa-5x" aria-hidden="true" /></p>
                            <p>I want to read!</p>
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}

var el = document.getElementById("react-page");

if (el) {
    try {
        let props = JSON.parse(el.getAttribute("data-react-props"));

        ReactDOM.render(<Homepage { ...props } />, el);
    } catch (e) {
        console.log(e);
    }
}
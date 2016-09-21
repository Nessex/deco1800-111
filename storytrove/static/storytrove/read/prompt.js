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
                        <div className="row">
                            <div className="col-xs-4">
                                <img className="img-fluid" src="/static/storytrove/images/mockup/f.jpg" />
                            </div>
                            <div className="col-xs-4">
                                <img className="img-fluid" src="/static/storytrove/images/mockup/d.jpg" />
                            </div>
                            <div className="col-xs-4">
                                <img className="img-fluid" src="/static/storytrove/images/mockup/h.jpg" />
                            </div>
                        </div>
                        <section className="row m-t-1">
                            <div className="col-xs-12">
                                <a href="/write/" className="btn btn-primary btn-block">Write a story</a>
                                
                                <section className="m-t-1">
                                    [list of stories]
                                </section>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<Prompt />, document.getElementById("react-page"));

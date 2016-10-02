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
                        <a href="" type="button" className="btn btn-primary">
                            <i className="fa fa-chevron-left" /> Back to Prompt
                        </a>
                        <div className="row m-t-1">
                            <div className="col-xs-4">
                                <img className="img-fluid" src="/static/storytrove/images/mockup/i.jpg" />
                            </div>
                            <div className="col-xs-4">
                                <img className="img-fluid" src="/static/storytrove/images/mockup/a.jpg" />
                            </div>
                            <div className="col-xs-4">
                                <img className="img-fluid" src="/static/storytrove/images/mockup/g.jpg" />
                            </div>
                        </div>

                        <div className="row m-t-1">
                            <div className="col-xs-12">
                                <button className="btn btn-default btn-block text-muted">
                                    Show Image Information
                                </button>
                            </div>
                        </div>

                        <div className="row m-t-1">
                            <div className="col-xs-12">
                                <div className="form-group">
                                    <div className="row">
                                        <div className="col-xs-6">
                                            <span className="m-l-1">WPM: 91</span>
                                        </div>
                                        <div className="col-xs-6 text-xs-right">
                                            <span className="m-r-1">Words: 443</span>
                                        </div>
                                    </div>
                                    <textarea className="form-control m-t-1" placeholder="Start typing your story here..." />
                                    <div className="row m-t-1">
                                        <div className="col-xs-6 text-xs-center">
                                            <div className="form-check-inline">
                                                <label className="form-check-label">
                                                    <input className="form-check-input" type="checkbox" checked />
                                                    <span>Public</span>
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-xs-6 text-xs-center">
                                            <div className="form-check-inline">
                                                <label className="form-check-label">
                                                    <input className="form-check-input" type="checkbox" />
                                                    <span>Draft</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <button type="button" className="btn btn-primary btn-block m-t-1">Submit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<Write />, document.getElementById("react-page"));

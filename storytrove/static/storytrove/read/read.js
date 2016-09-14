class Read extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loaded: true, //TODO default to false
            storyIds: [],
            stories: {}
        };
    }

    render() {
        return (
            <div className="container">
                { !this.state.loaded ?
                <div className="row">
                    <div className="col-xs-12 text-xs-center">
                        <i className="fa fa-circle-o-notch fa-spin fa-2x" />
                    </div>
                </div> : null }

                { this.state.loaded ?
                <div className="row">
                    <div className="col-xs-12">
                        <h2>Read</h2>

                        <section className="row">
                            [Stories Here]
                        </section>
                    </div>

                    <div className="col-xs-12">
                        <div className="row m-t-1">
                            <div className="col-xs-6 text-xs-center">
                                <button type="button" className="btn btn-primary btn-block">
                                    Previous
                                </button>
                            </div>
                            <div className="col-xs-6 text-xs-center">
                                <button type="button" className="btn btn-primary btn-block">
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div> : null }
            </div>
        );
    }
}

ReactDOM.render(<Read />, document.getElementById("react-page"));

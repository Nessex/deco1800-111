class Prompt extends React.Component {
    render() {
        return (
            <div className="col-xs-6 col-sm-4 col-md-3 m-t-1 search-result">
                <div className="search-result-inner" style={{backgroundImage: `url(${this.props.thumb})`}}>
                    <a href={this.props.troveUrl}>{this.props.title}</a>
                </div>
            </div>
        );
    }
}

class Browse extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loaded: false,
            results: [],
            resultOffset: 0,
            resultCount: 8,
            queryTags: ['world war 2'],
            queryReactions: []
        };

        this.runSearchTags = this.runSearchTags.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.prevPage = this.prevPage.bind(this);
    }

    runSearchTags() {
        search(this.state.queryTags, this.state.queryReactions)
        .done(response => {
            if (response.failure) {
                //Maybe do something
            } else if (response.success) {
                let works = response.response.response.zone[0].records.work || [];

                //Filter out results that don't have a thumbnail
                let out = works.filter(l => {
                    l.identifier.forEach(id => {
                        if (id.linktype === "thumbnail") {
                            //Add a simpler to access reference to the thumbnail url
                            l.thumb = id.value;
                            return false;
                        }
                    });

                    return true;
                });

                let state = {
                    results: out
                };

                if (this.state.loaded === false)
                    state.loaded = true;

                this.setState(state);
            }
        });
    }

    nextPage() {
        let offset = this.state.resultOffset + this.state.resultCount;

        if (this.state.results.length > offset)
            this.setState({
                resultOffset: offset
            });
    }

    prevPage() {
        let offset = this.state.resultOffset - this.state.resultCount;

        this.setState({
            resultOffset: Math.min(offset, 0)
        });
    }

    componentDidMount() {
        //Run search immediately to populate page
        this.runSearchTags();
    }

    render() {
        let paginatedResults = this.state.results.slice(this.state.resultOffset, this.state.resultOffset + this.state.resultCount);
        let disableNext = this.state.resultOffset + this.state.resultCount >= this.state.results.length;
        let disablePrev = this.state.resultOffset === 0;

        return (
            <div className="container homepage">
                { !this.state.loaded ?
                <div className="row">
                    <div className="col-xs-12 text-xs-center">
                        <i className="fa fa-circle-o-notch fa-spin fa-2x" />
                    </div>
                </div> : null }

                { this.state.loaded ?
                <div className="row">
                    <div className="col-xs-12">
                        <h2>Browse</h2>

                        <section className="row">
                            { paginatedResults.map(r => <Prompt key={r.id} {...r} /> ) }
                        </section>
                    </div>
                    <div className="col-xs-12">
                        <div className="row m-t-1">
                            <div className="col-xs-6 text-xs-center">
                                <button type="button" className="btn btn-primary btn-block" disabled={disablePrev} onClick={this.prevPage}>
                                    Previous
                                </button>
                            </div>
                            <div className="col-xs-6 text-xs-center">
                                <button type="button" className="btn btn-primary btn-block" disabled={disableNext} onClick={this.nextPage}>
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

ReactDOM.render(<Browse />, document.getElementById("react-page"));
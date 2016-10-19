class Prompt extends React.Component {
    render() {
        return (
            <div className="col-xs-6 col-sm-4 col-md-3 m-t-1 search-result">
                <a href="/prompt/example">
                    <div className="search-result-inner" style={{backgroundImage: `url(${this.props.thumb})`}}>
                        &nbsp;
                    </div>
                </a>
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
        this.toggleTag = this.toggleTag.bind(this);
        this.getTagButton = this.getTagButton.bind(this);
    }

    runSearchTags() {
        this.setState({ loaded: false });
        search(this.state.queryTags, this.state.queryReactions, this.state.results.length)
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
                    results: out,
                    loaded: true
                };

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

    toggleTag(tag) {
        let tags = []; //Default to removing the tag

        if (this.state.queryTags.indexOf(tag) < 0) {
            //Add the tag
            tags.push(tag);
        }

        this.setState({
            queryTags: tags
        }, () => this.runSearchTags());
    }

    getTagButton(tag) {
        let label = "";
        let iconClass = "";
        let active = this.state.queryTags.indexOf(tag) >= 0 ? 'active' : '';

        switch(tag) {
            case 'war':
                label = 'War';
                iconClass = 'fighter-jet';
                break;
            case 'death':
                label = 'Death';
                iconClass = 'ge';
                break;
            case 'history':
                label = 'History';
                iconClass = 'history';
                break;
            case 'sports':
                label = 'Sports';
                iconClass = 'ge';
                break;
        }

        return (
            <button type="button" className={`btn btn-secondary ${active}`} onClick={ () => this.toggleTag(tag) }>
                <i className={`fa fa-${iconClass}`} /> {label}
            </button>
        );
    }

    render() {
        let paginatedResults = this.state.results.slice(this.state.resultOffset, this.state.resultOffset + this.state.resultCount);
        let disableNext = this.state.resultOffset + this.state.resultCount >= this.state.results.length;
        let disablePrev = this.state.resultOffset === 0;

        return (
            <div className="container">
                <div className="row">
                    <div className="col-xs-12">
                        <div className="row m-t-1">
                            <div className="col-xs-12 text-xs-center">
                                <div className="btn-group">
                                    { this.getTagButton('war') }
                                    { this.getTagButton('history') }
                                    { this.getTagButton('sports') }
                                    { this.getTagButton('death') }
                                </div>
                            </div>
                        </div>

                        <div className="row m-t-1">
                            <div className="col-xs-12 text-xs-center">
                                <p>Choose an image, and write a story about it.</p>
                            </div>
                        </div>

                        { this.state.loaded ?
                        <section className="row">
                            { paginatedResults.map(r => <Prompt key={r.id} {...r} /> ) }
                        </section> : null }

                        { !this.state.loaded ?
                        <div className="row m-t-3 m-b-3">
                            <div className="col-xs-12 text-xs-center">
                                <i className="fa fa-circle-o-notch fa-spin fa-3x" />
                            </div>
                        </div> : null }
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
                </div>
            </div>
        );
    }
}

var el = document.getElementById("react-page");

if (el) {
    try {
        let props = JSON.parse(el.getAttribute("data-react-props"));

        ReactDOM.render(<Browse { ...props } />, el);
    } catch (e) {
        console.log(e);
    }
}
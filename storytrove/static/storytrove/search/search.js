const API_KEY = "";

/* WARNING: This function comes straight from StackOverflow, TODO: get correct attribution */
function jsonp(url, callback) {
    var callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
    window[callbackName] = function(data) {
        delete window[callbackName];
        document.body.removeChild(script);
        callback(data);
    };

    var script = document.createElement('script');
    script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;
    document.body.appendChild(script);
}

const BUTTON_IDLE = 0;
const BUTTON_PROCESSING = 1;
const BUTTON_DISABLED = 2;

class SearchResult extends React.Component {
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

class Search extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searchText: "",
            queryTags: [],
            queryReactions: [],
            results: [],
            searchButtonState: BUTTON_DISABLED
        };

        this.runSearch = this.runSearch.bind(this);
        this.runSearchTags = this.runSearchTags.bind(this);
        this.updateSearch = this.updateSearch.bind(this);
        this.searchInputKeyPress = this.searchInputKeyPress.bind(this);
        this.getSearchButton = this.getSearchButton.bind(this);
    }

    runSearchTags() {
        this.setState({
            searchButtonState: BUTTON_PROCESSING
        });

        //search(this.state.queryTags, this.state.queryReactions)
        search(['world war 2'],[])
        .done(response => {
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

            this.setState({
                results: out
            });
        })
        .always(() => this.setState({
            searchButtonState: BUTTON_IDLE
        }));
    }

    /* This is still searching using the old query method, replace with runSearchTags */
    runSearch() {
        //Query has to be set to something, or you will get a 400 error
        let query = this.state.searchText ? this.state.searchText : 'brisbane';
        let params = [
            `key=${API_KEY}`,
            "encoding=json",
            "zone=picture",
            `q=${query}`,
            "sortby=relevance",
            "n=50",
            "reclevel=full",
            "l-availability=y",
            "l-format=Unpublished",
            "include=links"
        ];
        let url = "http://api.trove.nla.gov.au/result?" + params.join("&");

        this.setState({
            searchButtonState: BUTTON_PROCESSING
        });

        jsonp(url, (response) => {
            let works = response.response.zone[0].records.work || [];

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

            this.setState({
                results: out,
                searchButtonState: BUTTON_IDLE
            });
        });

    }

    updateSearch(event) {
        this.setState({
            searchText: event.target.value,
            searchButtonState: event.target.value.length > 0 ? BUTTON_IDLE : BUTTON_DISABLED
        });
    }

    searchInputKeyPress(event) {
        //Search on pressing ENTER
        if (event.keyCode === 13) {
            this.runSearch();
        }
    }

    getSearchButton() {
        switch(this.state.searchButtonState) {
            case BUTTON_PROCESSING:
                return (
                    <button className="btn btn-primary" type="button">
                        <i className="fa fa-circle-o-notch fa-spin" /> Searching&hellip; Please wait
                    </button>
                );
            case BUTTON_DISABLED:
                return (
                    <button className="btn btn-primary disabled" disabled type="button">
                        <i className="fa fa-search" /> Search
                    </button>
                );
            case BUTTON_IDLE:
            default:
                return (
                    <button className="btn btn-primary" type="button" onClick={this.runSearch}>
                        <i className="fa fa-search" /> Search
                    </button>
                );
        }
    }

    render() {
        let firstResults = this.state.results.slice(0, 10);
        return (
            <div className="container">
                <div className="row">
                    <div className="col-xs-12">
                        <h2>Search</h2>

                        {/* Search Controls */}
                        <div className="input-group">
                            <input className="form-control" type="text" value={this.state.searchText} onChange={this.updateSearch} onKeyUp={this.searchInputKeyPress} />
                            <span className="input-group-btn">
                                {this.getSearchButton()}
                            </span>
                        </div>

                        <button className="btn btn-primary btn-block m-t-1" onClick={this.runSearchTags}>
                            Search by Tag
                        </button>

                        {/* Search Results - only appears if there are results */}
                        { this.state.results.length > 0 ?
                        <section className="m-t-1">
                            <h3>Results</h3>

                            <div className="row">
                                { this.state.results.map(r => <SearchResult key={r.id} {...r} /> ) }
                            </div>
                        </section> : null }
                    </div>
                </div>
            </div>
        );
    }
}


ReactDOM.render(<Search />, document.getElementById("react-search"));

class Write extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loaded: false,
            prompt: null,
            promptId: null,
            writingStartTime: null,
            storyText: ""
        };

        this.loadPrompt = this.loadPrompt.bind(this);
        this.loadPromptSuccess = this.loadPromptSuccess.bind(this);
        this.loadPromptFailure = this.loadPromptFailure.bind(this);
        this.getWPM = this.getWPM.bind(this);
        this.getWordCount = this.getWordCount.bind(this);
        this.updateStoryText = this.updateStoryText.bind(this);
    }

    updateStoryText(event) {
        let state = {
            storyText: event.target.value
        };

        /* Start the timer for tracking WPM */
        if (this.state.writingStartTime === null)
            state.writingStartTime = Date.now();

        /* Reset the WPM if the textarea is emptied */
        if (event.target.value === "")
            state.writingStartTime = null;

        this.setState(state);
    }

    loadPromptSuccess(response) {
        this.setState({
            loaded: true,
            prompt: response.prompt
        });
    }

    loadPromptFailure(response) {
        //TODO(nathan): Show error message or retry with exponential falloff
        console.log("Loading prompt failed");
        console.table(response);
    }

    loadPrompt(promptId) {
        const data = {
            id: promptId
        };

        this.loadPromptRequest = $.get('/api/prompt', data)
            .done((response) => {
                if (response.success)
                    this.loadPromptSuccess(response);
                else
                    this.loadPromptFailure(response);
            })
            .fail(this.loadPromptFailure);
    }

    componentDidMount() {
        this.loadPrompt(this.props.promptId);
    }

    componentWillUnmount() {
        if (this.loadPromptRequest)
            this.loadPromptRequest.abort();
    }

    getWPM() {
        if (this.state.writingStartTime === null)
            return 0;

        const msecPerMin = 60000;
        const wordCount = this.getWordCount();
        const minutesSinceStart = (Date.now() - this.state.writingStartTime) / msecPerMin;

        if (minutesSinceStart === 0)
            return wordCount;

        return Math.floor(wordCount / minutesSinceStart);
    }

    getWordCount() {
        if (this.state.storyText.length === 0)
            return 0;

        //TODO(nathan): This could probably be more scientific
        return this.state.storyText.split(" ").length;
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
                                            <span className="m-l-1">WPM: { this.getWPM() }</span>
                                        </div>
                                        <div className="col-xs-6 text-xs-right">
                                            <span className="m-r-1">Words: { this.getWordCount() }</span>
                                        </div>
                                    </div>
                                    <textarea className="form-control m-t-1" placeholder="Start typing your story here..." onChange={this.updateStoryText} />
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

var el = document.getElementById("react-page");

if (el) {
    try {
        let props = JSON.parse(el.getAttribute("data-react-props"));

        ReactDOM.render(<Write { ...props } />, el);
    } catch (e) {
        console.log(e);
    }
}

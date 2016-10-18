const BUTTON_IDLE = 0;
const BUTTON_PROCESSING = 1;
const BUTTON_SUCCESS = 2;
const BUTTON_FAILURE = 3;

class Write extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loaded: false,
            prompt: null,
            promptId: null,
            storyId: null, //Will be set if this is an existing story being edited
            writingStartTime: null,
            storyTitle: "",
            storyText: "",
            saving: false,
            saveButtonState: BUTTON_IDLE,
            isDraft: false,
            isPrivate: false
        };

        this.loadPrompt = this.loadPrompt.bind(this);
        this.loadPromptSuccess = this.loadPromptSuccess.bind(this);
        this.loadPromptFailure = this.loadPromptFailure.bind(this);
        this.getWPM = this.getWPM.bind(this);
        this.getWordCount = this.getWordCount.bind(this);
        this.updateStoryText = this.updateStoryText.bind(this);
        this.save = this.save.bind(this);
        this.saveSuccess = this.saveSuccess.bind(this);
        this.saveFailure = this.saveFailure.bind(this);
        this.setUpSaveButtonTimeout = this.setUpSaveButtonTimeout.bind(this);
        this.clearSaveButtonTimeout = this.clearSaveButtonTimeout.bind(this);
        this.getSaveButton = this.getSaveButton.bind(this);
        this.updateStoryTitle = (event) => this.setState({ storyTitle: event.target.value });
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
            prompt: response.prompt,
            promptId: response.prompt.id
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

        if (this.saveRequest)
            this.saveRequest.abort();
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

    save() {
        if (this.state.saving)
            return; //Already saving, shouldn't be hit

        let data = {
            prompt_id: this.state.promptId,
            title: this.state.storyTitle,
            text: this.state.storyText,
            is_draft: this.state.isDraft,
            is_private: this.state.isPrivate
        };

        if (this.state.storyId)
            data.story_id = this.state.storyId;

        this.saveRequest = $.get('/api/respond', data)
            .done((response) => {
                if (response.success)
                    this.saveSuccess(response);
                else
                    this.saveFailure(response);
            })
            .fail(this.saveFailure);

        this.setState({
            saving: true,
            saveButtonState: BUTTON_PROCESSING
        })
    }

    saveSuccess(response) {
        this.setState({
            saving: false,
            saveButtonState: BUTTON_SUCCESS,
            storyId: response.story_id
        }, this.setUpSaveButtonTimeout);
    }

    saveFailure(response) {
        //TODO(nathan): Show error message or retry with exponential falloff
        console.log("Saving failed");
        console.table(response);

        this.setState({
            saving: false,
            saveButtonState: BUTTON_FAILURE
        }, this.setUpSaveButtonTimeout);
    }

    setUpSaveButtonTimeout() {
        if (this.saveButtonReset)
                clearTimeout(this.saveButtonReset);

            this.saveButtonReset = setTimeout(() => this.setState({ saveButtonState: BUTTON_IDLE }), 2000);
    }

    clearSaveButtonTimeout() {
        if (this.saveButtonReset)
            clearTimeout(this.saveButtonReset);

        this.setState({
            saveButtonState: BUTTON_IDLE
        })
    }

    getSaveButton() {
        switch (this.state.saveButtonState) {
            case BUTTON_IDLE:
                return <button type="button" className="btn btn-primary btn-block m-t-1" onClick={this.save}>Save</button>;
            case BUTTON_PROCESSING:
                return (
                    <button type="button" className="btn btn-primary disabled btn-block m-t-1" disabled readOnly>
                        <i className="fa fa-circle-o-notch fa-spin" /> Processing
                    </button>
                );
            case BUTTON_SUCCESS:
                return (
                    <button type="button" className="btn btn-success btn-block m-t-1" onClick={this.clearSaveButtonTimeout}>
                        <i className="fa fa-check" /> Saved
                    </button>
                );
            case BUTTON_FAILURE:
                return (
                    <button type="button" className="btn btn-danger btn-block m-t-1" onClick={this.clearSaveButtonTimeout}>
                        <i className="fa fa-times" /> Error, please try again
                    </button>
                );
        }
    }

    render() {
        const a = this.refs.area;
        let writeBoxStyle = {};

        if (typeof a !== 'undefined') {
            /* This textarea auto grow/shrink workflow is from here: https://chuvash.eu/2011/12/14/the-cleanest-auto-resize-for-a-textarea/
             * The react additions are probably unnecessary.
             */
            const offset = a.offsetHeight - a.clientHeight;

            /* Ugly hack, force override the height temporarily, to allow the textarea to shrink */
            a.style.height = '0';
            const newHeight = (a.scrollHeight + offset) + 'px';
            a.style.height = newHeight;

            writeBoxStyle = {
                height: newHeight
            };
        }

        return (
            <div className="container">
                <div className="row">
                    <div className="col-xs-12">
                        <h2>Writing</h2>
                        <a href={`/prompt/${this.state.promptId}`} type="button" className="btn btn-primary">
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
                                    <input type="text" className="form-control" placeholder="My New Story" onChange={this.updateStoryTitle} style={{ fontWeight: 'bold' }} />
                                    <div className="row m-t-1">
                                        <div className="col-xs-6">
                                            <span className="m-l-1">WPM: { this.getWPM() }</span>
                                        </div>
                                        <div className="col-xs-6 text-xs-right">
                                            <span className="m-r-1">Words: { this.getWordCount() }</span>
                                        </div>
                                    </div>
                                    <textarea ref="area" className="form-control m-t-1 write-story-box" placeholder="Start typing your story here..." onChange={this.updateStoryText} style={writeBoxStyle} />
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
                                    { this.getSaveButton() }
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

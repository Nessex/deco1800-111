const RANK_BRONZE = 0;
const RANK_SILVER = 1;
const RANK_GOLD = 2;

class Achievement extends React.Component {
    render() {
        const mainClass = this.props.earned ? "achievement m-t-1 achievement-earned" : "achievement m-t-1";
        let image = "";

        switch (this.props.rank) {
            case RANK_BRONZE:
                image = "/static/storytrove/images/achievements/bronze.png";
                break;
            case RANK_SILVER:
                image = "/static/storytrove/images/achievements/silver.png";
                break;
            case RANK_GOLD:
                image = "/static/storytrove/images/achievements/gold.png";
                break;
        }

        return (
            <div className={mainClass}>
                <div className="pull-xs-left">
                    <img className="img-fluid" src={image} />
                </div>
                <div className="achievement-text">
                    <span><strong>{this.props.name}</strong></span>&nbsp;
                    {this.props.earned ?
                    <i className="fa fa-check" /> : null }

                    <p>{this.props.description}</p>

                    {this.props.earned ?
                    <span className="text-muted">Earned: {this.props.earned}</span> : null }
                </div>
            </div>
        )
    }
}

class Achievements extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            achievementIds: [],
            achievements: {}
        };

        this.getAchievements = this.getAchievements.bind(this);
        this.getAchievementsSuccess = this.getAchievementsSuccess.bind(this);
        this.getAchievementsFailure = this.getAchievementsFailure.bind(this);
    }

    componentDidMount() {
        this.getAchievements();

        this.setState({
            achievementIds: Object.keys(this.props.achievements)
        })
    }

    getAchievements() {
        this.getAchievementsRequest = $.get('/api/achievements')
            .done((response) => {
                if (response.success)
                    this.getAchievementsSuccess(response);
                else
                    this.getAchievementsFailure(response);
            })
            .fail(this.getAchievementsFailure);
    }

    getAchievementsSuccess(response) {
        let stories = {};
        let storyIds = [];

        response.stories.forEach(s => {
            stories[s.id] = s;
            storyIds.push(s.id);
        });

        this.setState({
            loading: false,
            stories: stories,
            storyIds: storyIds
        });
    }

    getAchievementsFailure(response) {
        //TODO(nathan): Show error message or retry with exponential falloff
        console.log("Retrieving stories failed");
        console.table(response);
    }

    componentWillUnmount() {
        if (this.getAchievementsRequest)
            this.getAchievementsRequest.abort();
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-xs-12">
                        <div className="row m-t-1 m-b-1">
                            <div className="col-xs-12">
                                <a href="/account/">
                                    <i className="fa fa-chevron-left" /> Account
                                </a>
                            </div>
                        </div>

                        <h2>Achievements</h2>
                        { this.state.achievementIds.map(a => <Achievement key={a} {...this.props.achievements[a]} />) }
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

        ReactDOM.render(<Achievements { ...props } />, el);
    } catch (e) {
        console.log(e);
    }
}

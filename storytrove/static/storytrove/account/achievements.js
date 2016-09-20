class Achievement extends React.Component {
    render() {
        const mainClass = this.props.earned ? "achievement m-t-1 achievement-earned" : "achievement m-t-1";
        return (
            <div className={mainClass}>
                <div className="pull-xs-left">
                    <img className="img-fluid" src={this.props.image} />
                </div>
                <div className="achievement-text">
                    <span><strong>{this.props.title}</strong></span>&nbsp;
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
            achievementIds: [1, 2, 3, 4, 5, 6, 7, 8],
            achievements: {
                1: {id: 1, title: "abc", description: "def", image: "/static/storytrove/images/mockup/a.jpg", earned: "2016-04-05"},
                2: {id: 2, title: "abc", description: "def", image: "/static/storytrove/images/mockup/b.jpg", earned: false},
                3: {id: 3, title: "abc", description: "def", image: "/static/storytrove/images/mockup/c.jpg", earned: false},
                4: {id: 4, title: "abc", description: "def", image: "/static/storytrove/images/mockup/d.jpg", earned: "2016-05-11"},
                5: {id: 5, title: "abc", description: "def", image: "/static/storytrove/images/mockup/e.jpg", earned: false},
                6: {id: 6, title: "abc", description: "def", image: "/static/storytrove/images/mockup/f.jpg", earned: false},
                7: {id: 7, title: "abc", description: "def", image: "/static/storytrove/images/mockup/g.jpg", earned: false},
                8: {id: 8, title: "abc", description: "def", image: "/static/storytrove/images/mockup/h.jpg", earned: false}
            }
        };
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-xs-12">
                        <h2>Achievements</h2>
                        { this.state.achievementIds.map(a => <Achievement key={a} {...this.state.achievements[a]} />) }
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<Achievements />, document.getElementById("react-page"));

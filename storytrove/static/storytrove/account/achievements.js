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
            achievements: [
                {title: "abc", description: "def", image: "/static/storytrove/images/mockup/a.jpg", earned: "2016-04-05"},
                {title: "abc", description: "def", image: "/static/storytrove/images/mockup/b.jpg", earned: false},
                {title: "abc", description: "def", image: "/static/storytrove/images/mockup/c.jpg", earned: false},
                {title: "abc", description: "def", image: "/static/storytrove/images/mockup/d.jpg", earned: "2016-05-11"},
                {title: "abc", description: "def", image: "/static/storytrove/images/mockup/e.jpg", earned: false},
                {title: "abc", description: "def", image: "/static/storytrove/images/mockup/f.jpg", earned: false},
                {title: "abc", description: "def", image: "/static/storytrove/images/mockup/g.jpg", earned: false},
                {title: "abc", description: "def", image: "/static/storytrove/images/mockup/h.jpg", earned: false}
            ]
        };
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-xs-12">
                        <h2>Achievements</h2>
                        { this.state.achievements.map(a => <Achievement {...a} />) }
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<Achievements />, document.getElementById("react-page"));

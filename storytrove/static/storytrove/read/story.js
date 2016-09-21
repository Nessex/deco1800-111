class EmojiText extends React.Component {
    render() {
        const innerHTML = {
            __html: emojione.shortnameToImage(this.props.value)
        };

        return (<span onClick={this.props.onClick} className={this.props.className}><span dangerouslySetInnerHTML={innerHTML} /></span>);
    }
}

EmojiText.PropTypes = {
    value: React.PropTypes.string
};

class Comment extends React.Component {
    render() {
        return (
            <div>
                <div>
                    <div className="">
                        <div className="pull-xs-left">
                            <div className="btn-group-vertical comment-vote-controls">
                                <button className="btn btn-secondary">
                                    <i className="fa fa-arrow-up" />
                                </button>
                                <button className="btn btn-secondary">
                                    <i className="fa fa-arrow-down" />
                                </button>
                            </div>
                        </div>
                        <div className="">
                            <span><strong>{this.props.name}</strong></span>
                            <p>{this.props.comment}</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

class Story extends React.Component {
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
                        <h2>Story</h2>

                        <div className="row">
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
                        <article className="row m-t-1">
                            <div className="col-xs-12">
                                <h2>Lucky Break</h2>
                                <p>The family was all there. Mum and Dad, Nan and Pop. Uncle Pete. Cousin Marge and her twins. All to see HIM off. Dave. The bright spark of the family was off to make his fortune in Van Diemen&#x27;s Land. The bastard has them eating out of the palm of his hand.</p>
                                <p>&#x22;Tell us about the captain!&#x22; yells Dad for umpteenth time</p>
                                <p>&#x22;Don&#x27;t know how you&#x27;ll survive without your mum cooking your meals for you&#x22; says Nan</p>
                                <p>&#x22;Hope you stop over in Sydney, be a shame if you wore your hand down to the bone with all the &#x22; Pop starts before being silenced by Nan elbowing him in the ribs.</p>
                                <p>Everyone has something to say. Some joke or appraisal. Everyone except Mum, who is silently crying with a smile on her face. It&#x27;s the perfect family scene. And it&#x27;s pathetic. Not one of them can see through his bullshit. None of them can see him for the liar he is. Except for me. Everything he can do, I can do better. He hasn&#x27;t achieved a god damn thing that I couldn&#x27;t do twice as well. Even this - his &#x22;lucky break&#x22; trip to New Zealand should have been mine. It was my idea to enter, and just his stupid luck to win. Well soon it wouldn&#x27;t matter. It would be six months before he&#x27;d be in a position to send a letter, and a year easy before anyone might suspect that he was missing. They might never realise. &#x22;No doubt he&#x27;s found a lovely Kiwi girl&#x22; Mum&#x27;ll cry and brag. Stupid bint. But for now, I just had to wait. To play my part. Once the distraction was gone, I&#x27;ll be on top. &#x22;Hey don&#x27;t forget to save me some seashells, big brother&#x22;</p>
                                <div className="btn-group button-row-controls" role="group" aria-label="story controls">
                                    <button type="button" className="btn btn-secondary"><i className="fa fa-book" /> 3</button>
                                    <button type="button" className="btn btn-secondary"><i className="fa fa-arrow-up" /> 12</button>
                                    <button type="button" className="btn btn-secondary"><i className="fa fa-arrow-down" /></button>
                                    <button type="button" className="btn btn-secondary">
                                        <EmojiText value=":thumbsup:" />
                                        <EmojiText value=":grinning:" />
                                        <EmojiText value=":joy:" />
                                        <span> 5</span>
                                    </button>
                                    <button type="button" className="btn btn-secondary">User_1234</button>
                                </div>
                            </div>
                        </article>

                        <section className="row m-t-1">
                            <div className="col-xs-12">
                                <Comment name="Jonathon" comment="Overall a solid enough story. The tension is evident all through, and the dialogue is more than passable. Some better pacing wouldn't go amiss - more paragraphs and less standalone lines, and perhaps more clarity in the ending. The author also seems unaware that Van Diemen's Land is Tasmania, not New Zealand." />
                            </div>
                        </section>

                        <section className="row m-t-1">
                            <div className="col-xs-12">
                                <form method="post" action="">
                                    <textarea className="form-control story-comment"></textarea>
                                    <button type="button" className="btn btn-primary btn-block m-t-1">Submit</button>
                                </form>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<Story />, document.getElementById("react-page"));

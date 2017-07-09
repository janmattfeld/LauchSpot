import React, { Component } from 'react';
import {Card, CardMedia, CardTitle} from 'material-ui/Card'

var box_dimension=500;
var card_height=box_dimension;
var card_width=box_dimension;
var card_height_offset=-card_height / 2;
var card_width_offset=-card_width / 2;
var image_height=box_dimension;
var image_width=box_dimension;

var standard_picture_offset=box_dimension / 1.5;

class ArtistCard extends Component {
    render() {
        return (<div style={{position: "absolute", top: "50%", left: "50%"}}>
            <div style={this.props.stylePosition}>
                <Card style={{width: card_width, height: card_height, position: "relative", top: card_height_offset, left: card_width_offset}}
                      containerStyle={{width: card_width, height: card_height}}>
                    <CardMedia
                        mediaStyle={{width: image_width, height: image_height, display: "block"}}
                        overlay={<CardTitle title={this.props.artist.titleName} subtitle={this.props.artist.artist} />}>
                        <img src={this.props.artist.titleCoverUri} alt="pic1"/>
                    </CardMedia>
                </Card>
            </div>
        </div>)
    }
}

class ArtistCards extends Component {
    selectedCardPosition = {position: "relative", top: "0", left: "0"};

    cardPositions = [
        {position: "relative", top: -standard_picture_offset, left: -standard_picture_offset},
        {position: "relative", top: standard_picture_offset, left: -standard_picture_offset},
        {position: "relative", top: standard_picture_offset, left: standard_picture_offset},
        {position: "relative", top: -standard_picture_offset, left: standard_picture_offset}
    ];

    state = {
        previousCardPositions: [
            {position: "relative", top: -standard_picture_offset, left: -standard_picture_offset},
            {position: "relative", top: standard_picture_offset, left: -standard_picture_offset},
            {position: "relative", top: standard_picture_offset, left: standard_picture_offset},
            {position: "relative", top: -standard_picture_offset, left: standard_picture_offset}
        ]
    };

    goalPositions = [
        {position: "relative", top: -standard_picture_offset, left: -standard_picture_offset},
        {position: "relative", top: standard_picture_offset, left: -standard_picture_offset},
        {position: "relative", top: standard_picture_offset, left: standard_picture_offset},
        {position: "relative", top: -standard_picture_offset, left: standard_picture_offset}
    ];

    randomHoverOffset() {
        return -.1 + .2 * Math.random();
    }

    randomStartOffset() {
        return -40 + 80 * Math.random();
    }

    setNewGoalPositions() {
        this.goalPositions = this.cardPositions.map(position => {
            var newLeft = position.left + this.randomStartOffset();
            var newTop = position.top + this.randomStartOffset();

            return {
                position: position.position,
                left: newLeft,
                top: newTop
            }
        });

        setTimeout(() => {
            this.setNewGoalPositions();
        }, 300);
    }

    componentDidUpdate() {
        setTimeout(()=> {
            var cardPositions = [];
            for (var i = 0; i < this.goalPositions.length; i++) {
                var currentPosition = this.state.previousCardPositions[i];
                var goalPosition = this.goalPositions[i];

                var newLeft = currentPosition.left + 0.01 * (goalPosition.left - currentPosition.left);
                var newTop = currentPosition.top + 0.01 * (goalPosition.top - currentPosition.top);

                cardPositions[i] = {
                    ...currentPosition,
                    left: newLeft,
                    top: newTop
                }
            }

            this.setState({
                previousCardPositions: cardPositions
            });
        }, 1);
    }

    componentDidMount() {
        this.setNewGoalPositions();
    }

    render() {
        if(this.objectIsEmpty(this.props.artists)) {
            return <div/>;
        }

        return (<div style={{position: "absolute", top: "50%", left: "50%"}}>
            {this.props.artists["otherSongs"].map((song, index) => {
                return <ArtistCard key={"song" + index} artist={song} stylePosition={this.state.previousCardPositions[index]} />
            })}
            <ArtistCard artist={this.props.artists["selectedSong"]} stylePosition={this.selectedCardPosition}/>
        </div>)
    }

    objectIsEmpty(obj) {
        return obj === null || obj === undefined || Object.keys(obj).length === 0;
    }
}

export default ArtistCards;
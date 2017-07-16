import React, { Component } from 'react';
import {Card, CardMedia, CardTitle} from 'material-ui/Card'

var Vector = require('victor');

var box_dimension=250;
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
    // management
    selectedSongTitleName = null;

    // placement & movement
    selectedCardPosition = new Vector(0, 0);
    initialCardPositions = [
        new Vector(-standard_picture_offset, -standard_picture_offset),
        new Vector(standard_picture_offset, -standard_picture_offset),
        new Vector(standard_picture_offset, standard_picture_offset),
        new Vector(-standard_picture_offset, standard_picture_offset)
    ];
    directionOffsets = [
        new Vector(0, 0),
        new Vector(0, 0),
        new Vector(0, 0),
        new Vector(0, 0)
    ];
    phase = 0;
    phaseOffsets = [ 0, .3, .6, .9 ];
    waveDirection = new Vector(1, 1).norm();

    // view
    state = {
        cardPositions: this.deepCopyVectorArray(this.initialCardPositions)
    };

    deepCopyVectorArray(array) {
        return array.map(vector => vector.clone());
    }

    componentDidUpdate() {
        setTimeout(()=> { 
            var newCardPositions = this.deepCopyVectorArray(this.state.cardPositions); 

            for (var i = 0; i < newCardPositions.length; i++) {
                var newCardPosition = this.initialCardPositions[i].clone();

                this.directionOffsets[i].x += -.01 + .02 * Math.random();
                this.directionOffsets[i].y += -.01 + .02 * Math.random();

                var offset = this.waveDirection.clone().add(this.directionOffsets[i]);
                var scalarOffset = 2 * Math.sin((this.phase + this.phaseOffsets[i]) * 2 * Math.PI);
                offset.x *= scalarOffset;
                offset.y *= scalarOffset;

                newCardPosition.add(offset);

                newCardPositions[i] = newCardPosition;
            }
            this.phase += .001;
 
            this.setState({ 
                cardPositions: newCardPositions 
            }); 
        }, 1);
    }

    resetCardPositions() {
        this.setState({ 
            cardPositions: this.deepCopyVectorArray(this.initialCardPositions) 
        }); 
    }

    resetCardPositionsOnSelf(self) {
        self.setState({ 
            cardPositions: self.deepCopyVectorArray(self.initialCardPositions) 
        }); 
    }

    componentDidMount() {
        this.resetCardPositions();
    }

    getStyleForPosition(vector) {
        return {position: "relative", top: vector.y, left: vector.x};
    }

    render() {
        if (this.objectIsEmpty(this.props.artists)) {
            return <div />;
        }

        if (this.selectedSongTitleName !== this.props.artists.selectedSong.titleName) {
            setTimeout(this.resetCardPositionsOnSelf, 1, this);
            this.selectedSongTitleName = this.props.artists.selectedSong.titleName;
        }

        return (<div style={{position: "absolute", top: "50%", left: "50%"}}>
            {this.props.artists["otherSongs"].map((song, index) => {
                return <ArtistCard key={"song" + index} 
                            artist={song}
                            stylePosition={this.getStyleForPosition(this.state.cardPositions[index])}
                        />
            })}
            <ArtistCard artist={this.props.artists["selectedSong"]}
                            stylePosition={this.getStyleForPosition(this.selectedCardPosition)}
             />
        </div>)
    }

    objectIsEmpty(obj) {
        return obj === null || obj === undefined || Object.keys(obj).length === 0;
    }
}

export default ArtistCards;
import React, { Component } from 'react'
import config from '../config/config';
import Footer from './Footer';
import Header from './Header';
export default class Player extends Component {
    constructor(props) {
        super(props);
        // fetch ongoing video details from localstorage incase user reloads the page and wants to continue watching thesame video or there was a network failure
        let ongoingPlay = JSON.parse(localStorage.getItem("playing"))
        this.state = {
            // this state will store the video id 
            videoId: this.props.match.params.id,
            // this state will store all the video details
            videoData: {},
            // this state will check if the user was  watching the video then reloadied the page and get the time already spent on that video
            previoustime: ongoingPlay ? (ongoingPlay.id === this.getParamsId()) ? ongoingPlay.time : 0 : 0
        };
    }
    async componentDidMount() {
        try {
            console.log("atrt sgsin")
            // this enpoint will fetch the video details, (NOT THE FILE itself, that will be handled later)
            const res = await fetch(`${config.PROENDOINT}/video/${this.state.videoId}/data`);
            const data = await res.json();
            // store the video details
            this.setState({ videoData: data });
        } catch (error) {
            console.log(error);
        }
    }
    /**
    * @returns {integer} the request paramenter (id)
    */
    getParamsId() {
        return parseInt(this.props.match.params.id)
    }
    /**
    * @param {integer} the inital time for that video
    * @returns {object} created culture lesson
    */
    calculatePlaybackTime(currentTime) {
        let wasplayingbefore= JSON.parse(localStorage.getItem('playing'))
        if(wasplayingbefore){
            // if video has played more than 8 seconds before, then we don't just want to 
            // remind the user where they were in the video before reload but also remind the user some parts of the scene they were
            // so we have to take user back 8 seconds for this
            if(wasplayingbefore.time>=8){
                return Math.floor((currentTime / 1000) + this.state.previoustime) - 8
            }
        }
        return Math.floor((currentTime / 1000) + this.state.previoustime)
    }
    render() {
        return (
            <div className="App">
                <Header />
                <header className="App-header">
                    <video

                        onLoadStartCapture={() => {
                            // whenever a video loads, we want to check if it was watched incompletely the last time and make the previous time the current time
                            this.player.currentTime = this.state.previoustime
                        }}
                        onTimeUpdate={(e) => {
                             /**
                             * If current time equals the duration time, then we want to reset the localstorage  and the previoustime state to 0
                             */
                            if(this.player.currentTime >= this.player.duration){
                                localStorage.setItem("playing", JSON.stringify({ id: this.getParamsId(), time: 0 }))
                                this.setState({previoustime:0})
                                
                            }
                            /**
                             * To make the view more resillience, we are storing the time the user have spent viewing a video and the video id in the localstorage,
                             * we can also store this in the database by communicating to our servers using socket connection but for now we store it in the local storage
                           */
                            localStorage.setItem("playing", JSON.stringify({ id: this.getParamsId(), time: this.calculatePlaybackTime(e.timeStamp) }))
                        
                        }}
                           /*
                             * we need to reference the video element since we will need to gain more control over some of its attribute
                           */
                        ref={(ref) => { this.player = ref }} controls crossOrigin="anonymous" >
                        {
                           /*
                             * the sourece of the video file is provided here, (THE VIDEO FILE IS DELIVERED IN BUFFERS  -checkout this link to know more)
                           */
                        }
                        <source src={`${config.PROENDOINT}/video/${this.state.videoId}`} type="video/mp4"></source>
                    </video>
                    <h4>{this.state.videoData.name}</h4>
                </header>
                <Footer />
            </div>
        )
    }
}


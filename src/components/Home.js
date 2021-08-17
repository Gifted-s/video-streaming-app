import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Home extends Component {
    render() {
        return (
            <div className="App App-header">
                <div className="container">
                    <div className="row justify-content-center align-items-center">
                            <Link to={`/player/0`}>
                                <div className="card border-0">
                                    <div className="card-body">
                                       <div className="btn btn-primary">
                                           Begin Stream
                                       </div>
                                    </div>
                                </div>
                            </Link>
                    </div>
                </div>
                
            </div>
        )
    }
}


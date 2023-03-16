
import React, {Component} from 'react';
import { Row, Col } from 'antd';
import axios from "axios";

import SatSetting from './SatSetting';
import SatelliteList from './SatelliteList';
import WorldMap from './WorldMap';
import { SAT_API_KEY, BASE_URL, NEARBY_SATELLITE, STARLINK_CATEGORY } from "../constants";

class Main extends Component {
    state = {
        setting: {},
        satInfo: {},
        satList: [],
        isLoadingList: false
    }

    showNearbySatellite = (setting) => {
        // cb fn -> get settings from the SatSettings
        console.log('show nearby')
        this.setState({
            setting: setting,
            isLoadingList: true
        })
        // fetch sat list from the server
        this.fetchSatellite(setting);
    }

    fetchSatellite = (setting) => {
        // step 1: get sat info from the server
        //  - setting / req info
        // step 2: analyze the response
        //  - case 1: successfully -> pass res to SatList
        //  - case 2: failed -> inform users
        console.log("fetching")
        const { latitude, longitude, elevation, altitude } = setting;
        const url = `${BASE_URL}/${NEARBY_SATELLITE}/${latitude}/${longitude}/${elevation}/${altitude}/${STARLINK_CATEGORY}/&apiKey=${SAT_API_KEY}`;

        this.setState({
            isLoadingList: true
        });

        axios.get(url)
            .then( res => {
                console.log(res.data);
                this.setState({
                    satInfo: res.data,
                    isLoadingList: false
                })
            })
            .catch( error => {
                this.setState({
                    isLoadingList: false
                });
                console.log('err in fetch satellite -> ', error);
            })
    }

    render() {
        const { satInfo, isLoadingList, satList, setting } = this.state;

        return (
            <Row className='main'>
                <Col span={8} className="left-side">
                    <SatSetting onShow={this.showNearbySatellite} />
                    <SatelliteList satInfo={satInfo}
                                   isLoad={isLoadingList}
                                   onShowMap={this.showMap} />
                </Col>
                <Col span={16} className="right-side">
                    <WorldMap satData={satList} observerData={setting} />
                </Col>
            </Row>
        );
    }
    showMap = (selected) => {
        this.setState(preState => ({
            ...preState,
            satList: [...selected]
        }))
    }

}


export default Main;


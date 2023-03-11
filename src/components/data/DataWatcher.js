import { faCloud, faCloudArrowUp, faDraftingCompass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Badge, Button, Chip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AutoSave from "../../AutoSave";
import api from "../../common/api";
import { formatDate } from "../../common/common";
import { loadScans, showScans } from "../../reducer/Scans";
import ScanSelector from "../ScanSelector";
import "./DataWatcher.css";

export default function DataWatcher(props) {
    const laserData = useSelector((state) => state.laserData);
    const scans = useSelector((state) => state.scans);
    const {onDownloaded, onDataAvailable} = props;    
    const [loading, setLoading] = useState(true);
    const [autoSave, setAutoSave] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        let interval = 0;

        async function fetchData() {
            try {
                setLoading(false);
                new api().request("/measuringresult")
                    .then(data => {
                        dispatch(loadScans({scans: data}));
                        setLoading(false);
                    })
                    .catch(err => {
                        console.log(err);
                    });
            } catch (err) {
                console.log(err);
            }
        }
    
        if(loading) {
            fetchData();
        } else {
            interval = setInterval(() => {
                fetchData();
            }, 5000);
        }
        return () => clearInterval(interval);
    });

    const handleLoadClick = (evt) => {
        async function loadMeasurement() {
            try{
                if(scans.measurements.length > 0) {
                    dispatch(showScans({show: true})); 
                }
            } catch (err) {
                console.log(err);
            }
        }
        loadMeasurement();
    }

    const handleSelected = (id) => {
        if(onDataAvailable) {
            onDataAvailable();
        }

        new api().request(`/measuringresult/${id}`)
        .then(data => {
            if(onDownloaded) {
                onDownloaded(id, data);
            }
        })
        .catch(err => {
            console.log(err);
        });
    }

    const countNewScans = () => {
        let count = 0;
        scans.measurements.forEach((m) => {   
            if(!m.state) {
                count++;
            }
        });

        return count;
    }

    const handleAutoSave = (saving) => {
        setAutoSave(saving);
    }

    const renderScanDate = () => {
        if(laserData.endDate !== null) {
            return (<Chip 
                        label={formatDate(laserData.endDate)}  
                        variant="outlined" 
                        sx={{color:"white", marginTop: "-10px"}}
                        icon={(<span className="watcher-auto-save"> {(autoSave) ? (<FontAwesomeIcon icon={faCloudArrowUp} style={{color:"white",fontSize: "large"}} />) : (<FontAwesomeIcon icon={faCloud} style={{color:"#4caf50",fontSize: "large"}} />)} </span>) }
                    />)
        }
    }

    const renderButton = () => {
        let count = countNewScans();
        return (
            <>
                <Button
                    onClick={handleLoadClick}
                    disabled={autoSave}
                >
                    <Badge badgeContent={count} color="primary" >
                        <FontAwesomeIcon icon={faDraftingCompass} className={"watcher-icon " + (autoSave ? "watcher-icon-disabled" : "watcher-icon-enabled")} />     
                    </Badge>
                </Button>
                <ScanSelector onSelected={handleSelected} />
                <AutoSave
                    onSaving={handleAutoSave} 
                />
                {renderScanDate()}
            </>
        )
    }

    return (
        <div>
            {
                (loading) ? 
                (<span>loading...</span>):
                (scans.measurements.length === 0) ?
                (<span>no measurements available...</span>):
                (
                    renderButton()
                )
            }
        </div>
    );
}
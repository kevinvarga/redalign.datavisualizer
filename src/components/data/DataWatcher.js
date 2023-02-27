import { faDraftingCompass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Badge, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AutoSave from "../../AutoSave";
import api from "../../common/api";
import { loadScans, showScans } from "../../reducer/Scans";
import ScanSelector from "../ScanSelector";
import "./DataWatcher.css";

export default function DataWatcher(props) {
    const scans = useSelector((state) => state.scans);
    const {onDownloaded, onDataAvailable} = props;    
    const [loading, setLoading] = useState(true);
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
            console.log(data);
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

    const renderButton = () => {
        let count = countNewScans();
        return (
            <>
                <Button
                    onClick={handleLoadClick}
                >
                    <Badge badgeContent={count} color="primary" >
                        <FontAwesomeIcon icon={faDraftingCompass} className="watcher-icon" />     
                    </Badge>
                </Button>
                <ScanSelector onSelected={handleSelected} />
                <AutoSave />
            </>
        )
    }

    return (
        <div>
            {(loading) ? 
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
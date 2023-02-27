import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import api, { REQUEST_METHOD } from './common/api';
import store from './store';

let previousState;
let previousId;
let uploadTimeout;
let saving = false;

const handleSubscribe = () => {
  let ld = store.getState().laserData;
  let currentState = ld.algorithm;
  let id = ld.id;

  if(id !== previousId) {
    previousId = id;
    previousState = undefined;
  } else {
      if (previousState !== currentState) {
        let saveState = false;
        // only save state when the state is updated
        if(previousState && (Object.keys(previousState).length > 0)) {
            saveState = true;
        }
    
        previousState = currentState;
        if(saveState) {
            saving = true;
            clearTimeout(uploadTimeout);
            uploadTimeout = setTimeout(() => {
                saving = false;
                console.log(`upload results - id: ${id}`);
                let range = {
                    pump: {start: ld.rangeY.pump[0].index, end: ld.rangeY.pump[ld.rangeY.pump.length - 1].index},
                    motor: {start: ld.rangeY.motor[0].index, end: ld.rangeY.motor[ld.rangeY.motor.length - 1].index}
                }; 
    
                new api().request(`/measuringresult/${id}`, null, REQUEST_METHOD.PUT, {
                    algorithm: JSON.stringify(previousState),
                    range: JSON.stringify(range),
                })
                .then(() => {
                    console.log("updated scan");
                })
                .catch(err => {
                    console.log(err);
                });
            }, 5000);
        }
      }
  }
}

// TODO: uncomment to enable uploading results
store.subscribe(handleSubscribe); 

export default function AutoSave() {
    let [isSaving, setIsSaving] = useState(saving);

    useEffect(() => {
        let interval = setInterval(() => {
            if(saving !== isSaving) {
                setIsSaving(saving);
            }
        }, 500);
        return () => clearInterval(interval);
    })

    if(isSaving) {
        return (<span className="watcher-auto-save">
            <FontAwesomeIcon icon={faCloudArrowUp}  /> 
        </span>
        );
    } else {
        return (
            <span className="watcher-auto-save"><label >&nbsp;</label></span>
        );
    }
}
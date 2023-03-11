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
    saving = false;
    clearTimeout(uploadTimeout);
  } else {
      // only save when currentState exists
      if (currentState && (previousState !== currentState)) {
        previousId = id;
        previousState = currentState;

        if(Object.keys(previousState).length > 0) {
            saving = true;
            clearTimeout(uploadTimeout);
            uploadTimeout = setTimeout(() => {
                saving = false;
                console.log(`upload results - id: ${previousId}`);
    
                new api().request(`/measuringresult/${previousId}`, null, REQUEST_METHOD.PUT, {
                    algorithm: JSON.stringify(previousState),
                    ranges: JSON.stringify(ld.ranges),
                    noiseReduction: JSON.stringify(ld.noiseReduction),
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

store.subscribe(handleSubscribe); 

export default function AutoSave(props) {
    let {onSaving} = props;
    let [isSaving, setIsSaving] = useState(saving);

    useEffect(() => {
        let interval = setInterval(() => {
            if(saving !== isSaving) {
                setIsSaving(saving);
            }
        }, 500);
        return () => clearInterval(interval);
    })

    if(onSaving) {
        onSaving(isSaving);
    }

    return (<></>)
}
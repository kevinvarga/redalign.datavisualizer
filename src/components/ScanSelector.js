import { Dialog, DialogActions, DialogTitle, List, ListItem, ListItemButton, ListItemText, Pagination } from "@mui/material";
import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatDate, roundToX } from "../common/common";
import { showScans } from "../reducer/Scans";

export default function ScanSelector(props) {
    const {onSelected} = props;
    const scans = useSelector((state) => state.scans);
    const [page, setPage] = useState(1);
    const dispatch = useDispatch();
    const pageSize = 10;

    const handleClose = (evt) => {
        dispatch(showScans(false));    
    }

    const handlePageChange = (evt, newPage) => {
        setPage(newPage);
    }

    const currentScans =  useMemo(() => {
        const firstPageIndex = (page - 1) * pageSize;
        const lastPageIndex = firstPageIndex + pageSize;
        return scans.measurements.slice(firstPageIndex, lastPageIndex);
      }, [page, scans.measurements]);

    const handleButtonClick = (evt, id) => {
        if(onSelected) {
            onSelected(id);
        }
        dispatch(showScans(false));
    }

    const formatShimValue = (val) =>{
        return roundToX(val, 3).toFixed(3);
    }
    const renderText = (measurement) => {
        let text = `${formatDate(measurement.end)}  `;
        try{
            if(measurement.state) {
                let bfl = measurement.state.algorithm.bestfitline.result;  
                text += `Front V: ${formatShimValue(bfl.frontYShim.converted)}" H: ${formatShimValue(bfl.frontZShim.converted)}" / Rear V: ${formatShimValue(bfl.rearYShim.converted)}" H: ${formatShimValue(bfl.rearZShim.converted)}"`;
            }
        } catch(e) { }
        return text;
    }

    return(
        <Dialog 
            open={scans.show} 
            onClose={handleClose}    
        >
            <DialogTitle>Select Scan</DialogTitle>
            <List>

                {currentScans.map((measurement, index) => {
                    return(
                        <ListItem key={index}>
                            <ListItemButton dense={true} onClick={(evt) => handleButtonClick(evt, measurement._id)} >
                                <ListItemText primary={renderText(measurement)} />
                            </ListItemButton>
                        </ListItem>
                    )
                })}
                                
            </List>
            <DialogActions>
                <Pagination 
                    count={Math.ceil(scans.measurements.length/pageSize)}
                    page={page}
                    onChange={handlePageChange}
                >
                </Pagination>
            </DialogActions>
        </Dialog>
    )
}
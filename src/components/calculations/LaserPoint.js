import { Box } from "@mui/material";
import React from "react";

export default function LaserPoint(props) {
    const {title, point} = props;

    return(
        <Box sx={{padding: "5px"}}>
            <table>
                <tbody>
                    <tr><td colSpan={2} style={{textAlign:"center"}} >{title}</td></tr>
                    <tr><td>x:</td><td style={{textAlign:"left"}}><b>{point.x}</b></td></tr>
                    <tr><td>y:</td><td style={{textAlign:"left"}}><b>{point.y}</b></td></tr>
                    <tr><td>z:</td><td style={{textAlign:"left"}}><b>{point.z}</b></td></tr>
                </tbody>
            </table>
        </Box>
    );
}
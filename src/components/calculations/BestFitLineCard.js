import React from "react";
import { Card, CardContent, CardHeader } from "@mui/material";
import EngineeringIcon from '@mui/icons-material/Engineering';

export default function BestFitLineCard(props){

    return(
        <Card variant="outlined" className="calculated-value-card" >
            <CardContent>
                <CardHeader title="Best Fit Line" subheader="Under construction" avatar={<EngineeringIcon />} />
            </CardContent>
        </Card>
    );
}

/*
{((laserData.selectedY.pump.length > 0) && (laserData.selectedY.motor.length > 0)) ? (
                    <Box >
                        {formatResult(calculate())}
                    </Box>                
                ) : (<label>select pump and motor data</label>)}
*/
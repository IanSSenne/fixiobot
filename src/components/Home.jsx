import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import conf from "../config";
const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    contentpannel: {
        position: "absolute",
        top: "48px",
        left: "0px",
        height: "calc(100vh - 48px)",
        width: "calc(100vw - 400px)"
    }
}));

export default function Homepage() {
    const classes = useStyles();
    return (<div className={classes.contentpannel}>
        <div>

        </div>
    </div>);
}
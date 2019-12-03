import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SettingsCommands from "./_settings/Commands";
const useStyles = makeStyles(theme => ({
    root: {
        position: "absolute",
        top: "48px",
        left: "0px",
        height: "calc(100vh - 48px)",
        overflowY: "scroll",
        width: "calc(100vw - 400px)"
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
}));

export default function Settings() {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);

    const handleChange = panel => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <div className={classes.root}>
            <ExpansionPanel expanded={expanded === 'commands'} onChange={handleChange('commands')}>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                >
                    <Typography className={classes.heading}>commands</Typography>
                    <Typography className={classes.secondaryHeading}>indivisual command settings</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <SettingsCommands></SettingsCommands>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        </div>
    );
}

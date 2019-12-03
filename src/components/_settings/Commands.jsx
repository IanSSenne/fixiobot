import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from "@material-ui/core/Grid"
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import InputAdornment from "@material-ui/core/InputAdornment";
import FormHelperText from "@material-ui/core/FormHelperText";
import TextField from "@material-ui/core/TextField";
import toTime from "to-time";
const CommandTypes = {
    ECHO: 0,
    SWAPIN: 1,
    CUSTOM: 2
}
const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
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

const usePaneStyles = makeStyles(theme => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));
const CommandSettingPane = ({ handleChange, name, current, command, classes }) => {
    const selectClasses = usePaneStyles();
    const [commandName, setCommandName] = React.useState(name);
    const [commandType, setCommandType] = React.useState(CommandTypes.ECHO);
    const [commandCooldown, setCommandCooldown] = React.useState(0);
    const [commandCooldownValue, setCommandCooldownValue] = React.useState('0');
    const handleSelectChange = event => {
        setCommandType(event.target.value);
    };
    const handleNameChange = event => {
        setCommandName(event.target.value);
    }
    return <ExpansionPanel expanded={current === name} onChange={handleChange(name)}>
        <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={name + "-content"}
            id={name + "-content"}
        >
            <Typography className={classes.heading}>!{command.name}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
            <Grid container>
                <Grid item xs>
                    <FormControl className={selectClasses.formControl}>
                        <InputLabel shrink id="demo-simple-select-label">Command Type</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={commandType}
                            onChange={handleSelectChange}
                        >
                            <MenuItem value={CommandTypes.ECHO}>Echo</MenuItem>
                            <MenuItem value={CommandTypes.SWAPIN}>SwapIn</MenuItem>
                            <MenuItem value={CommandTypes.CUSTOM}>Custom</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs>
                    <FormControl className={selectClasses.formControl}>
                        <FormHelperText id="standard-weight-helper-text">command name</FormHelperText>
                        <Input label="Standard" value={commandName} startAdornment={<InputAdornment position="start">!</InputAdornment>} onChange={handleNameChange} />
                    </FormControl>
                </Grid>

                <Grid item xs>
                    <FormControl className={selectClasses.formControl}>
                        <FormHelperText id="standard-weight-helper-text">command cooldown</FormHelperText>
                        <Input label="Standard" value={commandCooldownValue} onChange={(evt) => {
                            setCommandCooldownValue(evt.target.value);
                        }} onBlur={() => {
                            const value = commandCooldownValue;
                            try {
                                console.log(value);
                                setCommandCooldown(toTime(value).toMilliseconds());
                                setCommandCooldownValue(toTime.fromMilliseconds(commandCooldownValue).toString());
                            } catch (e) {
                                setCommandCooldownValue('0h0m0s');
                                setCommandCooldown(0);
                            }
                        }} />
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <hr />
                    {commandType === CommandTypes.ECHO && <div>
                        <Typography type="h5">Echo command settings</Typography>
                        <TextField id="standard-basic" label="chat string" fullWidth />
                    </div>}
                </Grid>
            </Grid>
        </ExpansionPanelDetails>
    </ExpansionPanel>
}
export default function SettingsCommands() {
    const [commandConfig, setCommandConfig] = React.useState(null);
    if (!commandConfig) fetch("/conf/commands.json").then(data => data.json()).then(json => { console.log(json); setCommandConfig(json) });
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);

    const handleChange = panel => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <div className={classes.root}>
            {commandConfig && Object.keys(commandConfig).map((item, index) => {
                return <CommandSettingPane key={index} handleChange={handleChange} name={item} current={expanded} command={{ name: item, ...commandConfig[item] }} classes={classes}></CommandSettingPane>
            })}
        </div>
    );
}

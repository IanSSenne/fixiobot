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
import Button from "@material-ui/core/Button";
import { reload as reloadCommands } from "../../bot/index";
const toTime = window.require("to-time");
const fs = window.require("fs");
const path = window.require("path");
export const CommandTypes = {
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
const CommandSettingPane = ({ handleChange, name, current, command, classes, manifest, setManifest, item, rerender }) => {
    const selectClasses = usePaneStyles();
    const [commandName, setCommandName] = React.useState(name);
    const [commandType, setCommandType] = React.useState(CommandTypes.ECHO);
    const [commandCooldown, setCommandCooldown] = React.useState(0);
    const [commandCooldownValue, setCommandCooldownValue] = React.useState('0s');
    const [loaded, setLoaded] = React.useState(false);
    const [ECHO$message, ECHO$setMessage] = React.useState('');
    const [SWAPIN$message, SWAPIN$setMessage] = React.useState('');
    const [commandNameTemp, setCommandNameTemp] = React.useState(name);
    if (!loaded) {
        if (fs.existsSync(path.resolve(window.process.env.APPDATA, "./fixiobot/commands", "./" + commandName))) {
            const data = JSON.parse(fs.readFileSync(path.resolve(window.process.env.APPDATA, "./fixiobot/commands", "./" + commandName), "utf8"));
            try {
                setCommandCooldown(toTime(data.cooldown).ms());
                setCommandCooldownValue(toTime(data.cooldown).humanize());
            } catch (e) { }
            setCommandType(data.type);
            if (data.type === CommandTypes.ECHO) {
                ECHO$setMessage(data.conf.ECHO.message || "");
            }
            if (data.type === CommandTypes.SWAPIN) {
                SWAPIN$setMessage(data.conf.SWAPIN.message);
            }
        }
        setLoaded(true);
    }
    const updateStoredCommand = () => {
        fs.writeFileSync(path.resolve(window.process.env.APPDATA, "./fixiobot/commands", "./" + commandName), JSON.stringify({ name: commandName, type: commandType, cooldown: commandCooldownValue, conf: { ECHO: { message: ECHO$message }, SWAPIN: { message: SWAPIN$message }, CUSTOM: {} } }));
        setTimeout(reloadCommands, 1000);
    }
    const handleSelectChange = event => {
        setCommandType(event.target.value);
    };
    const handleNameChange = event => {
        let cmdarr = manifest.commands;
        cmdarr[cmdarr.indexOf(commandName)] = event.target.value;
        fs.unlinkSync(path.resolve(window.process.env.APPDATA, "./fixiobot/commands", "./" + commandName));
        setManifest({ ...manifest, commands: cmdarr });
        setCommandName(event.target.value);
        updateStoredCommand();
    }
    const handleNameUpdate = event => {
        setCommandNameTemp(event.target.value);
    }
    return <ExpansionPanel expanded={current === item} onChange={handleChange(item)}>
        <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={name + "-content"}
            id={name + "-content"}
        >
            <Typography className={classes.heading}>!{commandName}</Typography>
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
                            onBlur={updateStoredCommand}
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
                        <Input
                            onBlur={updateStoredCommand}
                            label="Standard"
                            value={commandNameTemp}
                            startAdornment={<InputAdornment position="start">!</InputAdornment>}
                            onChange={handleNameUpdate}
                            onBlur={handleNameChange} />
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
                                setCommandCooldown(toTime(value).ms());
                                setCommandCooldownValue(toTime(value).humanize());
                            } catch (e) {
                                console.log(e);
                                setCommandCooldownValue(toTime('0s').humanize());
                                setCommandCooldown(0);
                            }
                            updateStoredCommand();
                        }} />
                    </FormControl>
                </Grid>
                <Grid>
                    <Button variant="contained" color="secondary" onClick={() => {
                        let cmdarr = manifest.commands;
                        handleChange(false);
                        console.log(cmdarr);
                        cmdarr.splice(cmdarr.indexOf(commandName), 1)
                        console.log(cmdarr);
                        fs.unlinkSync(path.resolve(window.process.env.APPDATA, "./fixiobot/commands", "./" + commandName));
                        updateStoredCommand();
                        setManifest({ ...manifest, commands: cmdarr });
                        rerender();
                    }}>
                        Delete
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <hr />
                    {commandType === CommandTypes.ECHO && <div>
                        <Typography type="h5">Echo command settings</Typography>
                        <TextField id="standard-basic" label="chat string" value={ECHO$message} onChange={(evt) => {
                            ECHO$setMessage(evt.target.value);
                        }} onBlur={() => {
                            updateStoredCommand();
                        }} fullWidth />
                    </div>}
                    {commandType === CommandTypes.SWAPIN && <div>
                        <Typography type="h5">SwapIn command settings</Typography>
                        <Typography variant="caption">NOTE: arguments are in the form of {"{{target index|default value}}"}</Typography>
                        <TextField id="standard-basic" label="chat string" value={SWAPIN$message} onChange={(evt) => {
                            SWAPIN$setMessage(evt.target.value);
                        }} onBlur={() => {
                            updateStoredCommand();
                        }} fullWidth />
                    </div>}
                </Grid>
            </Grid>
        </ExpansionPanelDetails>
    </ExpansionPanel>
}
export default function SettingsCommands({ manifest, setManifest }) {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);
    const [id, setId] = React.useState();
    const handleChange = panel => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };
    const rerender = () => {
        setId(Math.random());
    }
    return (
        <div className={classes.root} id={id}>
            <Button variant="contained" color="primary" onClick={() => {
                if (manifest.commands.includes("NEW-COMMAND")) {
                    setManifest({ ...manifest, commands: [...manifest.commands, "NEW-COMMAND-" + Math.random().toString(36).split(".")[1]] });
                } else {
                    setManifest({ ...manifest, commands: [...manifest.commands, "NEW-COMMAND"] });
                }
            }}>new command</Button>
            {manifest && manifest.commands.map((item, index) => {
                return <CommandSettingPane key={index} item={index} handleChange={handleChange} name={item} current={expanded} command={{ name: item, ...manifest.commands[item] }} classes={classes} manifest={manifest} setManifest={setManifest} rerender={rerender}></CommandSettingPane>
            })}
        </div>
    );
}

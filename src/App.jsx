import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Homepage from './components/Home';
import Settings from './components/Settings';
import conf from "./config";
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  },
  iframe: {
    height: 'calc(100vh - 48px)',
    width: '400px',
    border: 0
  },
  chathost: {
    position: 'absolute',
    top: '48px',
    left: 'calc(100vw - 400px)'
  }
}));

export default function App() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs">
          <Tab label="Home" {...a11yProps(0)} />
          <Tab label="Command Info" {...a11yProps(1)} />
          <Tab label="Settings" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <Homepage></Homepage>
      </TabPanel>
      <TabPanel value={value} index={1}>
        Commands
            </TabPanel>
      <TabPanel value={value} index={2}>
        <Settings></Settings>
      </TabPanel>

      <div className={classes.chathost}>
        <iframe src={`https://www.twitch.tv/embed/${conf.channel}/chat`} title="#twitchchat" className={classes.iframe}></iframe>
      </div>
    </div>
  );
}
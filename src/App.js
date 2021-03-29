import React from 'react';
import { fade, makeStyles } from '@material-ui/core/styles';
import PrimarySearchAppBar from './components/TitleBar';


import MiniDrawer from './components/Layout';

const useStyles = makeStyles(theme => ({
  root: {
    marginLeft: theme.spacing(0),
    marginRight: theme.spacing(0),
    marginTop: theme.spacing(0),
    marginBottom: theme.spacing(2)
  }
}));

function App() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <MiniDrawer />
    </div>

  );
}

export default App;

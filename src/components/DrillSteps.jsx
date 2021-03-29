import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

function getSteps() {
  return ['Year', 'Category', 'Laureates'];
}



export default function HorizontalLabelPositionBelowStepper(props) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  const depthName = props.label.map(val=> <b>: {val}</b>);


  return (
    <div className={classes.root}>
      <Stepper activeStep={props.index} alternativeLabel>
        {steps.map((label,index) => (
          <Step key={label}>
            <StepLabel>{label}{depthName[index]}</StepLabel>
          </Step>
        ))}
      </Stepper>

    </div>
  );
}

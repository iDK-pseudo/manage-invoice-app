import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Logo from '../assets/companyLogo.svg'
import Professor from '../components/Professor'
import Chip from '@material-ui/core/Chip';


const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
    fontSize : 19,
    fontWeight : 'bolder',
    color : 'white'
  },

  banner : {
    borderRadius : 3,
    position : 'fixed',
    top : -2,
    left : '45vw',
    height : '3vh',
    fontSize : '0.8em',
    color : 'white',
    backgroundColor : '#eb7017'
  }
};

class ButtonAppBar extends Component {

  constructor(props){
    super(props);

    this.state = {right: false}
  }

  render () {
  const { classes } = this.props;

  return (
    <div className={classes.root}>
        <Toolbar variant = "dense">
         <img src = {Logo} alt = "CompanyLogo" style = {{width : '2.5vw',marginRight : 10}}/>

          <Typography variant="h6" color="inherit" className={classes.grow}>
            ABC Products
          </Typography>

          <Chip label="Receivables Dashboard" className = {classes.banner}/>

          <Professor/>

        </Toolbar>
    </div>
  );
  }
}

ButtonAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ButtonAppBar);

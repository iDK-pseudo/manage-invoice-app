import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import HeaderCD from '../components/HeaderCD'
import GridCD from '../components/GridCD';
import Footer from '../components/Footer'

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    paddingLeft: '1vw',
    paddingRight: '1vw',
  },
  hellotext: {
    fontSize: '4vw',
    color: '#FFFFFFA6',
    height: '10vh',
  },
  hellotext1: {
    fontSize: '2.5vw',
    marginTop: '5vh',
    padding: '1vh',
    color: '#FFFFFF',
    backgroundColor: '#5DAAE0',
  },
  hellotext3: {
    fontSize: '1vw',
    marginTop: '5vh',
    padding: '0.5vh',
    color: '#FFFFFF',
    backgroundColor: '#5DAAE0',
  },
  hellotext2: {
    fontSize: '1.2vw',
    marginTop: '5vh',
    padding: '1vh',
    color: '#FFFFFF',
    backgroundColor: '#5DAAE0',
  },
  hellotext4: {
    fontSize: '1.5vw',
    marginTop: '2vh',
    padding: '1vh',
    color: '#FFFFFF',
  },
  searchBtn: {
    marginTop: '2vh',
    minWidth: '5vw',
    minHeight: '2.188vw',
    fontSize: '0.95vw',
    border: 'solid 0.75px #3B617C',
    // marginRight: '0.5rem',
    alignSelf: 'center',
    color: '#5DAAE0',
    '&:hover': {
      backgroundColor: '#5daae0',
      color: 'white',
    },
  },
});

class CustomerDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: this.props.location.state.selected
    };
  }

  render() {

    const { classes } = this.props
    const { selected } = this.state

    return (

      <div className={classes.root}>
        <Grid container spacing={2}>

          <Grid item xs={12}>
            <HeaderCD cust={selected} />
          </Grid>

          <Grid item xs={12}>
            <GridCD cust={selected} />
          </Grid>

          <Grid item xs={12}>
            <Footer />
          </Grid>

        </Grid>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(CustomerDetails);

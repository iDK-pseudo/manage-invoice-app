import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Link } from 'react-router-dom';
import Professor from '../components/Professor'
import Chip from '@material-ui/core/Chip';

const styles = {
  root: {
    flexGrow: 1,
  },

  grow: {
    flexGrow: 1,
  },

  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },

  banner: {
    borderRadius: 3,
    position: 'fixed',
    top: -2,
    left: '45vw',
    height: '3vh',
    fontSize: '0.8em',
    color: 'white',
    backgroundColor: '#eb7017'
  }
};

class HeaderCD extends Component {

  constructor(props) {
    super(props);

    this.state = { right: false }
  }

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open,
    });
  };

  render() {

    const { classes,cust } = this.props;

    const cust_name = cust[0].toUpperCase()
    const cust_num = cust[1]

    return (

      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>

            <IconButton autoid="navigation-back-button" className={classes.menuButton} color="inherit" aria-label="Menu">
              <Link to='/' style={{ color: 'white' }}>
                <ArrowBackIcon />
              </Link>
            </IconButton>

            <Typography autoid="customer-name" variant="h6" color="inherit" className={classes.grow}>
              {cust_name}
              <Typography autoid="customer-number" variant="caption" color="inherit" className={classes.grow}>
                {cust_num}
              </Typography>
            </Typography>

            <Chip label="Receivables Dashboard" className={classes.banner} />

            <Professor />

          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

HeaderCD.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(HeaderCD);

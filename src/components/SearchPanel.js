import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import SearchIcon from '@material-ui/icons/Search';
import searchIcon from '../assets/attach_money.svg'
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import { connect } from 'react-redux'


const styles = theme => ({
  root: {
    width: '97%',
    marginTop: theme.spacing.unit * 1,
    height: '40vh',
    backgroundColor: '#262f52',
    overflowY: 'scroll',
    borderRadius: 0,
  },
  table: {
    backgroundColor: '#252C48',
  },

  cells: {
    color: 'white',
  },

  headers: {
    color: 'lightgrey',
    fontSize: '0.85em',
  },

  button: {
    align: 'right',
    fontSize: 13,
    color: 'white',
    float: 'auto'
  },

  floatingLabelFocusStyle: {
    color: "white",
  },

  notchedOutline: {
    borderWidth: '0.5px',
    borderRadius: 40,
    borderColor: '#5DAAE0 !important',
  },

  input: {
    color: 'white',
    width: '90%',
    padding: '1vh',
    fontSize: '13px',
    marginLeft: '2vw',
  },
  menu: {
    width: '20vw',
    height: '25vh',
  },

  SearchButton: {
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: '#3da9ff',
    '&:hover': {
      backgroundColor: '#2676b5',
    },
    marginLeft: '1em'
  },

  SearchClose: {
    borderColor: '#3da9ff',
    color: '#3da9ff',
    backgroundColor: '#1B1F38',
    '&:hover': {
      color: 'white',
      backgroundColor: '#2676b5',
    }
  },

  menuItem: {
    backgroundColor: '#192147',
    color: 'white',
    '&:hover': {
      backgroundColor: '#3d8dbf'
    },
    '&:focus': {
      backgroundColor: '#192147'
    },
  },

  iconSelect: {
    color: '#3da9ff'
  }
});

class SearchPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [],
      found: [],
      open: 0,
      searchOption: '',
      searchValue: 0,
      searchResults: 0,
      placeholder: 'Search Customers by Customer Name or Number'
    };

    this.submitEvent = this.submitEvent.bind(this)
  }

  static getDerivedStateFromProps(props, state) {

    if (state.rows.length === 0) {
      const m = new Map();
      const filteredData = []

      for (const item of props.data) {
        if (!m.has(item.customer_name)) {
          m.set(item.customer_name, [item.customer_number, item.total_open_amount]);
        }

        else {
          let curr_total = m.get(item.customer_name)[1]
          m.set(item.customer_name, [item.customer_number, item.total_open_amount + curr_total])
        }
      }

      for (const record of m) {
        filteredData.push({
          customer_name: record[0],
          customer_number: record[1][0],
          total_open_amount: Math.round(record[1][1])
        })
      }

      return { rows: filteredData }
    }
  }

  submitEvent(e) {

    if (e.key === 'Enter') {
      if (e.target.value.length > 0) {
        var target = e.target.value

        let filtered_rows = []
        this.state.rows.forEach(row => {
          if (row.customer_number.toString().startsWith(target) || row.customer_name.startsWith(target)) {
            filtered_rows.push(row)
          }
        })

        if (filtered_rows.length === 0)
          filtered_rows = [{ customer_name: 'NA', customer_number: 0, total_open_amount: 0 }]

        this.setState({ found: filtered_rows });
      }

      else {
        this.setState({
          found: "",
          rows: this.state.rows
        })
      }
    }
  }


  handleOpen = () => {
    this.setState({ open: 1, searchResults: 1 })
  };

  handleClose = () => {
    this.setState({ open: 0 });
  };

  handleCloseSearchResults = () => {
    this.setState({ open: 0, searchResults: 0, found: [], placeholder: 'Search Customers by Customer Name or Number' })
  }

  handleChange = event => {
    this.setState({
      searchOption: event.target.value,
      [event.target.name]: event.target.value
    });
  };


  handleEntry = (e) => {
    this.setState({ searchValue: parseInt(e.target.value) })
  }

  handleSearch = () => {

    let filtered_rows = []
    let placeholder = "Customers with"

    switch (this.state.searchOption) {
      case 1:
        this.state.rows.forEach(r => {
          if (r.total_open_amount < this.state.searchValue)
            filtered_rows.push(r)
        })
        placeholder = placeholder.concat(" < $")
        break;

      case 2:
        this.state.rows.forEach(r => {
          if (r.total_open_amount > this.state.searchValue)
            filtered_rows.push(r)
        })
        placeholder = placeholder.concat(" > $")
        break;

      case 3:
        this.state.rows.forEach(r => {
          if (r.total_open_amount <= this.state.searchValue)
            filtered_rows.push(r)
        })
        placeholder = placeholder.concat(" <= $")
        break;

      case 4:
        this.state.rows.forEach(r => {
          if (r.total_open_amount >= this.state.searchValue)
            filtered_rows.push(r)
        })
        placeholder = placeholder.concat(" >= $")
        break;

      case 5:
        this.state.rows.forEach(r => {
          if (r.total_open_amount !== this.state.searchValue) {
            filtered_rows.push(r)
          }
        })
        placeholder = placeholder.concat(" not $")
        break;

      default:
        filtered_rows = []
    }

    if (filtered_rows.length === 0)
      filtered_rows = [{ customer_name: 'NA', customer_number: 0, total_open_amount: 0 }]
    placeholder = placeholder.concat(this.state.searchValue.toString(), " Open Amount")
    this.setState({ open: 0, found: filtered_rows, placeholder: placeholder })

  }

  render() {
    const { classes } = this.props;
    
    return (

      <Grid container>
        <Paper className={classes.root}>

          <Grid item className={classes.search}>

            <TextField
              autoid="search-text-field"
              placeholder={this.state.placeholder}
              className={classes.input}
              variant="outlined"
              onKeyDown={this.submitEvent}
              InputLabelProps={{
                className: classes.floatingLabelFocusStyle,
              }}
              InputProps={{
                classes: { input: classes.input, notchedOutline: classes.notchedOutline },
                startAdornment: (<SearchIcon fontSize='small' style={{ color: 'white' }} />),
                endAdornment: (
                  <Grid container xs={2}
                    spacing='0'>
                    <img src={searchIcon}
                      autoid="search-icon"
                      alt="searchIcon"
                      style={{ height: '3vh', marginTop: '0.5vh' }}
                    />
                    <Grid item>
                      <IconButton
                        fontSize='small'
                        onClick={this.handleOpen}
                        style={{ padding: 0 }}
                        autoid="advance-search-drop-down"
                      >
                        <KeyboardArrowDownIcon style={{ color: '#5daae0' }} />
                      </IconButton>
                    </Grid>

                    {this.state.searchResults === 1 &&
                      <Grid item xs={1}>
                        <IconButton
                          fontSize='small'
                          onClick={this.handleCloseSearchResults}
                          style={{ padding: 0 }}
                          autoid="search-close-icon"
                        >
                          <CloseIcon fontSize='small' style={{ color: '#5daae0' }} />
                        </IconButton>
                      </Grid>
                    }
                  </Grid>
                ),
              }}
            />
          </Grid>

          <Grid item align='center'>

            {/* Advanced Search Start*/}

            {this.state.open === 1 &&
              <table style={{ width: '80%' }} autoid="advance-search-table">
                <tr>
                  <Typography variant="h6" style={{ color: 'lightgrey' }}> Advanced Search </Typography>
                </tr>

                <tr>
                  <td colspan="2" >
                    <form autoComplete="off">
                      <FormControl
                        className={classes.formControl}
                        fullWidth='true'
                      >
                        <InputLabel style={{ color: 'lightgrey' }}>
                          Amount is...
                        </InputLabel>

                        <Select
                          value={this.state.searchOption}
                          onChange={this.handleChange}
                          displayEmpty
                          name="options"
                          autoWidth='true'
                          SelectDisplayProps={{
                            style: {
                              color: 'white'
                            }
                          }}
                          classes={{
                            icon: classes.iconSelect
                          }}
                        >
                          <MenuItem className={classes.menuItem} value={1}> Less Than ({"<"}) </MenuItem>
                          <MenuItem className={classes.menuItem} value={2}>Greater Than ({">"}) </MenuItem>
                          <MenuItem className={classes.menuItem} value={3}>Less Than or Equals ({"<="}) </MenuItem>
                          <MenuItem className={classes.menuItem} value={4}>Greater Than or Equals ({">="}) </MenuItem>
                          <MenuItem className={classes.menuItem} value={5}>Not Equal To </MenuItem>
                        </Select>
                      </FormControl>
                    </form>
                  </td>
                </tr>

                <tr autoid="advance-search-open-amount">
                  <td>
                    <Typography variant="subtitle1" style={{ color: 'lightgrey' }}>
                      Open Amount ($) :
                    </Typography>
                  </td>

                  <td>
                    <Input
                      onChange={this.handleEntry}
                      inputProps={{
                        style: {
                          color: 'white'
                        }
                      }}
                    />
                  </td>
                </tr>
                <tr>
                  <td colspan='2' align='right' style={{ padding: '1em' }}>
                    <Button autoid="advance-search-cancel" variant="outlined" className={classes.SearchClose} size="small" onClick={this.handleClose} >
                      Close
                  </Button>

                    <Button autoid="advance-search-button" variant="contained" className={classes.SearchButton} size="small" onClick={this.handleSearch}>
                      Search
                   </Button>
                  </td>
                </tr>
              </table>
            }

            {/* Advanced Search End*/}

            <Table className={classes.table} padding='none'>
              <TableHead>
                <TableRow>
                  <TableCell className={classes.headers} padding="default">Customer Name </TableCell>
                  <TableCell className={classes.headers}> Customer Number </TableCell>
                  <TableCell className={classes.headers} >Open Amount </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>

                {this.state.found.length < 1 ? (this.state.rows.map(row => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <Button className={classes.button}>
                        <Link style={{ color: 'white', textDecoration: 'none', fontSize: 12, marginLeft: '1.5vw' }}
                          to={{
                            pathname: 'customer-dashboard',
                            state: { ele: [row.customer_name, row.customer_number] }
                          }}>

                          {row.customer_name}

                        </Link>
                      </Button>
                    </TableCell>
                    <TableCell className={classes.cells}>{row.customer_number}</TableCell>
                    <TableCell align="center" className={classes.cells} >{row.total_open_amount}</TableCell>
                  </TableRow>
                ))) : (
                    (this.state.found.map(f => (
                      <TableRow key={f.id}>
                        <TableCell>
                          <Button className={classes.button}>
                            <Link style={{ color: 'white', textDecoration: 'none', fontSize: 12, marginLeft: '1.5vw' }}
                              to={{
                                pathname: 'customer-dashboard',
                                state: { ele: [f.customer_name, f.customer_number] }
                              }}>

                              {f.customer_name}

                            </Link>
                          </Button>
                        </TableCell>
                        <TableCell className={classes.cells}>{f.customer_number}</TableCell>
                        <TableCell className={classes.cells} align="center">{f.total_open_amount}</TableCell>
                      </TableRow>
                    )))
                  )
                }
              </TableBody>
            </Table>
          </Grid>
        </Paper>
      </Grid >
    );
  }
}

SearchPanel.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    data: state.data
  }
}
export default connect(mapStateToProps)(withStyles(styles)(SearchPanel));

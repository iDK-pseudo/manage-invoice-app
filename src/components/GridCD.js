import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import Modify from './Modify';
import LinearProgress from '@material-ui/core/LinearProgress';
import { CSVLink } from "react-csv";
import Grid from '@material-ui/core/Grid';
import { connect } from 'react-redux'
import { fetchData } from '../redux/reducer'

const rows = [
  { id: 'company_id', numeric: false, disablePadding: true, label: 'Company ID' },
  { id: 'acc_header_id', numeric: true, disablePadding: true, label: 'Account Header ID' },
  { id: 'doc_number', numeric: true, disablePadding: true, label: 'Document Number' },
  { id: 'business_code', numeric: false, disablePadding: true, label: 'Business Code' },
  { id: 'doc_type', numeric: false, disablePadding: true, label: 'Document Type' },
  { id: 'cust_number', numeric: true, disablePadding: false, label: 'Customer Number' },
  { id: 'cust_map_id', numeric: true, disablePadding: false, label: 'Customer Map ID' },
  { id: 'cust_name', numeric: true, disablePadding: true, label: 'Customer Name' },
  { id: 'document_create_date', numeric: true, disablePadding: true, label: 'Document Create Date' },
  { id: 'baseline_date', numeric: false, disablePadding: false, label: 'Baseline Date' },
  { id: 'invoice_date', numeric: true, disablePadding: false, label: 'Invoice Date' },
  { id: 'invoice_id', numeric: true, disablePadding: false, label: 'Invoice ID' },
  { id: 'total_open_amount', numeric: true, disablePadding: false, label: 'Total Open Amount' },
  { id: 'cust_payment_terms', numeric: true, disablePadding: false, label: 'Customer Payment Terms' },
  { id: 'clear_date', numeric: true, disablePadding: false, label: 'Clear Date' },
  { id: 'is_open', numeric: true, disablePadding: false, label: 'Is Open Invoice' },
  { id: 'shipping_date', numeric: true, disablePadding: false, label: 'Shipping Date' },
  { id: 'payment_amount', numeric: true, disablePadding: false, label: 'Payment Amount' },
  { id: 'days_past', numeric: true, disablePadding: false, label: 'Days Past Due Date' },
  { id: 'doc_id', numeric: true, disablePadding: false, label: 'Doc ID' },
  { id: 'actual_out_amount', numeric: true, disablePadding: false, label: 'Actual Outstanding Amount' },
  { id: 'age_of_invoice', numeric: true, disablePadding: false, label: 'Age of Invoice' },
  { id: 'invoice_currency', numeric: true, disablePadding: false, label: 'Invoice Currency' },
];

class EnhancedTableHead extends React.Component {

  render() {
    const { onSelectAllClick, numSelected, rowCount } = this.props;

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount}
              onChange={onSelectAllClick}
              style={{ color: 'white' }}
            />
          </TableCell>
          {rows.map(
            row => (
              <TableCell
                key={row.id}
                align='left'
                padding={row.disablePadding ? 'none' : 'default'}
                style={{
                  color: 'lightgrey',
                  fontSize: '0.8em'
                }}
              >

                {row.label}

              </TableCell>
            ),
            this,
          )}
        </TableRow>
      </TableHead>
    );
  }
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit,
  },

  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
    color: 'grey',
  },

  button: {
    marginTop: 15,
    borderColor: '#42aaeb',
    color: "white",
    marginLeft: 10,
    '&:hover': {
      backgroundColor: '#42aaeb'
    }
  }
});

class EnhancedTableToolbar extends Component {

  constructor(props) {
    super(props);
    this.state = { updated: false }
  }

  rerenderParentCallback = (open, doc, id) => {
    this.props.curr_state.handleReRender(open, doc, id)
  }

  render() {
    const { classes, numSelected, selected_records } = this.props;

    let openamt = 0
    let doctype = null
    let id = 0

    if (selected_records.length === 1) {
      openamt = selected_records[0].total_open_amount
      doctype = selected_records[0].doctype
      id = selected_records[0].pk_id
    }

    return (
      <Toolbar
        className={classNames(classes.root, {
          [classes.highlight]: numSelected > 0,
        })}
      >
        <Grid container>
          <Grid item xs={7}>
            <div className={classes.actions}>

              <div style={{ float: 'left', marginTop: 15 }}>
                <Modify
                  open={numSelected === 1 ? 'true' : 'false'}
                  curr_doctype={doctype}
                  curr_openamt={openamt}
                  id={id}
                  rerenderParentCallback={this.rerenderParentCallback} />
              </div>

              <CSVLink
                filename="1706592_exportedData.csv"
                data={selected_records}
                style={{
                  textDecoration: 'none'
                }}>
                <Button variant="outlined"
                  autoid="export-button"
                  className={classes.button}
                  size="small"
                  disabled={numSelected > 0 ? false : true}
                  color="default"
                >
                  Export
              </Button>
              </CSVLink>
            </div>
          </Grid>

          <Grid
            item xs={2}
            style={{ borderRight: '1px solid grey', borderLeft: '1px solid grey', textAlign: 'center' }}>
            <Typography autoid="total-open-invoices-customer" variant="h6" style={{ color: 'white', fontWeight: 'bold' }}> {this.props.invoices} </Typography>
            <Typography variant="subtitle2" style={{ color: '#d6d9d2' }}> Total Open Invoices </Typography>
          </Grid>

          <Grid item xs={3} style={{ textAlign: 'center' }}>
            <Typography autoid="total-open-amount-customer" variant="h6" style={{ color: 'white', fontWeight: 'bold' }}> {this.props.amount} $ </Typography>
            <Typography variant="subtitle2" style={{ color: '#d6d9d2' }} > Total Open Amount </Typography>
          </Grid>
        </Grid>

      </Toolbar>
    );
  };
}

EnhancedTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
};

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 2000,
    marginTop: theme.spacing.unit * 1,
    backgroundColor: '#2e3759',
    borderRadius: 0
  },

  table: {
    maxWidth: 500,
    backgroundColor: '#252C48',
  },

  tableWrapper: {
    overflowY: 'scroll',
    height: 380,
  },

  cells: {
    color: 'white',
    fontSize: '1.1vw',
  },
});

class EnhancedTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: [],
      data: [],
      selected_records: [],
      page: 0,
      rowsPerPage: 6,
      open_amt: 0,
      open_invoices: 0,
    };
  }

  handleReRender = (open, doc, id) => {
    let new_open_amt = 0
  
    this.state.data.forEach(d => {
      if (d.pk_id === id) {
        d.total_open_amount = parseInt(open)
        d.doctype = doc
      }
      new_open_amt += d.total_open_amount
    })

    this.setState({
      selected: [],
      selected_records: [],
      open_amount: Math.round(new_open_amt)
    })
  }

  static getDerivedStateFromProps(props, state) {
    if (state.data.length === 0) {
      const cust_num = props.cust[1]
      const rows = []
      let amount = 0
      let invoices = 0

      props.data.forEach(ele => {
        if (ele.customer_number === cust_num) {
          amount += ele.total_open_amount
          invoices += ele.isOpen
          rows.push(ele)
        }
      })

      return {
        data: rows,
        selected: [],
        open_invoices: invoices,
        open_amount: Math.round(amount)
      }
    }
  }

  handleSelectAllClick = event => {
    if (event.target.checked) {
      this.setState(state => ({
        selected: state.data.map(n => n.pk_id),
        selected_records: this.state.data
      }));
      return;
    }
    this.setState({ selected: [], selected_records: [] });
  };

  handleClick = (event, pk_id, data) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(pk_id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, pk_id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    if (event.target.checked) {
      this.setState({
        selected: newSelected,
        selected_records: this.state.selected_records.concat([data])
      });
    }
    else {
      let final_selected = []
      final_selected = this.state.selected_records.filter(e => {
        if (e.pk_id !== pk_id)
          return e
        return null
      })

      this.setState({
        selected: newSelected,
        selected_records: final_selected
      });
    }
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  render() {
    const { classes } = this.props;
    const { selected, data, page, rowsPerPage, open_amount, open_invoices, selected_records } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    if (data.length === 0) {
      return (
        <LinearProgress />
      )
    }

    return (
      <Paper className={classes.root} autoid="invoice-table-customer" >
        <EnhancedTableToolbar
          numSelected={selected.length}
          curr_state={this}
          selected_records={selected_records}
          amount={open_amount}
          invoices={open_invoices}
        />

        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <EnhancedTableHead
              numSelected={selected.length}
              onSelectAllClick={this.handleSelectAllClick}
              rowCount={data.length}
            />
            <TableBody>
              {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(n => {
                  const isSelected = this.isSelected(n.pk_id);
                  return (
                    <TableRow
                      hover
                      onClick={event => this.handleClick(event, n.pk_id, n)}
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={n.pk_id}
                      selected={isSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox style={{ color: 'white' }} checked={isSelected} />
                      </TableCell>
                      <TableCell className={classes.cells} align="center"> {n.company_id} </TableCell>
                      <TableCell className={classes.cells} align="right">{n.acct_doc_header_id}</TableCell>
                      <TableCell className={classes.cells} align="right">{n.document_number}</TableCell>
                      <TableCell className={classes.cells} align="right">{n.business_code}</TableCell>
                      <TableCell className={classes.cells} align="right">{n.doctype}</TableCell>
                      <TableCell className={classes.cells} align="right">{n.customer_number}</TableCell>
                      <TableCell className={classes.cells} align="center">{n.fk_customer_map_id}</TableCell>
                      <TableCell className={classes.cells} align="left">{n.customer_name}</TableCell>
                      <TableCell className={classes.cells} padding="none">{n.document_create_date}</TableCell>
                      <TableCell className={classes.cells} align="right">{n.baseline_create_date}</TableCell>
                      <TableCell className={classes.cells} align="right">{n.invoice_date_norm}</TableCell>
                      <TableCell className={classes.cells} align="right">{n.invoice_id}</TableCell>
                      <TableCell className={classes.cells} align="right">{n.total_open_amount}</TableCell>
                      <TableCell className={classes.cells} align="right">{n.cust_payment_terms}</TableCell>
                      <TableCell className={classes.cells} align="right">{n.clearing_date}</TableCell>
                      <TableCell className={classes.cells} align="right">{n.isOpen}</TableCell>
                      <TableCell className={classes.cells} align="right">{n.ship_date}</TableCell>
                      <TableCell className={classes.cells} align="right">{n.paid_amount}</TableCell>
                      <TableCell className={classes.cells} align="right">{n.dayspast_due}</TableCell>
                      <TableCell className={classes.cells} align="right">{n.document_id}</TableCell>
                      <TableCell className={classes.cells} align="right">{n.actual_open_amount}</TableCell>
                      <TableCell className={classes.cells} align="right">{n.invoice_age}</TableCell>
                      <TableCell className={classes.cells} align="right">{n.invoice_amount_doc_currency}</TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <TablePagination
          autoid="invoice-table-pagination-customer"
          style={{ height: 50, color: 'white' }}
          rowsPerPageOptions={[6, 10, 20]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page',
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </Paper>
    );
  }
}

EnhancedTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    data: state.data,
    loading: state.loading
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchData: () => dispatch(fetchData())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(EnhancedTable, EnhancedTableToolbar));

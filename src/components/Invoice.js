import React from 'react';
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
import { connect } from 'react-redux';


let counter = 0;
let predicted_amount = 0;
let predicted_payment_type = 'NA'
function createData(company_id, acct_doc_header_id, document_number, business_code, doctype, customer_number,
  fk_customer_map_id, customer_name, document_create_date, baseline_create_date,
  invoice_date_norm, invoice_id, total_open_amount, cust_payment_terms,
  clearing_date, isOpen, ship_date, paid_amount, dayspast_due, document_id,
  actual_open_amount, invoice_age, invoice_amount_doc_currency) {

  counter += 1;

  return {
    id: counter, company_id, acct_doc_header_id, document_number, business_code, doctype, customer_number,
    fk_customer_map_id, customer_name, document_create_date, baseline_create_date,
    invoice_date_norm, invoice_id, total_open_amount, cust_payment_terms,
    clearing_date, isOpen, ship_date, paid_amount, dayspast_due, document_id,
    actual_open_amount, invoice_age, invoice_amount_doc_currency, predicted_amount, predicted_payment_type
  };
}

const rows = [
  { id: 'cust_name', numeric: true, disablePadding: true, label: 'Customer Name' },
  { id: 'invoice_id', numeric: true, disablePadding: true, label: 'Invoice ID' },
  { id: 'doc_number', numeric: true, disablePadding: true, label: 'Document Number' },
  { id: 'predicted_payment_type', numeric: true, disablePadding: false, label: 'Predicted Payment Type' },
  { id: 'predicted_amount', numeric: true, disablePadding: false, label: 'Predicted Amount' },
  { id: 'company_id', numeric: false, disablePadding: true, label: 'Company ID' },
  { id: 'acc_header_id', numeric: true, disablePadding: false, label: 'Account Header ID' },
  { id: 'business_code', numeric: false, disablePadding: false, label: 'Business Code' },
  { id: 'doc_type', numeric: false, disablePadding: false, label: 'Document Type' },
  { id: 'cust_number', numeric: true, disablePadding: false, label: 'Customer Number' },
  { id: 'cust_map_id', numeric: true, disablePadding: false, label: 'Customer Map ID' },
  { id: 'document_create_date', numeric: true, disablePadding: false, label: 'Document Create Date' },
  { id: 'baseline_date', numeric: false, disablePadding: false, label: 'Baseline Date' },
  { id: 'invoice_date', numeric: true, disablePadding: false, label: 'Invoice Date' },
  { id: 'total_open_amount', numeric: true, disablePadding: false, label: 'Total Open Amount' },
  { id: 'cust_payment_terms', numeric: true, disablePadding: false, label: 'Customer Payment Terms' },
  { id: 'clear_date', numeric: true, disablePadding: false, label: 'Clear Date' },
  { id: 'is_open', numeric: true, disablePadding: false, label: 'Is Open Invoice' },
  { id: 'shipping_date', numeric: true, disablePadding: false, label: 'Shipping Date' },
  { id: 'payment_amount', numeric: true, disablePadding: false, label: 'Payment Amount' },
  { id: 'days_past', numeric: true, disablePadding: false, label: 'Days Past Due Date' },
  { id: 'doc_id', numeric: true, disablePadding: false, label: 'Document ID' },
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
                padding= {row.disablePadding ? 'none' : 'default'}
                style={{
                  color: 'lightgrey',
                  fontSize: '0.85em',
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
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit,
  },

  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
    color: 'lightgrey',
  },

  button: {
    color: 'white',
    backgroundColor: '#3da9ff',
    '&:hover': {
      backgroundColor: '#2676b5',
    }
  },


});

let EnhancedTableToolbar = props => {
  const { numSelected, classes, self } = props;
  let disable = numSelected > 0 ? false : true

  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <div className={classes.title}>
        {numSelected > 0 ? (
          <Typography className={classes.title} color="inherit" variant="subtitle1">
            {numSelected} selected
          </Typography>
        ) : (
            <Typography className={classes.title} variant="h6" id="tableTitle">
              Invoices
            </Typography>
          )}
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        <Button
          autoid="predict-button"
          disabled={disable}
          variant="contained"
          onClick={self.handlePredict}
          size="small"
          className={classes.button}>
          Predict
        </Button>
      </div>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
};

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 800,
    marginTop: theme.spacing.unit * 1,
    backgroundColor: '#2e3759',
    borderRadius: 0,
  },

  table: {
    maxWidth: 500,
    backgroundColor: '#252C48',
  },

  tableWrapper: {
    overflowX: 'scroll',
    overflowY: 'scroll',
    height: '54vh',
  },

  cells: {
    color: 'white',
    fontSize: '0.8em',
  },

  selectIcon: {
    color: 'white',
  }
});

class EnhancedTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      order: 'asc',
      orderBy: '',
      selected: [],
      data: [],
      page: 0,
      rowsPerPage: 10,
      selected_record: [],
      founded: '',
      backup_data: []
    };
    this.handlePredict = this.handlePredict.bind(this);
  }

  static getDerivedStateFromProps(props, state) {

    if(state.data.length === 0)
    {
      return {
        data : props.data,
        backup_data : props.data
      }
    }

    const new_records = []

    if (state.selected.length > 0 && props.founded !== 'deactivate')
      return true

    if (props.founded.length > 0) {
      if (props.founded === 'deactivate') {
        return {
          data: state.backup_data,
          founded: ''
        }
      }

      else {
        state.backup_data.forEach(m => {
          if (m.business_code === props.founded)
            new_records.push(m)
        })

        return {
          data: new_records,
          founded: props.founded
        }
      }
    }
  }

  handlePredict() {
    const record = this.state.selected_record

    if (record.length > 0) {
      const url = 'http://127.0.0.1:5000/predict?'
      axios.post(url, {}, {
        headers: { 'Content-type': 'application/json' },
        params: {
          data: {
            id: '1706592',
            data: record
          }
        }
      }
      )
        .then((response) => {
          const records = response.data
          this.state.data.forEach(d => {
            records.forEach(e => {
              if (e.document_id === d.document_id) {
                if (d.actual_open_amount <= e.predictions) {
                  d.predicted_amount = Math.round(e.predictions)
                  d.predicted_payment_type = 'Fully Paid'
                }

                else {
                  d.predicted_amount = Math.round(e.predictions)
                  d.predicted_payment_type = 'Partially Paid'
                }
              }
            })
          })

          this.setState({ selected_record: [], selected: [] })
        },
          (error) => {
            console.log(error)
          });
    }
  }

  handleSelectAllClick = event => {
    if (event.target.checked) {
      this.setState(state => ({ selected: state.data.map(n => n.pk_id), selected_record: this.state.data }));
      return;
    }
    this.setState({ selected: [], selected_record: [] });
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

    if (selectedIndex === -1)
      this.setState({ selected: newSelected, selected_record: this.state.selected_record.concat([data]) });
    else {
      const newSelectedRecords = this.state.selected_record.filter((item) => item.pk_id !== pk_id);
      this.setState({ selected: newSelected, selected_record: newSelectedRecords })
    }
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = pk_id => this.state.selected.indexOf(pk_id) !== -1;

  render() {

    const { classes } = this.props;
    const { data, order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    return (
      <Paper autoid="invoice-table-collector" className={classes.root}>
        <EnhancedTableToolbar numSelected={selected.length} self={this} />
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
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
                      <TableCell className={classes.cells} align="left">{n.customer_name}</TableCell>
                      <TableCell className={classes.cells} align="left">{n.invoice_id}</TableCell>
                      <TableCell className={classes.cells} align="left">{n.document_number}</TableCell>
                      <TableCell className={classes.cells} align="left">{n.predicted_payment_type}</TableCell>
                      <TableCell className={classes.cells} align="left">{n.predicted_amount}</TableCell>
                      <TableCell className={classes.cells} align="center"> {n.company_id} </TableCell>
                      <TableCell className={classes.cells} align="right">{n.acct_doc_header_id}</TableCell>
                      <TableCell className={classes.cells} align="right">{n.business_code}</TableCell>
                      <TableCell className={classes.cells} >{n.doctype}</TableCell>
                      <TableCell className={classes.cells} align="right">{n.customer_number}</TableCell>
                      <TableCell className={classes.cells} align="right">{n.fk_customer_map_id}</TableCell>
                      <TableCell className={classes.cells} align="left">{n.document_create_date}</TableCell>
                      <TableCell className={classes.cells}>{n.baseline_create_date}</TableCell>
                      <TableCell className={classes.cells} align="right">{n.invoice_date_norm}</TableCell>
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
          autoid="invoice-table-pagination-collector"
          style={{ height: 45, color: 'white', }}
          rowsPerPageOptions={[5, 10, 20]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          classes={{ selectIcon: classes.selectIcon }}
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
    data : state.data
  }
}

export default connect(mapStateToProps)(withStyles(styles)(EnhancedTable));
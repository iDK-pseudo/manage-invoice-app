import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Header from '../components/Header';
import ArStats from '../components/ArStats';
import Invoice from '../components/Invoice';
import Footer from '../components/Footer';
import SearchPanel from '../components/SearchPanel'
import crossfilter from 'crossfilter2';
import { connect } from 'react-redux'
import LinearProgress from '@material-ui/core/LinearProgress';
import HighCharts from '../components/HighCharts'

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    paddingLeft: '1vw',
    paddingRight: '1vw',

  },
});

class CollectorDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      selected: '',
      total_cust_count: 2091,
      total_open_ar: '$ 43M',
      avg_days_past: '3 Days',
      total_open_invoices: 37438
    };
  }


  static getDerivedStateFromProps(props, state) {
    if (state.data.length === 0) {
      return {
        data: props.data
      }
    }
  }

  handleUpdateData = (selected) => {

    if (selected.length > 0) {
      let dataCross = crossfilter(this.state.data);
      let businessCode = dataCross.dimension(d => d.business_code)

      let businessCodeFilter = dataCross.dimension(d => d.business_code).filter(selected)

      let totalCust = businessCode.group().reduceCount()
      let totalOpenAmount = businessCode.group().reduceSum(d => d.total_open_amount)
      let totalOpenInvoices = businessCode.group().reduceSum(d => d.isOpen)
      let avgDaysPastDue = businessCode.group().reduceSum(d => d.dayspast_due)

      let avgDays = Math.round(avgDaysPastDue.top(1)[0].value / businessCode.group().top(1)[0].value)

      this.setState({
        selected: selected,
        total_cust_count: totalCust.top(1)[0].value,
        total_open_ar: '$ '.concat(Math.round(totalOpenAmount.top(1)[0].value).toString()),
        avg_days_past: avgDays.toString().concat(' Days'),
        total_open_invoices: totalOpenInvoices.top(1)[0].value
      })
    }

    else {
      this.setState({
        total_cust_count: 2091,
        total_open_ar: '$ 43M',
        avg_days_past: '3 Days',
        total_open_invoices: 37438,
        selected: 'deactivate'
      })
    }
  }


  render() {
    const { classes } = this.props;

    return (

      <div className={classes.root}>
        <Grid container spacing={2}>

          {this.state.data.length === 0 &&
            <Grid item xs={12}>
              <LinearProgress />
            </Grid>
          }

          {this.state.data.length > 0 &&
            <React.Fragment>
              <Grid item xs={12}>
                <Header />
              </Grid>

              <Grid item xs={12}>
                <ArStats autoid="total-customers-text-collector" name="Total Customers" count={this.state.total_cust_count} />
                <ArStats autoid="total-open-ar-text-collector" name="Total Open AR" count={this.state.total_open_ar} />
                <ArStats autoid="average-days-delay-text-collector" name="Average Days Delay" count={this.state.avg_days_past} />
                <ArStats autoid="total-open-invoice-text-collector" name="Total Open Invoices" count={this.state.total_open_invoices} />
              </Grid>

              <React.Fragment>
                <Grid container xs={5} direction="column">
                  <Grid item>
                    <HighCharts updateData={this.handleUpdateData} />
                  </Grid>
                  <Grid item>
                    <SearchPanel />
                  </Grid>
                </Grid>

                <Grid item xs={7}>
                  <Invoice founded={this.state.selected} />
                  <Footer />
                </Grid>
              </React.Fragment>
            </React.Fragment>}
        </Grid>

      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    data: state.data
  }
}

export default connect(mapStateToProps)(withStyles(styles, { withTheme: true })(CollectorDashboard));
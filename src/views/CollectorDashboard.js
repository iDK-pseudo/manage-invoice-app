import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import Header from '../components/Header';
import ArStats from '../components/ArStats';
import Invoice from '../components/Invoice';
import Footer from '../components/Footer';
import SearchPanel from '../components/SearchPanel'
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import crossfilter from 'crossfilter2';

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    paddingLeft: '1vw',
    paddingRight: '1vw',
    
  },

  chart: {
    width: '97%',
    marginTop: 5,
  },
});

class CollectorDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      selected: '',
      total_cust_count : 2091,
      total_open_ar : '$ 43M',
      avg_days_past : '3 Days',
      total_open_invoices : 37438
    };
    this.updateData = this.updateData.bind(this)
  }


  componentDidMount() {

    axios.get("http://localhost:8080/1706592/dummy.do?")
      .then(response => {
        this.setState({ data: response.data })
      })

      .catch(error => {
        console.log(error)
      })
  }

  updateData(selected){

    if(selected.length > 0)
      {
        let dataCross = crossfilter(this.state.data);
        let businessCode = dataCross.dimension(d => d.business_code)

        let businessCodeFilter =dataCross.dimension(d => d.business_code).filter(selected)
        console.log(businessCodeFilter)

        let totalCust = businessCode.group().reduceCount()
        let totalOpenAmount = businessCode.group().reduceSum(d=>d.total_open_amount)
        let totalOpenInvoices = businessCode.group().reduceSum(d=>d.isOpen)
        let avgDaysPastDue = businessCode.group().reduceSum(d=>d.dayspast_due)

        let avgDays = Math.round(avgDaysPastDue.top(1)[0].value/businessCode.group().top(1)[0].value)

        this.setState({
          selected : selected,
          total_cust_count :totalCust.top(1)[0].value,
          total_open_ar:'$ '.concat(Math.round(totalOpenAmount.top(1)[0].value).toString()),
          avg_days_past : avgDays.toString().concat(' Days'),
          total_open_invoices : totalOpenInvoices.top(1)[0].value
        })
      }
    }


  render() {
    const { classes } = this.props;

    // Analytics  

    var dataCross = crossfilter(this.state.data);
    var businessCode = dataCross.dimension(d => d.business_code)
    var groupBusinessCode = businessCode.group().reduceSum(d => d.actual_open_amount)

    function prepareDataForHighChart(groups) {
      var categories = [];
      var data = [];
      var group_data = groups.top(Infinity);

      group_data.forEach(d => {
        categories.push(d.key);
        data.push(d.value);
      })

      return {
        categories: categories,
        data: data
      }
    }

    var firstObject = prepareDataForHighChart(groupBusinessCode)

    let self = this

    const options = {
      chart: {
        type: 'bar',
        height: '40%',
        backgroundColor : '#262f52',
        scrollablePlotArea: {
          minHeight: 1500
        },
      },

      title: {
        text: 'Total Amount by Company Code',
        style: {
          color: 'lightgrey',
          fontFamily : 'Arial',
          fontSize : '1.5em'
        },
        align : 'center',
      },

      tooltip : {
        enabled : false,
      },

      plotOptions: {
        series: {
          point: {
            events: {
              click: function () {
                this.select(null, false)
                var selectedPoints = this.series.chart.getSelectedPoints()

                if(selectedPoints.length === 0 )
                {
                  self.setState({
                    total_cust_count : 2091,
                    total_open_ar : '$ 43M',
                    avg_days_past : '3 Days',
                    total_open_invoices : 37438,
                    selected : 'deactivate'
                  })
                }

                else
                  self.updateData(selectedPoints[0].category)
              },
            },
          },

          states : {
            select : {
              color : '#42aaeb',
              borderColor : '#42aaeb'
            }
          }
        }
      },

      xAxis: {
        categories: firstObject.categories,
        labels: {
          style: {
            color: 'white',
            fontFamily : 'Helvetica',
            fontSize : '1.2em'
          },
        }
      },
      yAxis: {
        labels: {
          enabled: false
        },
        title: {
          enabled: false,
        },
        gridLineColor: null
      },
      credits: {
        enabled: false
      },

      legend: {
        enabled: false
      },

      series: [{
        data: firstObject.data,
        label: false,
        color: 'lightgrey',
        borderColor : 'lightgrey' 
      }]
    }


    ////// END

    return (

      <div className={classes.root}>
        <Grid container spacing={2}>

          <Grid item xs={12}>
            <Header />
          </Grid>

          <Grid item xs={12}>
            <ArStats autoid = "total-customers-text-collector" name="Total Customers" count={this.state.total_cust_count} />
            <ArStats autoid = "total-open-ar-text-collector" name="Total Open AR" count={this.state.total_open_ar} />
            <ArStats autoid = "average-days-delay-text-collector" name="Average Days Delay" count={this.state.avg_days_past} />
            <ArStats autoid = "total-open-invoice-text-collector" name="Total Open Invoices" count={this.state.total_open_invoices} />
          </Grid>

          <Grid container xs={5} direction="column">
            <Grid item>
              <div autoid = "companycode-chart" className={classes.chart}>
                <HighchartsReact highcharts={Highcharts}
                  options={options}
                />
              </div>
            </Grid>
            <Grid item>
              <SearchPanel />
            </Grid>
          </Grid>

          <Grid item xs={7}>
            <Invoice founded = {this.state.selected}/>
            <Footer/>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(CollectorDashboard);

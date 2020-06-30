import React, { Component } from 'react'
import { connect } from 'react-redux'
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import crossfilter from 'crossfilter2';
import { withStyles } from '@material-ui/core/styles';


const styles = () => ({
    chart: {
        width: '97%',
        marginTop: 5,
    }
})

class HighCharts extends Component {
    constructor(props) {
        super(props)

        this.state = {
            data: []
        }
    }

    static getDerivedStateFromProps = (props, state) => {
        if (state.data.length === 0) {
            return {
                data: props.data
            }
        }
    }

    prepareDataForHighChart = (groups) => {
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

    render() {

        const { classes } = this.props
        var dataCross = crossfilter(this.state.data);
        var businessCode = dataCross.dimension(d => d.business_code)
        var groupBusinessCode = businessCode.group().reduceSum(d => d.actual_open_amount)

        var firstObject = this.prepareDataForHighChart(groupBusinessCode)

        let self = this

        const options = {
            chart: {
                type: 'bar',
                height: '40%',
                backgroundColor: '#262f52',
                scrollablePlotArea: {
                    minHeight: 1500
                },
            },

            title: {
                text: 'Total Amount by Company Code',
                style: {
                    color: 'lightgrey',
                    fontFamily: 'Arial',
                    fontSize: '1.5em'
                },
                align: 'center',
            },

            tooltip: {
                enabled: false,
            },

            plotOptions: {
                series: {
                    point: {
                        events: {
                            click: function () {
                                this.select(null, false)
                                var selectedPoints = this.series.chart.getSelectedPoints()

                                selectedPoints.length === 0 ? (
                                    self.props.updateData([])
                                ) : (
                                        self.props.updateData(selectedPoints[0].category)
                                    )
                            },
                        },
                    },

                    states: {
                        select: {
                            color: '#42aaeb',
                            borderColor: '#42aaeb'
                        }
                    }
                }
            },

            xAxis: {
                categories: firstObject.categories,
                labels: {
                    style: {
                        color: 'white',
                        fontFamily: 'Helvetica',
                        fontSize: '1.2em'
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
                borderColor: 'lightgrey'
            }]
        }
        return (
            <div autoid="companycode-chart" className={classes.chart}>
                <HighchartsReact highcharts={Highcharts}
                    options={options}
                />
            </div>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        data: state.data
    }
}

export default connect(mapStateToProps)(withStyles(styles)(HighCharts))

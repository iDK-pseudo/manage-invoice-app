import React, { Component } from 'react'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

class ArStats extends Component {

  render() {
    return (
      <Card style={{
        minWidth: 300,
        float: 'left',
        backgroundColor : '#2e3759',
        borderRadius: 1,
        marginLeft: 10,
        height: 80,
      }}>

        <CardContent>
          <Typography style={{
            fontSize: '1.1em',
            textAlign: 'center',
            color: 'lightgrey',
            fontFamily: 'Arial',
          }}
          >
            {this.props.name}
          </Typography>

          <Typography style={{
            fontSize: '1.8vw',
            textAlign: 'center',
            color: 'white',
          }}
            component="p">
            {this.props.count}
          </Typography>
        </CardContent>
      </Card>
    );
  }
}

export default ArStats;
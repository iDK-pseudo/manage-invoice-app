import React,{Component} from 'react'
import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver';
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Messages from '../components/Messages'
import Paper from '@material-ui/core/Paper';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

const styles = {
    root: {
      flexGrow: 1,
    },
  
    button : {
      backgroundColor :"#eb7017",
      fontWeight : 'bold',
      fontSize : 13,
      borderRadius : 20,
      color : 'white',
      float:'right',
      '&:hover':{
        backgroundColor :"#b04a02"
      }
    },

    paper : {
      borderRadius : 0,
      backgroundColor : '#1B1F38',
      borderTop : '0.3vh solid #eb7017',
      borderLeft : '0.3vh solid #eb7017'
    }
  };
  
class Professor extends Component {

    constructor(props){
        super(props);

        this.state = {right: false}
    }

    
  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open,
    });
  };


    render() {
        
        const { classes } = this.props;
        
        return (
        
        <div className={classes.root}>
            <Button autoid="professor-button" variant = "contained" className={classes.button} onClick={this.toggleDrawer('right', true)}>
                Professor
                <RecordVoiceOverIcon style = {{marginLeft : '0.7vw'}}/>
            </Button>

            <Drawer 
            anchor="right" 
            open={this.state.right} 
            onClose={this.toggleDrawer('right', false)}
            >
              <Paper className = {classes.paper}>
                  <Typography variant = 'subtitle1' 
                  style = {{float : 'left',
                  marginLeft : '3vw',
                  marginTop : '2vh',
                  color : '#cfcaca',}}
                  >
                    PROFESSOR
                  </Typography>

                  <IconButton
                  autoid="professor-close-button" 
                  onClick = {this.toggleDrawer('right', false)}
                  style = {{marginLeft : '12vw'}}
                  >
                  <CloseIcon style = {{color:'white'}}/>
                  </IconButton>
              </Paper>

              <Messages/>
            </Drawer>
        </div>
        );
    }
}

export default withStyles(styles)(Professor);

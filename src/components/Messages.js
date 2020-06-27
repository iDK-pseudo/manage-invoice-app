import React, { Component } from 'react'
import { ListItemText, Typography} from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import SendIcon from '@material-ui/icons/Send';
import InputAdornment from '@material-ui/core/InputAdornment';
import axios from 'axios';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

const styles = {
    root: {
        height: '95vh',
        width: '60vh',
        backgroundColor: '#1B1F38',
        borderLeft: '0.3vh solid #eb7017'
    },

    list: {
        color: 'white',
        float: 'right',
        fontSize : '1em'
    },
    floatingLabelFocusStyle: {
        color: "white"
    },

    input: {
        color: "white",
    },

    notchedOutline: {
        borderWidth: '1px',
        borderRadius: 30,
        borderColor: '#5DAAE0 !important',
    }
}

let counter = 0
function createMessage(data) {
    counter += 1;

    return { id: counter, data }
}

class Messages extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: null,
            message: "",
            prevMessage: "",
            conversation: [],
            msglen: 0
        }

        this.submitEvent = this.submitEvent.bind(this)
    }

    componentDidUpdate() {
        if ((this.state.prevMessage !== this.state.message) && (this.state.value === "")) {
            axios.post(`http://localhost:4000/chat`, {
                message: this.state.message
            })

                .then(response => {
                    this.setState({
                        value: null,
                        msglen: this.state.msglen + response.data.message.length,
                        conversation: this.state.conversation.concat(createMessage(response.data.message))
                    })

                })
                .catch(function (error) {
                    console.log(error);
                });
        }


    }

    submitEvent(e) {
        if (e.key === 'Enter') {
            if (e.target.value.length > 0) {
                var target = e.target.value
                if (this.state.conversation.length >= 3 || this.state.msglen > 300) {
                    this.setState(
                        {
                            prevMessage: this.state.message,
                            value: "",
                            message: target,
                            msglen: target.length,
                            conversation: [].concat(createMessage(target))
                        });
                }

                else {
                    this.setState(
                        {
                            prevMessage: this.state.message,
                            value: "",
                            message: target,
                            msglen: this.state.msglen + target.length,
                            conversation: this.state.conversation.concat(createMessage(target))
                        });
                }
            }
        }
    }


    render() {
        const { classes } = this.props

        return (
            <div className={classes.root}>
                <List component="ul">
                    {this.state.conversation.map(msg =>
                        (
                            <ListItem>
                                {msg.id % 2 === 0 &&
                                    <ListItemIcon> <RecordVoiceOverIcon style={{ color: '#eb7017' }} /> </ListItemIcon>
                                }

                                 {/* Same ListItem used for AI and Human Messages*/}
                                 
                                <ListItemText autoid = "human">    
                                    <Typography autoid = "ai" className={classes.list}>
                                        {msg.data}
                                    </Typography>
                                </ListItemText>

                                {msg.id % 2 === 1 &&
                                    <ListItemIcon> <AccountCircleIcon style={{ color: '#42aaeb' }} /> </ListItemIcon>
                                }
                            </ListItem>
                        ))
                    }
                </List>

            <TextField
                autoid="professor-input-box"
                id="msg"
                label="Say Hi !"
                placeholder="Write..."
                margin="dense"
                type="text"
                variant="outlined"
                fullWidth='true'
                value={this.state.value}
                onKeyDown={this.submitEvent}
                style={{ marginLeft: '4vw', width: '20vw', float: 'left', position: 'fixed', bottom: '2vh' }}
                InputLabelProps={{
                    className: classes.floatingLabelFocusStyle,
                }}
                InputProps={{
                    classes: { input: classes.input, notchedOutline: classes.notchedOutline },
                    endAdornment:
                        <InputAdornment position="end">
                            <SendIcon
                                autoid="professor-send-button"
                                fontSize='small'
                                style={{ color: '#5DAAE0' }} />
                        </InputAdornment>
                }}
            />

            </div >
        );
    }
}

export default withStyles(styles)(Messages);

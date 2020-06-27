import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';


const styles = themes => ({
  floatingLabelFocusStyle: {
    color: "white"
  },

  input: {
    color: "white"
  },

  button: {
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: '#3da9ff',
    '&:hover': {
      backgroundColor: '#2676b5',
    }
  },

  buttonCancel: {
    borderColor: '#3da9ff',
    color: '#3da9ff',
    backgroundColor: '#1B1F38',
    '&:hover': {
      color: 'white',
      backgroundColor: '#2676b5',
    }
  },

  modifyButton: {
    borderColor: '#42aaeb',
    color: "white",
    '&:hover': {
      backgroundColor: '#42aaeb'
    }
  }
});

class Modify extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      open_amt: "",
      doc_type: "",
      id: 0,
      openamtPlaceholder: null,
      doctypePlaceholder: null
    }
  };


  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({
      open: false,
      open_amt: "",
      doc_type: "",
      id: 0,
      openamtPlaceholder: null,
      doctypePlaceholder: null
    });
  };

  openHandler = (open) => {
    return "true" === open ?  false :  true
  }

  handleEntry = () => {
    axios.post("http://localhost:8080/1706592/dummy.do?",
      {}, {
      params: { open_amt: this.state.open_amt, doctype: this.state.doc_type, id: this.state.id }
    })
      .then(response => {
        this.setState({
          open: false,
          open_amt: "",
          doc_type: "",
          id: 0,
          openamtPlaceholder: null,
          doctypePlaceholder: null
        });
        this.props.rerenderParentCallback();
      })

      .catch(error => {
        console.log(error)
      })
  }

  handleEntryItem = (e) => {
    if (e.target.id === 'open_amt')
      this.setState({ open_amt: e.target.value })

    else if (e.target.id === 'doc_type')
      this.setState({ doc_type: e.target.value })
  }

  static getDerivedStateFromProps(props, state) {
    if ((state.id === 0 || state.openamtPlaceholder === null || state.doctypePlaceholder === null) && state.open === true) {
      return ({
        id: props.id,
        openamtPlaceholder: props.curr_openamt,
        doctypePlaceholder: props.curr_doctype
      })
    }
  }

  render() {

    const { classes,open } = this.props;
    return (
      <div>
        <Button
          autoid="modify-button"
          disabled = {this.openHandler(open)}
          variant="outlined"
          size="small"
          className={classes.modifyButton}
          onClick={this.handleClickOpen}>

          Modify

        </Button>

        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
          PaperProps={{
            style: {
              backgroundColor: '#1B1F38',
            },
          }}
        >
          <DialogTitle id="form-dialog-title">
            <span style={{ color: 'white' }}> Modify </span>
          </DialogTitle>
          <Divider variant="middle" style={{ backgroundColor: 'grey' }} />
          <DialogContent>
            <TextField
              margin="dense"
              autoid="open-amount-input"
              id="open_amt"
              label="Open Amount ($)"
              type="number"
              placeholder={this.state.openamtPlaceholder}
              onChange={this.handleEntryItem}
              InputLabelProps={{
                className: classes.floatingLabelFocusStyle,
              }}
              InputProps={{
                className: classes.input,
              }}
              fullWidth
            />
            <TextField
              margin="dense"
              id="doc_type"
              autoid="doctype-input"
              label="Document Type"
              type="text"
              placeholder={this.state.doctypePlaceholder}
              onChange={this.handleEntryItem}
              InputLabelProps={{
                className: classes.floatingLabelFocusStyle,
              }}
              InputProps={{
                className: classes.input,
              }}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button autoid="modify-cancel-button" variant="outlined" className={classes.buttonCancel} size="small" onClick={this.handleClose} >
              Cancel
            </Button>
            <Button autoid="modify-save-button" variant="contained" className={classes.button} size="small" onClick={this.handleEntry}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
export default withStyles(styles)(Modify);

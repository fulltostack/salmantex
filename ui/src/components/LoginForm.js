import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { login, loginfailed } from '../actions/actionCreators';
import { validateLogin } from "../utils/validations";

const useStyles = theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 1, 2),
  },
  error: {
    color: 'red'
  },
  action: {
    display: 'flex',
    flexDirection: 'row',
  },
});

class LoginForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: ''
    }
  }

  handleChange = (event, name) => {
    this.setState({
      [name]: event.target.value
    })
  }

  handleSubmit = event => {
    event.preventDefault();
    const { email, password } = this.state;

    const formdata = {
      email: email,
      password: password
    }

    const error = validateLogin(formdata);

    if (error.length > 0) {
      this.props.loginfailed(error);
    } else {
      this.props.login(formdata);
    }
  }

  render() {
    const classes = this.props.classes;

    if (this.props.isLoginSuccess) return <Redirect to={'/home'} />;

    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign In
        </Typography>
          <form className={classes.form} onSubmit={this.handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              onChange={(event) => this.handleChange(event, 'email')}
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              onChange={(event) => this.handleChange(event, 'password')}
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            {
              this.props.error && 
              <Typography className={classes.error} component="h1" variant="h6">
                {this.props.error}
              </Typography>
            }
            <div className={classes.action}>
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                className={classes.submit}
                onClick={() => this.props.history.push('/signup')}
              >
                Sign Up
              </Button>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Sign In
              </Button>
            </div>
          </form>
        </div>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  isLoginSuccess: state.login.isLoginSuccess,
  error: state.login.error,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({
    login,
    loginfailed,
  },
    dispatch
  );

export default connect(
  mapStateToProps, 
  mapDispatchToProps,
)(withStyles(useStyles)(LoginForm));

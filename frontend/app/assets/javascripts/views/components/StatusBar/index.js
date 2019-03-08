import React from 'react';
import Snackbar from 'material-ui/lib/snackbar';
import RaisedButton from 'material-ui/lib/raised-button';

export default class StatusBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: true,
        };
    }

    handleRequestClose = () => {
        this.setState({
            open: false,
        });
    };

    componentWillReceiveProps(nextProps) {
        this.setState({
            open: true,
        });
    }

    render() {

        if (this.props.message) {
            return (
                <div>
                    <Snackbar
                        open={this.state.open}
                        message={this.props.message}
                        autoHideDuration={5000}
                        onRequestClose={this.handleRequestClose}
                    />
                </div>
            );
        }
        return <div></div>;
    }
}
import React, { Component, Fragment } from 'react';

import './Layout.css';
import Toolbar from '../../components/Navigaton/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigaton/SideDrawer/SideDrawer';

class Layout extends Component {
    state = {
        showSideDrawer: false,
        showAlertDialog: false
    }

    sideDrawerClosedHandler = () => {
        this.setState( { showSideDrawer: false } );
    }

    sideDrawerToggleHandler = () => {
        this.setState( ( prevState ) => {
            return { showSideDrawer: !prevState.showSideDrawer };
        } );
    }

    render () {
        return (
            <Fragment>
                <Toolbar drawerToggleClicked={this.sideDrawerToggleHandler} />
                <SideDrawer
                    open={this.state.showSideDrawer}
                    closed={this.sideDrawerClosedHandler} />
                <main className="Layout">
                    {this.props.children}
                </main>
            </Fragment>
        )
    }
}

export default Layout;
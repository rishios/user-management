import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import { connect } from 'react-redux';

class Left extends Component{
   
    handleClick = e => {
        let items = document.querySelectorAll('.side-nav > li > a');
        for (let item of items) { item.className = ""; }
        e.target.className = "selectedClass";
    }

    render(){
        // Setting default selected tab
        let dashDefault = "", userDefault = "", groupDefault = "";
        let selectedClass = "selectedClass";
        let pathname = window.location.pathname;
        switch (pathname) {
            case "/":
                dashDefault = selectedClass;
                break;
            case "/users":
                userDefault = selectedClass;
                break;
            case "/groups":
                groupDefault = selectedClass;
                break;
            default:
                break;
        }

        return(
            <aside className={this.props.leftbar ? 'left-bar open hide-sm' : 'left-bar closed hide-sm'}>
                <div className="content">
                    <ul className="side-nav">
                        <li onClick={this.handleClick}>
                            <Link to="/" className={dashDefault}>
                                <i className="fa fa-tachometer-alt"></i>
                                Dashboard
                            </Link>
                        </li>
                        <li onClick={this.handleClick}>
                            <Link to="/users" className={userDefault}>
                                <i className="fa fa-user"></i>
                                Users
                            </Link>
                        </li>
                        <li onClick={this.handleClick}>
                            <Link to="/groups" className={groupDefault}>
                                <i className="fa fa-users"></i>
                                Groups
                            </Link>
                        </li>
                    </ul>
                </div>
            </aside>
        )
    }
}

function mapStateToProps(globalState) {
    return {
        leftbar: globalState.leftbar
    };
}

export default connect(mapStateToProps)(Left);
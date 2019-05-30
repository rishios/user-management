import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import {deleteUser, updateUser} from '../Actions/Update';
import {handleModal} from "../Actions/Global";

class UsersList extends Component{
    editUser(user){
        this.props.handleModal(user);
    }
    handleDelete(userid){
        this.props.deleteUser(userid);
    }
    handleUpdate(user, groupid){
        // removing user from specific group
        user.groups = user.groups.map(g => g._id).filter(gid => gid !== groupid);
        this.props.updateUser(user._id, user);
    }
    renderUsers(users, groupid){
        return users.map((user) => {
            return (
                <tr key={user._id}>
                    <td>{user.fullname}</td>
                    <td>{user.email}</td>
                    {!groupid ?
                        <td>{user.groups.map(o => o.title).join(', ')}</td>
                    :null}
                    <td className="md-visible">{moment(user.registered).format('DD MMM YYYY HH:MM')}</td>
                    {!groupid ?
                        <td>
                            <button className="btn btn-primary" onClick={()=> this.editUser(user)}><i className="fa fa-edit"></i></button>
                            <button className="btn btn-danger"
                            onClick={() => { if (window.confirm('Are you sure to delete this user? It will be removed from all groups.')) this.handleDelete(user._id) } }><i className="fa fa-trash"></i></button>
                        </td>
                    :
                        <td>
                            <button className="btn btn-danger"
                            onClick={() => { if (window.confirm('Are you sure to delete this user from this group?')) this.handleUpdate(user, groupid) } }><i className="fa fa-trash"></i></button>
                        </td>
                    }
                </tr>
            );
        })
    }
    render(){
        return(
            <table className="table table-responsive-lg">
                <thead>
                    <tr>
                        <th>Full Name</th>
                        <th>Email</th>
                        {!this.props.groupid ?
                            <th>Group(s)</th>
                        :null}
                        <th className="md-visible">Registered</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                {this.renderUsers(this.props.users, this.props.groupid)}
                </tbody>
            </table>
        )
    }
}

function mapStateToProps(globalState) {
    return {

    };
}

export default connect(mapStateToProps, { deleteUser, updateUser, handleModal })(UsersList);
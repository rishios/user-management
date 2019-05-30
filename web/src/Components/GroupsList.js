import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {deleteGroup, updateGroup} from '../Actions/Update';

class GroupsList extends Component{
    constructor(props){
        super(props);
        this.state = {
            updatedtitle: "",
            updatedid: "",
            msgContent: "",
            msgType: ""
        };
        this.submitUpdate = this.submitUpdate.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleUpdateBox = this.handleUpdateBox.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }
    handleDelete(groupid){
        this.props.deleteGroup(groupid);
        this.setState({msgContent: "", msgType: ""});
    }
    handleUpdate(e){
        this.setState({updatedtitle: e.target.value.replace(/(<([^>]+)>)/ig,"")});
    }
    submitUpdate(e){
        e.preventDefault();
        const { updatedtitle, updatedid } = this.state;
        const { groups } = this.props;
        if(!updatedtitle || !updatedid){
            this.setState({msgContent: 'Please provide group name', msgType: 'alert error'})
        } else if (groups && groups.findIndex(g => g.title === updatedtitle.trim()) > -1) {
            this.setState({msgContent: 'A group with this name already exist', msgType: 'alert error'})
        }
        else{
            this.setState({loading: true}, function(){
                this.props.updateGroup(updatedtitle.trim(), updatedid);
                this.handleUpdateBox("", "");
            })
        }
    }
    //Open edit group box
    handleUpdateBox(id, title){
        this.setState({updatedid: id, updatedtitle: title, msgContent: "", msgType: ""});
    }
    renderGroups(groups){
        return groups.map((group) => {
            return (
                <tr key={group._id}>
                    <td>
                        {group.title}
                        {this.state.updatedid === group._id &&
                        <form onSubmit={this.submitUpdate}>
                            <div className="input-group">
                                <input 
                                    name="title"
                                    value={this.state.updatedtitle} 
                                    className="form-control form-control-lg" 
                                    placeholder="Group Name" 
                                    type="text"
                                    onChange={this.handleUpdate} />
                                <div className="input-group-append">
                                    <button className="btn btn-success">Update</button>
                                </div>
                            </div>
                        </form>
                        }
                    </td>
                    <td className="xs-visible">{moment(group.created).format('DD MMM YYYY HH:MM')}</td>
                    <td>
                        {this.state.updatedid === group._id ? (
                        <button className="btn btn-primary" type="button" onClick={()=> this.handleUpdateBox("", "")}><i className="fa fa-times"></i></button>
                        ):(
                        <button className="btn btn-primary" type="button" onClick={()=> this.handleUpdateBox(group._id, group.title)}><i className="fa fa-edit"></i></button>
                        )}
                        <button 
                        className="btn btn-danger" 
                        type="button"
                        onClick={() => { if (window.confirm('Are you sure to delete this group?')) this.handleDelete(group._id) } }><i className="fa fa-trash"></i></button>
                        <Link to={"/group/" + group._id}>
                            <button className="btn btn-success" type="button"><i className="fa fa-info"></i></button>
                        </Link>
                    </td>
                </tr>
            );
        })
    }
    render(){
        return(
            <div>
            {this.state.msgContent &&
                <div className={this.state.msgType} role="alert">
                    {this.state.msgContent}
                </div>
                }
                
            <table className="table table-responsive-sm">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th className="xs-visible">Created</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                {this.renderGroups(this.props.groups)}
                </tbody>
            </table>
            </div>
        )
    }
}

function mapStateToProps(globalState) {
    return {
        
    };
}

export default connect(mapStateToProps, {deleteGroup, updateGroup})(GroupsList);
import React from "react";
import $ from "jquery";
import  { Redirect } from 'react-router-dom';

export default class ManageItem  extends React.Component {
    constructor() {
        super();
        this.state={
            item:"still loading",
            category:"still loading",
            categories : [{}]
        };

        this.itemNameChange = this.itemNameChange.bind(this);
        this.categoryChange = this.categoryChange.bind(this);
        this.itemDescriptionChange = this.itemDescriptionChange.bind(this);
        this.updateForm = this.updateForm.bind(this);
        this.deleteForm = this.deleteForm.bind(this);
        this.createForm = this.deleteForm.bind(this);
    }

    itemNameChange(e){
        this.setState({item_name: e.target.value});
    }
    
    categoryChange(e){
        this.setState({category: e.target.value});
    }
    
    itemDescriptionChange(e){
        this.setState({description: e.target.value});
    }

    updateForm(e){
        $.ajax({
            type: "POST",
            url: '/item/edit',
            data: $('#updateForm').serialize(), // serializes the form's elements.
            success: function(response)
            {   
                if (response==="success"){
                    window.location.href = '/';
                }
            }
          })
        e.preventDefault();
    }

    deleteForm(e){
        $.ajax({
            type: "POST",
            url: '/item/delete',
            data: $('#deleteForm').serialize(), // serializes the form's elements.
            success: function(response)
            {
                if (response==="success"){
                    window.location.href = '/';
                }            
            }
          })
        e.preventDefault();
    }

    createForm(e){
        $.ajax({
            type: "POST",
            url: '/item/delete',
            data: $('#deleteForm').serialize(), // serializes the form's elements.
            success: function(response)
            {
                if (response==="success"){
                    window.location.href = '/';
                }            
            }
          })
        e.preventDefault();
    }

    componentDidMount(){
        $.ajax({
                url: "/item/"+this.props.id,
                success: function(result){
                  this.setState(
                      { item_name: result.item_name,
                        category: result.category,
                        id: result.id,
                        description: result.description
                      }
                    );

                }.bind(this)
        });

        $.ajax({
                url: "/categories",
                success: function(result){
                    this.setState({categories: result.categories_list});
                }.bind(this)
        });
    }

    
    render(){        
        return(
            <div className="container">
            <form id="updateForm" className="form" onSubmit={this.updateForm}>
                
                <input type="text" name="item"
                className="input"
                onChange={this.itemNameChange}
                value={this.state.item_name}/>

                <input type="text" name="description"
                className="input"
                onChange={this.itemDescriptionChange}
                value={this.state.description}/>
                
                <select className="select" name="category"
                onChange={this.categoryChange} >
                    <optgroup 
                    label={"current category: " + this.state.category +" please select a category"} />
                    {
                        this.state.categories.map((category, k)=>{
                            return(
                                <option key={k} value={category.id}>             {category.category}
                                </option> 
                            );
                        })
                    }
                </select>

                <input type="hidden" name="id" value={this.state.id}/>
                <button className="btn btn_primary"> update </button>
            </form>

            <form onSubmit={this.deleteForm} id="deleteForm" className="form">
                <input type="hidden" name="id" value={this.state.id}/>
                <button className="btn btn_danger   "> Delete </button>
            </form>
            </div>
        );
    }
}
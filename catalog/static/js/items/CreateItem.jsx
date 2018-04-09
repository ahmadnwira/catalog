import React from "react";
import $ from "jquery";

export default class CreateItem extends React.Component {
  constructor() {
    super();
    this.addItem = this.addItem.bind(this);
    this.state = {categories:[]}
  }

  componentDidMount(){
    $.ajax({
      url: "/categories",
      success: function(result){
          this.setState({categories: result.categories_list});
      }.bind(this)
    });
  }
  
  addItem(e){
    e.preventDefault();

    let form = $('#createForm')[0];
    var formData = new FormData();
    formData.append('item', form['item']['value']);
    formData.append('category', form['category']['value']);
    formData.append('description', form['description']['value']);
    formData.append('img', form['img'].files[0]);
    
    if(formData.get('img') === 'undefined'){
      console.log('you must provide image');
    }
    else{
      $.ajax({
        type: "POST",
        url: '/item/add',
        data: formData,
        contentType: false,
        processData: false,
        success: function(response)
        {
          if(response === "success"){
            this.props.closeModal();
            console.log(this.props.closeModal);
          }
        }.bind(this)
      });
    }
    e.preventDefault();
  }

  render() {
    return (
      <div className="modal">
        <form className="form" method="POST" id="createForm" encType="multipart/form-data"
        onSubmit={this.addItem}>
          {/* needs a csrf token */}
          <p className="btn btn_danger icon"
          onClick={this.props.closeModal}>close</p>

          <label htmlFor="item">Item Name: </label>
          <input type="text" name="item" className="input"/>
          
          <label htmlFor="description">Item Description: </label>
          <input type="text" name="description" className="input"/>
          
          
          <label htmlFor="category">Item Category: </label>
          <input type="text" name="category" 
          list="category" className="input" placeholder="select or enter new category"/> 
          <datalist id="category">
            {
              this.state.categories.map((category, k)=>{
                return(
                  <option key={k} value={category.category} />
                );
              })
            }
          </datalist>

          <label htmlFor="img">upload image</label>
          <input type="file" name="img" className="input"/>
          <button className="btn btn_primary">save</button>
        </form>
      </div>
    );
  }
}
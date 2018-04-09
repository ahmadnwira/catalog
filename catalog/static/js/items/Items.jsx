import React from "react";
import $ from "jquery";
import ListItem from './ListItem';

class Items extends React.Component {
    constructor(){
        super();
        this.state = {
            items : [],
            filtered : [],
            description:'',
            id:''
        }
        this.filterCategories = this.filterCategories.bind(this);
        this.display_detailes = this.display_detailes.bind(this);
    }

    componentDidMount(){
        let URL = 'items';
        if(this.props.user){
            URL = '/user/'+this.props.user+'/items';
        }
        $.ajax({
            url: URL,
            success: function(result){
                let fetched_results = result.items_list.map((items)=>{
                    return {
                        item: items.item_name,
                        category: items.category,
                        img: items.image,
                        id: items.id
                    }
                });
                this.setState({ items: fetched_results });
            }.bind(this)
        });
    }

    filterCategories(e){
        let category_name = e.currentTarget.textContent;
        let filtred_list = this.state.items.filter((items, k)=>{
            return items.category === category_name;   
        })
        this.setState({filtered:filtred_list});
    }

    display_detailes(e){
        let id = e.currentTarget.id;
        $.ajax({
            url: "/item/description/"+e.currentTarget.id,
            success: function(result){
                this.setState({ description: result, id:id });
            }.bind(this)
        });
    }

    render(){

        let count = {}
        let categories_list = this.state.items.map((item, k)=>{
            if(!count[item.category]){
                count[item.category] = true
                return(
                    <li key={k}>
                        <p onClick={this.filterCategories}> 
                            {item.category}
                        </p> 
                    </li>
                );
            }
        });

        return (
            <div className="container">
                <ul className="list secondary"> {categories_list} </ul>
                <ul className="list main">
                    <ListItem
                        filtered_length={this.state.filtered.length}
                        items={this.state.items}
                        filtred={this.state.filtered}
                        description = {this.state.description}
                        display_detailes = {this.display_detailes}
                        id={this.state.id}
                        is_signed = {this.props.is_signed}
                    /> 
                </ul>
            </div>
        );
    }
}

export default Items;
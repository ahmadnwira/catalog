import React from "react";
import $ from 'jquery';

function List(props){
    let rv = props.items.map((items)=>{
        return(
            <li key={items.id} className="list_item" 
            onClick={props.display_detailes}
            id={items.id}>
                <img src={items.img} className="item_img"/>
                <p className="item_content">
                    {items.item}
                    <span className="hint"> {items.category} </span>
                    <span className="description">
                        {props.id == items.id ? props.description : ""}
                    </span>
                </p>
                <p>
                {
                    props.is_signed === true ? 
                    <a className="link" href={"items/"+items.id+"/manage"}> manage</a>: ''
                }
                </p>
            </li>
        )
    });

    return rv;
}


function ListItem(props){
    if(props.filtered_length === 0 ){
        return <List items={props.items}
                display_detailes={props.display_detailes}
                id={props.id}
                description={props.description}
                is_signed = {props.is_signed}
            />
    }
    return <List items={props.filtred}
                display_detailes={props.display_detailes}
                id={props.id}
                description={props.description}
                is_signed = {props.is_signed}
            />
}

export default ListItem;
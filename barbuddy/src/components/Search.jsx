import React, {useState} from "react";
import axios from "axios";

export default function Search() {

    const [msg,setMsg]=useState('')

    let submit=async(e)=>{
        e.preventDefault()

        try{
            alert("search complete")
            await axios.post("https://localhost:5000/",{
                msg
            })
        }
        catch(e){
            console.log(e);
        }
    }

    return (
        <div className='searchContent'>
            <form action="GET">
            <textarea name="search" onChange={(e)=>{setMsg(e.target.value)}} placeholder="search for a drink" cols="10" rows="10">
                <input type="submit" onClick={submit} value="Submit" />
            </textarea>
            </form>
        </div>
    )
}
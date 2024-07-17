import React, { Component } from "react";


class App extends Component{
    constructor(){
        super()
            this.state={
                notes:[]
            }
            this.API_URL="http://localhost:4000"
            this.addClick=this.addClick.bind(this)
        
    }

    componentDidMount(){
        this.refreshNotes()
    }

    async refreshNotes(){
        try{
            const response=await fetch(`${this.API_URL}/getNotes`)
            if(!response.ok){
                throw new Error('Error while trying to find the DB')
            }
            const data=await response.json()
            console.log('Data got:'+data)
            this.setState({notes:data})
        }catch(err){
                console.log('error: '+err+' while trying to fetch the API')
                this.setState({notes:[]})
        }

    }

    async addClick(){
        let newNote=document.getElementById("addNewNote").value
        const data=new FormData()
        data.append("newNote",newNote)
        try{
            const response=await fetch(`${this.API_URL}/addNote`,{
                method:"POST",
                body:data
            })
            if(!response.ok){
                throw new Error(`Network response was not ok:${response.statusText}`)
            }
            const result=await response.json()
            alert(result.message)
            this.refreshNotes()

        }catch(err){
            console.log('error while adding a Note:'+err)
        }
    }

    async deleteClick(id){
       try{
            const response=await fetch(`${this.API_URL}/deleteNote?id=${id}`,{
                method:"DELETE"
            })
            if(!response.ok){
                throw new Error('error error')
            }
            const result=await response.json()
            alert(result.message)
            this.refreshNotes()
       }catch(err){
            console.log('ERROR : '+err+' while deleting Note')
       }
      
    }

    render(){
        const {notes}=this.state
        return(
            <div className="App">
                <h2>To Do App</h2>
                <input id="addNewNote"/>&nbsp;
                <button onClick={()=>this.addClick()}>Add</button>
                <ul>
                {
                    notes.map(note=>(
                        <li key={note.id}>
                            <b>{note.description}</b>&nbsp;
                            <button onClick={()=>this.deleteClick(note.id)}>Delete</button>
                        </li>
                    ))
                }
                </ul>
              
            </div>
        )
    }
}
export default App

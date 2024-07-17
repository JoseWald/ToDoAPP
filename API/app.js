 const express = require('express')
const app = express()
const morgan=require('morgan')
const multer=require('multer')
const cors=require('cors')
const { default: mongoose } = require('mongoose')
const port = 4000

app.use((cors()))
   .use(morgan('dev'))
   .use(express.json())

const CONNECTION_STRING="mongodb://localhost:27017/ToDoApp"

mongoose.connect(CONNECTION_STRING)
 .then(()=>console.log('Connected succesfully with MongoDB via mongoose'))
 .catch(err=>console.log('error ::'+err+' when attempting to connect with mongoDB'))


const ToDoAppSchema=new mongoose.Schema({
    id:String,
    description:String
})

const ToDoAppCollection=mongoose.model('ToDoAppCollection',ToDoAppSchema,'ToDoAppCollection')

app.get('/getNotes', async (req,res)=>{
    try{
            const document=await ToDoAppCollection.find({})
            res.json(document)
            console.log(document)
    }catch(error){
            console.log('ERROR::'+error+' while trying to find the document')
            res.status(500).send(error)
    }
})

app.post('/addNote',multer().none(),async(req,res)=>{
    try{
        const collectionCount=await ToDoAppCollection.countDocuments({})
        const newNote=new ToDoAppCollection({
                id:(collectionCount+1).toString(),
                description:req.body.newNote
        })
        await newNote.save()
        res.status(201).json({message:"Note added succesfully"})
    }catch(err){
        console.log('ERROR:'+err+'while adding new note')
        res.status(500).send(err)
    }
})

app.delete('/deleteNote',async(req,res)=>{
        try{
                const result= await ToDoAppCollection.deleteOne({
                        id:req.query.id
                })
                if(result.deletedCount===1){
                        res.status(200).json({message:"note deleted"})
                }else{
                        res.status(404).json({message:"note not found"})
                }
                
        }catch(err){
                console.log('ERROR '+err+'while trying to delete note')
                res.status(500).send(err)
        }

})



app.use(({res})=>{
        const message="ERROR 404 ,PAGE NOT FOUND"
        res.status(404).json(message)
})
app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

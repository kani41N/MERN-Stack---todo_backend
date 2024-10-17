//using Express
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


//create an instance of express
const app = express();
app.use(express.json());
app.use(cors());

//simple in-memory storage for todo items
// let todos = []; 
 

// connecting mongodb
mongoose.connect('mongodb://localhost:27017/mern-app')
.then(() => {
  console.log('DB Connected');
})
.catch((err) => {
  console.log(err);
})

//creating schema
const todoSchema = new mongoose.Schema({
  title: {
    required: true,
    type: String
  },
  description: String
}) 

//creating model
const todomodel = mongoose.model('Todo', todoSchema);


//create a new item
app.post('/todos', async (req, res) => {
  const { title, description } = req.body;
  // const newTodo = {
  //   id: todos.length + 1,
  //   title,
  //   description
  // };
  // todos.push(newTodo);
  // console.log(todos);
  
  try {
    const newTodo = new todomodel({title, description});
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    console.log(error);
    res.status(500).json({message: error.message});
  }
  
})


//get all items
app.get('/todos', async (req, res) => {
  try {
   const todos = await todomodel.find();
   res.json(todos);
  } catch (error) {
    console.log(error);
    res.status(500).json({message: error.message});
  }
})

//update all items
app.put('/todos/:id', async(req, res) => {
  try {
      const {title, description} = req.body;
    const id = req.params.id;
    const updatedTodo = await todomodel.findByIdAndUpdate(
      id,
      {title, description},
      {new: true}
    )
    if (!updatedTodo){
      return res.status(404).json({message: "Todo not found"})
    }
    res.json(updatedTodo)
  } catch (error) {
    console.log(error)
    res.status(500).json({message: error.message});
  }
  
})

//delete item
app.delete('/todos/:id', async(req, res) => {
  try {
    const id = req.params.id;
    const deleteTodo = await todomodel.findByIdAndDelete(id);
    res.status(204).end();
  } catch (error) {
    console.log(error)
    res.status(500).json({message: error.message});
  }
})

//start the server
const port = 3000;
app.listen(port, () => {
    console.log('Server is listenting to port', + port);
})
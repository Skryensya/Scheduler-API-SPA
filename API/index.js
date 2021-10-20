//Dependencies 
    //Express (endpoints)
const express = require('express')
    // Use cors to allow all origins requests
const cors = require('cors') 
const app = express()
    //to parse JSON in the body of the request
app.use(express.json())
    //Using cors
app.use(cors())
    //controller
const controller = require('./Controllers/controller')

//Rotes - Endpoints (CRUD)

//Create
app.post('/api/appointments', controller.createAppointment)

//Read
    //1 - To get all the appointments (of a all time if 'date' param is not added)
app.get('/api/appointments/', controller.getAllAppointments)
    //2 - To get just one appointment
app.get('/api/appointments/:id', controller.getOneAppointment)
    
//Update
app.put('/api/appointments/:id', controller.editAppointment)

//Delete
    //Delete all appointments (with a given email)
app.delete('/api/appointments/', controller.deleteAppointment)
    //delete one appointment
app.delete('/api/appointments/:id', controller.deleteAppointment)

//Port handling
const port = process.env.PORT || 3000
app.listen(port, () => {console.log(`listening on port ${port}`)})

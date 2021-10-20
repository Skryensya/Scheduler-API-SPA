//Dependencies
    //Joi (Validation)
const Joi = require('joi')
    //Model (Database)
const Model = require('../Models/model')

async function validateDate(date){
    const schema = Joi.object({
        date: 
        Joi.string()
        .required()
        .trim()
        .pattern(/^(?:(?:31(-)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(-)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(-)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/, 'DD-MM-YY'),
    })
    return await schema.validate(date)
}
async function validateEmail(email){
    const schema = Joi.object({
        email: 
        Joi.string()
        .email()
        .required()
        .lowercase()
        .max(255)
    })
    return await schema.validate(email)
}
async function validateAppointment({appointment_date, start_time, email}){
    const newAppointment = {
        appointment_date,
        start_time,
        email
    }
    const schema = Joi.object({
        appointment_date: 
        Joi.string()
        .required()
        .trim()
        .pattern(/^(?:(?:31(-)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(-)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(-)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/, 'DD-MM-YY'),
        
        start_time: 
        Joi.string()
        .required()
        .trim()
        .pattern(/\b(09|[1][0-7])\b/, 'hh'), // Hour stored as a number between 09 and 17

        email: 
        Joi.string()
        .email()
        .required()
        .lowercase()
        .max(255)
    })
    return await schema.validate(newAppointment)
}
function dateParser(date){ 
    //Parse the date in DD-MM-YY to a ISO-8601 date "YY-MM-DDT04:00:00.000Z"
    return `${date.slice(6)}-${date.slice(3,5)}-${date.slice(0,2)}T04:00:00.000Z`
}
function checkWeekDay(appointment_date){
    const isoDate = dateParser(appointment_date)
    const date = new Date(isoDate)
    const weekDay = date.getDay() 
    if( weekDay > 0 && weekDay < 6){
        return true
    } else {
        return false
    }
}

module.exports = {
    
    async createAppointment(req, res){
        //Validate the new appointment
        if(!req.body) return res.status(400).send('Bad request')
        const {error, value} = await validateAppointment(req.body)
        //Check for errors, if so, return 400 and the error
        if(error) return res.status(422).send(error.message)
        //We have to check if that appointment is not already taken
        const isAvailable = await Model.checkIfAvailable(value.appointment_date, value.start_time)
        if(!isAvailable) return res.status(406).send('Appointment unavailable')
        //At last, we have to validate if it's a weekday or not
        const isValidWeekDay = checkWeekDay(value.appointment_date)
        if(!isValidWeekDay) return res.status(406).send('That is not a valid weekday')

        //If valid, add the appointment to the DB
        await Model.create('appointments',{
            appointment_date: value.appointment_date,
            start_time: value.start_time,
            email: value.email,
        })
        //return the created appointment
        res.status(201).send(await Model.findAppointment(value.appointment_date, value.start_time))
    },
    async getAllAppointments(req, res){
        const date = req.query.date
        const email = req.query.email
        if(date){ //checks if a 'date' param has been added
            const {error, value} = await validateDate({date})
            if(error) return res.status(400).send('Invalid Date')
            const appointments = await Model.selectWhere('appointments', 'appointment_date', value.date)
            return res.status(200).send(appointments)
        } else if(email){ //checks if an 'email' param has been added
            const {error, value} = await validateEmail({email})
            if(error) return res.status(400).send('Invalid Email')
            const appointments = await Model.selectWhere('appointments', 'email', value.email)
            return res.status(200).send(appointments)
        } else {
            //If not, gets all the Appointments
            //Query the Database to get all the appointments
            const appointments = await Model.selectAll('appointments');
            //check query result
            if( !appointments ){
                //in case of a bad request, send error 404
                return res.status(404).send('Appointments not found');
            } else { 
                //in case of success return the appointments
                return res.status(200).send(appointments);
            }
        }
    },
    async getOneAppointment(req, res){
        //Query to find the appointment
        const appointment = await Model.find('appointments', 'id', req.params.id)
        //evaluate the response
        if( !appointment ){
            //in case of a bad request, send error 404
            return res.status(404).send('Appointment with given id not found');
        } else { 
            //in case of success return the appointment
            return res.status(200).send(appointment);
        }
    },
    async editAppointment(req, res){
        //Validate if the appointment to edit exists
        prevoiusAppointment = await Model.find('appointments', 'id', req.params.id)
        if( !prevoiusAppointment ) return res.status(404).send('Appointment with given id not found')
        //Validate the new appointment
        if(!req.body) return res.status(400).send('Bad request')
        const {error, value} = await validateAppointment(req.body) //Value is the object with the (now) validated appointment data
        //Check for errors, if so, return 400 and the error details
        if(error) return res.status(400).send(error.details[0].message)
        //if the Date or the hour have changed...
        if(prevoiusAppointment.appointment_date != value.appointment_date || prevoiusAppointment.start_time != value.start_time ){
            //Check if the new date and hour are Available
            const isAvailable = await Model.checkIfAvailable(value.appointment_date, value.start_time)
            if(!isAvailable) return res.status(406).send('Appointment unavailable')
            //At last, we have to validate if it's a weekday or not
            const isValidWeekDay = checkWeekDay(value.appointment_date)
            if(!isValidWeekDay) return res.status(406).send('That is not a valid weekday')
        }
        //Query to update the Appointment
        const modifiedAppointment = await Model.modifyAppointment(req.params.id, value)
        //return the new appoitment
        return res.status(200).send(modifiedAppointment)
    },
    async deleteAppointment(req, res){
        if(req.query.email){ //checks if an 'email' param has been added
            let email = req.query.email
            email = email.replace('%40', '@')
            //Query to find the appointments to delete
            const appointments = await Model.find('appointments', 'email', email)
            if( !appointments ) return res.status(404).send('Appointments with given email not found')
            //Query to Delete them
            await Model.deleteByParam('appointments', 'email', email)
            //return the deleted appointments
            return res.status(200).send(appointments)
        } else if(req.params.id){            
            const id = req.params.id
            //Query to find the appointment to delete
            const appointment = await Model.find('appointments', 'id', id)
            if( !appointment ) return res.status(404).send('Appointment with given id not found')
            //Query to Delete it
            await Model.delete('appointments', id)
            //return the deleted appointment
            return res.status(200).send(appointment)
        } else {
            //Query to find All the appointments to delete
            const appointments = await Model.selectAll('appointments')
            if( appointments.lenght < 1 ) return res.status(404).send('There are no appointments')
            //Query to Delete them
            await Model.deleteAll('appointments')
            //return the deleted appointments
            return res.status(200).send(appointments)
        }
    }


}
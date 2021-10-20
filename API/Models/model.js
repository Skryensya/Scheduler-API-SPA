//Dependencies
    //dotenv (to read .env)
const dotenv = require('dotenv');
dotenv.config();

//Database conecction
const mysql = require(process.env.DB_CONNECTION);
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

module.exports = { //Model to export
    async create(table, data) { //Universal Create method (created by me for other project and re-used here)
        try {
            let fields = [];
            let placeholders = [];
            let values = [];
            for (field in data) {
                fields.push(field);
                placeholders.push('?');
                values.push(data[field]);
            }
            const result = await connection.promise().execute(`INSERT INTO ${table} (${fields.join(',')}) VALUES (${placeholders.join(', ')})`, values);
            return result;
        } catch (err) {
            console.log('create: ',err)
        }
    },
    async find(table, fieldName, fieldValue) { //Universal find method (created by me for other project and re-used here)
        try{
            let data = null
            const [ result ] = await connection.promise().execute(`SELECT * FROM ${table} WHERE ${fieldName} = "${fieldValue}";`)
            if (result.length > 0) {
                data = result[0]
            } else {
                data = false
            }
            return data
        }catch(err){
            console.log('find: ', err)
        }
    },
    async selectAll(table) { //simple method to get all the entries of a table
        const [ result ] = await connection.promise().execute(`SELECT * FROM ${table};`)
        return result
    },
    async selectWhere(table, fieldName, fieldValue) { //simple where query
        const [ result ] = await connection.promise().execute(`SELECT * FROM ${table} WHERE ${fieldName} = "${fieldValue}";`)
        return result
    },
    async checkIfAvailable(date, hour){ //method to see if we can book an appointment at a specifit date and time
        const [ unavailable ] = await connection.promise().execute(`SELECT id, start_time FROM appointments WHERE appointment_date = '${date}';`)
        const result = unavailable.find(appointment => appointment.start_time == hour)
        if(result){
            return false
        } else {
            return true
        }

    },
    async findAppointment(date, hour){ //Method to find the newly created Appointment with its ID
        try{
            const [ found ] = await connection.promise().execute(`SELECT * FROM appointments WHERE appointment_date = '${date}' AND start_time = '${hour}';`)
            return found
        }catch(err){
            console.log('findAppointment: ',err)
        }
    },
    async modifyAppointment(id, {appointment_date, start_time, name, email}){
        try{
            await connection.promise().execute(
                `UPDATE appointments 
                SET appointment_date = '${appointment_date}',
                start_time = '${start_time}',
                name = '${name}',
                email = '${email}'
                WHERE id = ${id};`
            );
            return {
                id,
                appointment_date,
                start_time,
                name,
                email
            }
        }catch(err){
            console.log('modifyAppointment: ',err)
        }
       
    },
    async delete(table, id){
        try{
            await connection.promise().execute(`DELETE FROM ${table} WHERE id = '${id}'`)
        }catch(err){
            console.log('delete: ',err)
        }
    },
    async deleteByParam(table, fieldName, fieldValue){
        try{
            await connection.promise().execute(`DELETE FROM ${table} WHERE ${fieldName} = '${fieldValue}'`)
        }catch(err){
            console.log('delete: ',err)
        }
    },
    async deleteAll(table){
        try{
            await connection.promise().execute(`DELETE FROM ${table}`)
        }catch(err){
            console.log('delete: ',err)
        }
    }
}
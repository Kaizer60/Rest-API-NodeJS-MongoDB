const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

const { MongoClient } = require("mongodb")
const uri = "mongodb://myUserAdmin:myUserAdmin@localhost:27017"

//Create
app.post('/users/create', async (req, res) => {
    const user = req.body
    let changTimezone = Date.now()+25200000 //ใช้คำสั่ง Date.now ดึงเวลาปัจจุบันมาเป็น มิลลิวินาที แล้วนำมาบวกเพิ่ม 7 ชม
    let thaiTimezone = new Date(changTimezone) //สร้างตัวแปลรับ Date ของโซนประเทศไทย
    const client = new MongoClient(uri)
    await client.connect();
    
    await client.db("mydb").collection("users").insertOne({
        id: parseInt(user.id),
        fname: user.fname,
        lname: user.lname,
        timeupdate: thaiTimezone
    });

    //console.log เพื่อตรวจสอบ date ว่าถูกต้องหรือไม่
    console.log(thaiTimezone) //ICT TIMEZONE
    console.log(new Date()) //UTC TIMEZONE

    await client.close();

    res.status(200).send({
        "status": "ok",
        "message": "User with ID" + user.id + " is created!",
        "user": user
    })
})

/*-------------------------------------------------------------------------------*/

//Read
app.get('/users/read', async (req, res) => {
    const client = new MongoClient(uri)
    await client.connect();
    
    const users = await client.db("mydb").collection("users").find({}).toArray();

    await client.close();

    res.status(200).send(users)
})

/*-------------------------------------------------------------------------------*/

//Read single
app.get('/users/read/:id', async (req, res) => {
    const id = parseInt(req.params.id)
    const client = new MongoClient(uri)
    await client.connect();
    
    const user = await client.db("mydb").collection("users").findOne({id});

    await client.close();

    res.status(200).send(user)
})

/*-------------------------------------------------------------------------------*/

//Update
app.put('/users/update/:id', async (req, res) => {
    const id = parseInt(req.params.id)
    const user = req.body
    let changTimezone = Date.now()+25200000 //ใช้คำสั่ง Date.now ดึงเวลาปัจจุบันมาเป็น มิลลิวินาที แล้วนำมาบวกเพิ่ม 7 ชม
    let thaiTimezone = new Date(changTimezone) //สร้างตัวแปลรับ Date ของโซนประเทศไทย
    const client = new MongoClient(uri)
    await client.connect();
    
    await client.db("mydb").collection("users").updateOne({id}, {"$set": {
        fname: user.fname,
        lname: user.lname,
        timeupdate: thaiTimezone
}});

    //console.log เพื่อตรวจสอบ date ว่าถูกต้องหรือไม่
    console.log(thaiTimezone) //ICT TIMEZONE
    console.log(new Date()) //UTC TIMEZONE

    await client.close();

    res.status(200).send({
        "status": "ok",
        "message": "User with ID: " + id + " is updated!",
        "user": user
    })
})

/*-------------------------------------------------------------------------------*/

//Delete
app.delete('/users/delete/:id', async (req, res) => {
    const id = parseInt(req.params.id)
    const client = new MongoClient(uri)
    await client.connect();
    
    const user = await client.db("mydb").collection("users").deleteOne({id});

    await client.close();

    res.status(200).send({
        "status": "ok",
        "message": "User with ID: " + id + " is deleted!"
    })
})
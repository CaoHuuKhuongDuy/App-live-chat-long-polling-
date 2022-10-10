const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const port = 3000

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.text());

let connection = []
let message_all = []


app.get('/',(req, res) => {
    res.sendFile(__dirname + "/index.html")
})

let id = 0;

app.get('/get_data',(req, res, next) => {
    res.setHeader("Content-Type", "text/html; charset=utf-8")
    res.setHeader("Transfer-Encoding", "chunked")
    console.log("request")
    id++
    connection.push([res,id])
})


app.post('/send',(req, res) => {
    let text = req.body
    connection.map((old_res) => {
        old_res[0].write(text)
        old_res[0].end()
        console.log(old_res[1])
    })
    connection = []
    res.end()
})

app.listen(port, () => {
    console.log(`App is listening on port ${port}`)
})


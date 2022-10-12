const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser') 
const cors = require('cors')
const app = express()
const port = 80


app.use(cookieParser())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.text());

let connection = []
let message_all = []

let username = []

let tick = 0


app.use((req, res, next) => {

    if (req.cookies.id == undefined || req.cookies.id >= tick) 
      {
        res.cookie('id', tick)
        username.push("")
        tick++
      }
    next()
})

app.use(express.static(__dirname))

function login(req, res) 
{
    if (req.cookies.id == undefined) return false
    return (username[req.cookies.id] != "");
} 

app.route('/').get((req, res) => {

    if (login(req, res)) res.redirect('/chat')
    res.sendFile(__dirname + "/views/login_form.html")
}).post((req, res) => {

    let cookie_id = req.cookies.id
    if (req.body.username == "") res.send("Username không được trống")
    else 
      {
        username[cookie_id] = req.body.username
        res.redirect('/chat')
      }
})


app.get('/chat',(req, res) => {
    if (!login(req,res)) res.redirect('/')
    res.sendFile(__dirname + "/views/index.html")
})

app.get('/show',(req, res) => {
    res.send(req.cookies)
})

let id = 0;

app.get('/get_data',(req, res, next) => {
    res.setHeader("Content-Type", "text/html; charset=utf-8")
    res.setHeader("Transfer-Encoding", "chunked")
    connection.push(res)
})

app.get('/load',(req, res) => {
    res.json({"all_chat" : message_all})
})

app.post('/send',(req, res) => {
    let text = username[req.cookies.id] + " : " + req.body
    message_all.push(text)
    connection.map((old_res) => {
        old_res.write(text)
        old_res.end()
    })
    connection = []
    res.end()
})

app.listen(port, () => {
    console.log(`App is listening on port ${port}`)
})


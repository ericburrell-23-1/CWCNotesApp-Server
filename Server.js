const express = require('express')
const mongoose = require('mongoose')
var app = express()
var Data = require('./noteSchema')
const networkIP = "10.0.0.111"

mongoose.connect("mongodb://localhost/CWCNotesAppDB")

mongoose.connection.once("open", () => {

    console.log("Connected to Database!")

}).on('error', (error) => {

    console.log("Failed to connect " + error)

})

// CREATE A NOTE
// POST request
app.post('/create', (req, res) => {
    var note = new Data({
        note: decodeURI(req.get("note")),
        title: decodeURI(req.get("title")),
        date: req.get("date")
    })

    note.save().then(() => {
        if (note.isNew == false) {
            console.log("Saved data!")
            res.send("Saved data!")
        } else {
            console.log("Failed to save data")
        }
    })
})

var server = app.listen(8081, networkIP, () => {
    console.log("Server is running! http://" + networkIP + ":8081/fetch")
})

// Access at http://10.0.0.111:8081/create

// FETCH ALL NOTES
// GET request
app.get('/fetch', (req, res) => {
    Data.find({}).then((DBItems) => {
        res.send(DBItems)
    })
})

// DELETE A NOTE
// POST request
app.post('/delete', (req, res) => {
    Data.findOneAndRemove({
        _id: req.get("id")
    }, (err) => {
        console.log("Failed " + err)
    })
    res.send("Deleted!")
})

// UPDATE A NOTE
// POST request
app.post('/update', (req, res) => {
    Data.findOneAndUpdate({
        _id: req.get('id')
    }, {
        title: decodeURI(req.get("title")),
        note: decodeURI(req.get("note")),
        date: req.get("date")
    }, (err) => {
        console.log('Failed to update ' + err)
    })
    res.send("Updated!")
})



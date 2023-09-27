import express from 'express'


const app = express()
const PORT = process.env.PORT || 5000


app.get("/", (req, res) => {
    res.send(`<h1> Hello ExpressJS </h1>`)
})


app.get("/json", (req, res) => {
    res.json({
        name: "OM",
        village: 'Mahwal'
    })
})

// Return current timestamp
app.get("/current-time", (req, res) => {
    res.json({
        currentTime: Date.now(),
    })
})

app.listen(PORT, () => {
    console.log(`Server running at ${PORT}`)
})

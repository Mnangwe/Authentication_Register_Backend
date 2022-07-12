const express = require('express')
const app = express()
const cors = require('cors')

let corsOptions = {
    origin:'http://localhost:8081'
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req,res) => {
    res.json({ msg: 'Welcome to Digital Academy application' })

})

const db = require('./app/models')
const Role = db.role

const dbConfig = require('./app/config/db.config')
const { count } = require('./app/models/user.model')

require("./app/routes/auth.routes")(app)
require("./app/routes/user.routes")(app)

db.mongoose.connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true

    })
    .then(() => {
        console.log("Successfully connected with MongoDB")
        initial()

        }).catch(err => {
            console.error('Connection error:', err)
            process.exit()
        })

function initial(){
    Role.estimatedDocumentCount((err, count) => {
        if(!err && count === 0){
            new Role({
                name: 'user'
            }).save(err => {
                if(err){
                    console.log('error', err)
                }
                console.log("Added 'user' to roles collection")
            })

            new Role({
                name: 'moderator'
            }).save(err => {
                if(err){
                    console.log('error', err)
                }
                console.log("Added 'moderator' to roles collection")
            })

            new Role({
                name: 'admin'
            }).save(err => {
                if(err){
                    console.log('error', err)
                }
                console.log("Added 'admin' to roles collection")
            })
        }
    })
}

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
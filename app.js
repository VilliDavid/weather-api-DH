const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const path = require('path')

// const url = 'http://api.weatherstack.com/current?access_key=1e6d8d82891cfcf6c36d345a49067c35&query=Chiapas&lenguaje=es'

// Setting
const port = process.env.PORT || 3000
app.set('json spaces', 2)
app.set('view engine', 'hbs')

// middlewares
app.use(morgan('dev'))
app.use(express.json())
app.use(cors())
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));

// Router
app.get('/', (req, res) => {
    // res.sendFile(path.resolve(__dirname,'views/index.html'))
    if (req.query.lugar) {
        const axios = require('axios');
        const params = {
            access_key: '1e6d8d82891cfcf6c36d345a49067c35',
            query: req.query.lugar
        }

        axios.get('http://api.weatherstack.com/current', {params})
            .then(response => {
                const apiResponse = response.data
                console.log(apiResponse)
                // res.send(`<p>En ${apiResponse.location.country} la temperatura es de ${apiResponse.current.temperature} ℃ y se encuentra como ${apiResponse.current.weather_descriptions}</p>`)
                res.render('index', {
                    information: `En ${apiResponse.request.query} la temperatura es de ${apiResponse.current.temperature} ℃ y el clima es ${apiResponse.current.weather_descriptions}`,
                    urlimagen: `${apiResponse.current.weather_icons}`
                })
            }).catch(error => {
                res.render('index', {
                    information: 'Localización no encontrada, favor de seleccionar otro lugar',
                    urlimagen: 'https://t2.uc.ltmcdn.com/images/5/7/2/img_cual_es_la_diferencia_entre_tiempo_y_clima_24275_600.jpg'
                })
            });
    } else {
        res.render('index', {
            information: 'Esperando la ubicación a encontrar',
            urlimagen: 'https://t2.uc.ltmcdn.com/images/5/7/2/img_cual_es_la_diferencia_entre_tiempo_y_clima_24275_600.jpg'
        })
    }
})

// Inicialización del servidor
app.listen(port, () => {
    console.log('Servidor en puerto ' + port)
})
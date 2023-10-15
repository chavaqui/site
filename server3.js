const newsCrud = require('./lib/news-validation')
const express = require('express')
const app = express()

app.use(newsCrud.getValidation)
app.use(newsCrud.verifyAddress)
app.use(newsCrud.verifyName)
app.use(newsCrud.verbGetnews)

app.get('/a', (req, res) => {
    console.log('PETICION GET REALIZADA');
    res.status(200).send('XchavaquiX') //revisar que a veces devuelve el cache 304 y no el 200
})

app.listen(3000, () => {
    console.log(`estoy en el puerto 3000, 
    presione Ctrl + C to stop...` )
})
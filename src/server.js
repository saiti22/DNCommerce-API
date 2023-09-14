require('dotenv').config()

const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

app.use((error, req, res, next) => {
    console.error(error.stack)
    res.status(500).send('Something broke!')
})

//Rotas: usuario, produtos, pedido, estoque e venda

const userRouter = require('./routes/usuario')
app.use('/usuario', userRouter)
const estoqueRouter = require('./routes/estoque')
app.use('/estoque', estoqueRouter)
const produtoRouter = require('./routes/produto')
app.use('/produto', produtoRouter)


app.listen(process.env.PORT, () => console.log(`Server Started | http://localhost/${process.env.PORT}`))
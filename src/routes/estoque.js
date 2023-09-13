const express = require('express')
const { getUmEstoque, getTodosEstoque, diminuiEstoque, aumentaEstoque } = require('../db')
const router = express.Router()

//GET ALL
router.get('/', async (req,res) =>{
    try {
        const estoque = await getTodosEstoque()
        res.send(estoque)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }  
})

//GET ONE
router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const estoque = await getUmEstoque(id)
        res.send(estoque)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//REDUZ ESTOQUE
router.patch('/dim/:id', async (req, res) => {
    try {
        const { quantidade } = req.body
        const id = req.params.id
        const estoque = await diminuiEstoque(id, quantidade)
        const estoqueAtualizado = await getUmEstoque(id)
        res.status(200).send(estoqueAtualizado) 
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//AUMENTA ESTOQUE
router.patch('/aum/:id', async (req, res) => {
    try {
        const { quantidade } = req.body
        const id = req.params.id
        const estoque = await aumentaEstoque(id, quantidade)
        const estoqueAtualizado = await getUmEstoque(id)
        res.status(200).send(estoqueAtualizado) 
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router
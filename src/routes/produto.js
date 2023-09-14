const express = require('express')
const { getProdutos, getProduto, createProduto, updateProduto, deleteProduto, createEstoque } = require('../db')
const router = express.Router()

//GET ALL
router.get('/', async (req,res) =>{
    try {
        const produtos = await getProdutos()
        res.send(produtos)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//GET ONE
router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const produto = await getProduto(id)
        res.send(produto)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//CREATE ONE
router.post('/', async (req, res) => {
    try {
        const { nome, descricao, valor, quantidade } = req.body
        const produto = await createProduto(nome, descricao, valor, quantidade)
        res.status(201).send(produto)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//UPDATE ONE
router.patch('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const { nome, descricao, valor } = req.body
        const produto = await updateProduto(nome, descricao, valor, id)
        res.status(200).send(produto)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//DELETE ONE
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id
        await deleteProduto(id)
        res.status(200).json({ message: `Produto de id: ${id} deletado com sucesso!`})
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

module.exports = router
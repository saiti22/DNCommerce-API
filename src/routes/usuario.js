const express = require('express')
const { getUsuarios, getUsuario, createUsuario, deleteUsuario, updateUsuario } = require('../db')
const router = express.Router()


//getting all
router.get('/', async (req, res) => {
    try {
        const usuarios = await getUsuarios()
        res.send(usuarios)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }    
})

//getting one
router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const usuario = await getUsuario(id)
        res.send(usuario)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }    
})

//creating one
router.post('/', async (req, res) => {
    try {
        const { nome, email, senha } = req.body
        const usuario = await createUsuario(nome, email, senha)
        res.status(201).send(usuario)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }    
})

//updating one
router.patch('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const { nome, email, senha } = req.body
        const usuario = await updateUsuario(nome, email, senha, id)
        res.status(200).send(usuario)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//deleting one
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id
        await deleteUsuario(id)
        res.status(200).json({ message: 'Usuário deletado com sucesso!'})
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

module.exports = router
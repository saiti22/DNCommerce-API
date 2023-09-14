const express = require('express')
const { getPedidos, getPedidoId, getPedidoCliente, createPedido, deletePedido, finalizaPedido } = require('../db')
const router = express.Router()

//GET ALL
router.get('/', async (req, res) => {
    try {
        const pedidos = await getPedidos()
        res.send(pedidos)
    } catch (error) {
        res.status(500).json({ message: error.message })
    } 
})

//GET ONE
router.get('/:id', async (req, res) => {
    try {
        const { tipoBusca } = req.body 
        const id = req.params.id
        let pedido
        if (tipoBusca == 'pedido') {
            pedido = await getPedidoId(id)
        } else if (tipoBusca == 'cliente'){
            pedido = await getPedidoCliente(id)
        }        
        res.send(pedido)
    } catch (error) {
        res.status(500).json({ message: error.message })
    } 
})

//CREATE ONE
router.post('/', async (req, res) => {
    try {
        const { id_cliente, id_produto, quantidade_produto } = req.body
        const pedido = await createPedido(id_cliente, id_produto, quantidade_produto)
        res.status(201).send(pedido)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }    
})

//DELETE ONE
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id
        await deletePedido(id)
        res.status(200).json({ message: 'Pedido deletado com sucesso!'})
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//FINALIZAR PEDIDO
router.patch('/:id', async (req, res) => {
    try {
        const id = req.params.id
        await finalizaPedido(id)
        res.status(200).json({ message: 'Pedido concluído com sucesso!'})
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

module.exports = router
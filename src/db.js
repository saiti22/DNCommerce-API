const mysql = require('mysql2')
require('dotenv').config()

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE
}).promise()

//USUÁRIOS
const getUsuarios = async () => {
    const [rows] = await pool.query('SELECT * FROM usuarios')
    return rows
}

const getUsuario = async (id) => {
    const [row] = await pool.query(`
        SELECT * 
        FROM usuarios
        WHERE id = ?
    `, [id])
    return row[0]
}

const createUsuario = async (nome, email, senha) => {
    const [result] = await pool.query(`
        INSERT INTO usuarios (nome, email, senha)
        VALUES (?, ?, ?)
    `, [nome, email, senha])
    const id = result.insertId
    return getUsuario(id)
}

const updateUsuario = async (nome, email, senha, id) => {
    await pool.query(`
        UPDATE usuarios
        SET nome = ?,
            email = ?,
            senha = ?
        WHERE id = ?
    `, [nome, email, senha, id])
}

const deleteUsuario = async (id) => {
    await pool.query(`
        DELETE FROM usuarios
        where id = ?
    `, [id])
}


//ESTOQUE
//GET ALL
const getTodosEstoque = async () => {
    const [rows] = await pool.query(`
        SELECT produtos.nome, estoque.quantidade 
        FROM estoque 
        INNER JOIN produtos 
        ON estoque.id_produto = produtos.id
    `)
    return rows
}

//GET ONE
const getUmEstoque = async (id) =>{
    const [row] = await pool.query(`
        SELECT produtos.nome, estoque.quantidade 
        FROM estoque 
        INNER JOIN produtos 
        ON estoque.id_produto = produtos.id 
        WHERE produtos.id = ?
    `, [id])
    return row[0]
}

//CREATE ONE
const createEstoque = async (id_produto, quantidade) => {
    const [result] = await pool.query(`
        INSERT INTO estoque (id_produto, quantidade )
        VALUES (?, ?)
    `, [id_produto, quantidade])
    const id = result.insertId
    return getUmEstoque(id)
}

//UPDATE ONE
const diminuiEstoque = async (id, quantidade) => {
    await pool.query(`
        UPDATE estoque 
        SET quantidade = quantidade - ? 
        WHERE id_produto = ?
        AND quantidade > 0
        AND ? <= quantidade
    `, [quantidade, id, quantidade])
}

const aumentaEstoque = async (id, quantidade) => {
    await pool.query(`
        UPDATE estoque 
        SET quantidade = quantidade + ? 
        WHERE id_produto = ?
    `, [quantidade, id])
}


//PRODUTO
//GET ALL
const getProdutos = async () => {
    const [rows] = await pool.query(`
        SELECT * 
        FROM produtos
    `)
    return rows
}

//GET ONE
const getProduto = async (id) => {
    const [row] = await pool.query(`
        SELECT * 
        FROM produtos
        WHERE id = ?
    `, [id])
    return row[0]
}

//CREATE ONE
const createProduto = async (nome, descricao, valor, quantidade) => {
    const [result] = await pool.query(`
        INSERT INTO produtos (nome, descricao, valor)
        VALUES (?, ?, ?)
    `, [nome, descricao, valor])
    const id = result.insertId
    createEstoque(id, quantidade)
    return getProduto(id)
}

//UPDATE ONE
const updateProduto = async (nome, descricao, valor, id) => {
    await pool.query(`
        UPDATE produtos
        SET nome = ?,
            descricao = ?,
            valor = ?
        WHERE id = ?
    `, [nome, descricao, valor, id])
}

//DELETE ONE
const deleteProduto = async (id) => {
    await pool.query(`
        DELETE FROM produtos
        where id = ?
    `, [id])
}

// AINDA NÃO SEI SE TRECHO ABAIXO É NECESSÁRIO
// //ADD PRODUTO
// const adicionaProduto = async (id_pedido, id_produto) => {
//     const addProduto = await pool.query(`
//         INSERT INTO pedidos_produtos (id_pedidos, id_produtos)
//         VALUES (?, ?)
//     `, [id_pedido, id_produto])
//     return produto
// }

// //SUB PRODUTO
// const retirarProduto = async (id_pedido, id_produto) => {
//     const subProduto = await pool.query(`
//         DELETE FROM pedidos_produtos
//         WHERE id_pedidos = ?
//             AND id_produtos = ?
//     `, [id_pedido, id_produto])
// }

//PEDIDO
//GET ALL
const getPedidos = async () => {
    const [rows] = await pool.query(`
        SELECT usuarios.nome as cliente, pedidos.id as id_pedido, produtos.id as id_produto, produtos.nome, produtos.descricao, produtos.valor, pedidos.pago
        FROM produtos  
        INNER JOIN pedidos_produtos ON produtos.id = pedidos_produtos.id_produtos 
        INNER jOIN pedidos ON pedidos.id = pedidos_produtos.id_pedidos
        INNER JOIN usuarios on pedidos.id_clientes = usuarios.id
    `)
    return rows
}

//GET ONE
const getPedidoId = async (id) => {
    const [rows] = await pool.query(`
        SELECT usuarios.nome as cliente, pedidos.id as id_pedido, produtos.id as id_produto, produtos.nome, produtos.descricao, produtos.valor, pedidos.pago
        FROM produtos  
        INNER JOIN pedidos_produtos ON produtos.id = pedidos_produtos.id_produtos 
        INNER jOIN pedidos ON pedidos.id = pedidos_produtos.id_pedidos
        INNER JOIN usuarios on pedidos.id_clientes = usuarios.id
        WHERE pedidos.id = ?
    `, [id])
    return rows
}

const getPedidoCliente = async (id) => {
    const [rows] = await pool.query(`
        SELECT usuarios.nome as cliente, pedidos.id as id_pedido, produtos.id as id_produto, produtos.nome, produtos.descricao, produtos.valor, pedidos.pago
        FROM produtos  
        INNER JOIN pedidos_produtos ON produtos.id = pedidos_produtos.id_produtos 
        INNER jOIN pedidos ON pedidos.id = pedidos_produtos.id_pedidos
        INNER JOIN usuarios on pedidos.id_clientes = usuarios.id
        WHERE usuarios.id = ?
    `, [id])
    return rows
}

//CREATE ONE
const createPedido = async (id_cliente, id_produto, quantidade_produto) => {
    const [pedido] = await pool.query(`
        INSERT INTO pedidos (id_cliente)
        VALUES (?)
    `, [id_cliente])
    const id_pedido = pedido.insertId
    for (let i = 0; i < quantidade_produto; i++) {
        createPedidos_Produtos(id_pedido, id_produto)        
    }
}

//DELETE ONE
const deletePedido = async (id_pedido) => {
    await pool.query(`
        DELETE FROM pedidos
        WHERE id = ?
    `,[id_pedido])
    deletePedidos_Produtos(id_pedido)
}

//FINALIZA PEDIDO/COMPRA
const finalizaPedido = async (id_pedido) => {
    await pool.query(`
        UPDATE pedidos (pago)
        values (true)
        WHERE id = ?
    `, [id_pedido])
    createVenda(id_pedido)
}


const createPedidos_Produtos = async (id_pedido, id_produto) => {
    const pedido_produto = await pool.query(`
        INSERT INTO pedidos_produtos (id_pedidos, id_produtos)
        VALUES (?, ?)
    `, [id_pedido, id_produto])
}

const deletePedidos_Produtos = async (id_pedido) => {
    await pool.query(`
        DELETE FROM pedidos_produtos
        WHERE id_pedidos = ?
    `, [id_pedido])
}

const createVenda = async (id_pedido) => {
    await pool.query(`
        INSERT INTO vendas (id_pedidos)
        VALUES (?)
    `, [id_pedido])
}


module.exports = { getUsuario, getUsuarios, createUsuario, updateUsuario, deleteUsuario }
module.exports = { getTodosEstoque, getUmEstoque, createEstoque, diminuiEstoque, aumentaEstoque }
module.exports = { getProduto, getProdutos, createProduto, updateProduto, deleteProduto }
module.exports = { getPedidos, getPedidoId, getPedidoCliente, createPedido, deletePedido, finalizaPedido }

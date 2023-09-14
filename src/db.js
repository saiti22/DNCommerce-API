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


module.exports = { getUsuario, getUsuarios, createUsuario, updateUsuario, deleteUsuario }
module.exports = { getTodosEstoque, getUmEstoque, createEstoque, diminuiEstoque, aumentaEstoque }
module.exports = { getProduto, getProdutos, createProduto, updateProduto, deleteProduto }

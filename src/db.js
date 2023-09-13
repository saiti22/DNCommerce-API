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

//UPDATE ONE
const diminuiEstoque = async (id, quantidade) => {
    await pool.query(`
        UPDATE estoque 
        SET quantidade = quantidade - ? 
        WHERE id_produto = ?
    `, [quantidade, id])
}

const aumentaEstoque = async (id, quantidade) => {
    await pool.query(`
        UPDATE estoque 
        SET quantidade = quantidade + ? 
        WHERE id_produto = ?
    `, [quantidade, id])
}

module.exports = {getUsuario, getUsuarios, createUsuario, updateUsuario, deleteUsuario}
module.exports = {getTodosEstoque, getUmEstoque, diminuiEstoque, aumentaEstoque}

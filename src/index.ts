import { type RowDataPacket, type ResultSetHeader } from 'mysql2/promise';
import express from 'express';
import connection from './mysql_connection.js';
import MysqlErrorHandle from './mysql_error_handle.js';
const app = express()
app.use(express.json())

interface IPessoa extends RowDataPacket {
    id: number,
    nome: string,
}
interface IProduto extends RowDataPacket {
    id: number,
    nome: string,
    categoria: string,
    preco: number,
    data_criacao: Date,
    data_modificacao: Date
}




app.get("/pessoas", async (req, res) => {
    try {
        const [dados, campos] =
            await connection.execute<IPessoa[]>('SELECT * FROM pessoa')
        res.status(200).json(dados)
    } catch (err) {
        const mysqlErrorHandle = new MysqlErrorHandle(err, res)
        mysqlErrorHandle.validar()
    }
})
app.post("/pessoas", async (req, res) => {
    const { id, nome } = req.body
    try {
        const [result] =
            await connection
                .execute<ResultSetHeader>('INSERT INTO pessoa VALUES (?,?)', [id, nome])
        if (result.affectedRows === 0)
            return res.status(500).json({ mensagem: "Erro ao inserir!" })
        return res.status(201).json({ mensagem: "Sucesso ao inserir!" })

    } catch (err) {
        const mysqlErrorHandle = new MysqlErrorHandle(err, res)
        mysqlErrorHandle.validar()
    }
})



app.post("/cadastro_produto", async (req, res) => {
    const { id, nome, categoria, preco, data_criacao, data_modificacao } = req.body

    if (id == '' || id == null || nome == '' || categoria == '' || preco == '' || data_criacao == '' || data_modificacao == '') {
        return res.status(500).json({ mensagem: "Dados enviados no formato errado, confira o JSON" })
    }

    try {
        const [result] =
            await connection
                .execute<ResultSetHeader>('INSERT INTO produto VALUES (?,?,?,?,?,?)',
                    [id, nome, categoria, preco, data_criacao, data_modificacao])
        if (result.affectedRows === 0)
            return res.status(500).json({ mensagem: "Erro ao inserir!" })
        return res.status(201).json({ mensagem: "Sucesso ao inserir!" })

    } catch (err) {
        const mysqlErrorHandle = new MysqlErrorHandle(err, res)
        mysqlErrorHandle.validar()
    }
})

app.get("/listar_produtos", async (req, res) => {
    try {
        const [dados, campos] =
            await connection.execute<IProduto[]>('SELECT * FROM produto')
        res.status(200).json(dados)
    } catch (err) {
        const mysqlErrorHandle = new MysqlErrorHandle(err, res)
        mysqlErrorHandle.validar()
    }
})
app.get("/listar_produtos_informatica", async (req, res) => {
    try {
        const [dados, campos] =
            await connection.execute<IProduto[]>('SELECT * FROM produto WHERE categoria="informática"')
        res.status(200).json(dados)
    } catch (err) {
        const mysqlErrorHandle = new MysqlErrorHandle(err, res)
        mysqlErrorHandle.validar()
    }
})
app.get("/listar_produtos_caros", async (req, res) => {
    try {
        const [dados, campos] =
            await connection.execute<IProduto[]>('SELECT * FROM produto WHERE preco>100')
        res.status(200).json(dados)
    } catch (err) {
        const mysqlErrorHandle = new MysqlErrorHandle(err, res)
        mysqlErrorHandle.validar()
    }
})
app.listen(8000, () => {
    console.log("Iniciando o servidor na porta 8000")
})
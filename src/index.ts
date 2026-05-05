import { type RowDataPacket, type ResultSetHeader } from 'mysql2/promise';
import express from 'express';
import connection from './mysql_connection.js';
import MysqlErrorHandle from './mysql_error_handle.js';
import cors from 'cors'
const app = express()
app.use(cors())
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

// 1......
// Crie uma rota '\cliente_data_pedido' que retorne os clientes e a data que os mesmos fizeram 
// o pedido. Para realizar isso, utilize o comando inner join para juntar as tabelas. 
// Utilize o banco de dados chamado  dbteremercado

// SELECT nome,datapedido FROM clientes c 
//                      INNER JOIN pedidos p ON c.idclientes=p.clientes_idclientes
app.get("/cliente_data_pedido", async (req, res) => {
    try {
        console.log("Chamei a função no backend")
        const [dados, campos] =
            await connection.execute('SELECT nome,datapedido FROM clientes c INNER JOIN pedidos p ON c.idclientes=p.clientes_idclientes')
        res.status(200).json(dados)
    } catch (err) {
        const mysqlErrorHandle = new MysqlErrorHandle(err, res)
        mysqlErrorHandle.validar()
    }
})
// 2 Crie uma rota chamada '\pedidos_2026' que retorne 
// idclientes, nome, cidade, idade,idpedidos,datapedido dos pedidos feitos no ano
// de 2026.
app.get("/pedidos_2026", async (req, res) => {
    try {
        const [dados, campos] =
            await connection.execute(`SELECT idclientes, nome, cidade, idade,idpedidos,datapedido FROM clientes c INNER JOIN pedidos p ON c.idclientes=p.clientes_idclientes WHERE p.datapedido BETWEEN '2026-1-1' AND '2026-12-31'`)
        res.status(200).json(dados)
    } catch (err) {
        const mysqlErrorHandle = new MysqlErrorHandle(err, res)
        mysqlErrorHandle.validar()
    }
})

// 3.Crie uma rota chamada '\quantidade_pedidos' que retorne 
// um json no formato '{quantidade_pedidos:100}' com a quantidade de pedidos cadastrados
// na tabela pedidos. USE O COMANDO COUNT(*) para contar as quantidades.
app.get("/quantidade_pedidos", async (req, res) => {
    try {
        const [dados, campos] =
            await connection.execute(`SELECT COUNT(idpedidos) as quantidade_pedidos FROM pedidos`)
        res.status(200).json(dados)
    } catch (err) {
        const mysqlErrorHandle = new MysqlErrorHandle(err, res)
        mysqlErrorHandle.validar()
    }
})
// 4 Crie uma rota chamada '\quantidade_pedidos_clientes' que retorne
// um json no formato '[{nome:"tere",quantidade_pedidos:1000}]' que retorne 
// todos os clientes e a quantidade de pedidos que cada cliente fez
app.get("/quantidade_pedidos_clientes", async (req, res) => {
    try {
        const [dados, campos] =
            await connection.execute(`SELECT nome, COUNT(*) as quantidade_pedidos FROM clientes c INNER JOIN pedidos p ON c.idclientes=p.clientes_idclientes GROUP BY idclientes`)
        res.status(200).json(dados)
    } catch (err) {
        const mysqlErrorHandle = new MysqlErrorHandle(err, res)
        mysqlErrorHandle.validar()
    }
})




app.listen(8000, () => {
    console.log("Iniciando o servidor na porta 8000")
})
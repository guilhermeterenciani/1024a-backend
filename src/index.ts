import mysql, { type RowDataPacket, type Connection, type ResultSetHeader } from 'mysql2/promise';
import express from 'express';
const app = express()
app.use(express.json())

interface IPessoa extends RowDataPacket {
    id: number,
    nome: string,
}
interface IProduto extends RowDataPacket {
    id:number,
    nome:string,
    categoria:string,
    preco:number,
    data_criacao:Date,
    data_modificacao:Date
}

const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'luademel',
});

app.get("/pessoas", async (req, res) => {
    try {
        const [dados, campos] =
            await connection.execute<IPessoa[]>('SELECT * FROM pessoa')
        res.status(200).json(dados)
    } catch (err) {
        console.log(err)
        if (err instanceof Error && 'code' in err && err.code === 'ECONNREFUSED') {
            return res.status(500).json({ mensagem: "ERRO: LIGUE O LARAGON e confira o usuário e senha da conexão" })
        } else if (err instanceof Error && 'code' in err && err.code === 'ENOTFOUND') {
            return res.status(500).json({ mensagem: "ERRO: Você digitou algo errado no host da conexão" })
        } else if (err instanceof Error && 'code' in err && err.code === 'ER_BAD_DB_ERROR') {
            return res.status(500).json({ mensagem: "ERRO: Confira o nome do banco de dados ou crie um banco com o nome que você passou na conexão" })
        } else if (err instanceof Error && 'code' in err && err.code === 'ER_ACCESS_DENIED_ERROR') {
            return res.status(500).json({ mensagem: "ERRO: Confira usuario e senha na conexão" })
        } else if (err instanceof Error && 'code' in err && err.code === 'ER_PARSE_ERROR') {
            return res.status(500).json({ mensagem: "ERRO: Você tem um erro na sua SQL, confira o Execute" })
        } else if (err instanceof Error && 'code' in err && err.code === 'ER_NO_SUCH_TABLE') {
            return res.status(500).json({ mensagem: "ERRO: Você digitou o nome da tabela errado, confira o Execute!" })
        } else {
            return res.status(500).json({ mensagem: "ERRO: Desconhecido!" })
        }
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
        console.log(err)
        if (err instanceof Error && 'code' in err && err.code === 'ECONNREFUSED') {
            return res.status(500).json({ mensagem: "ERRO: LIGUE O LARAGON e confira o usuário e senha da conexão" })
        } else if (err instanceof Error && 'code' in err && err.code === 'ENOTFOUND') {
            return res.status(500).json({ mensagem: "ERRO: Você digitou algo errado no host da conexão" })
        } else if (err instanceof Error && 'code' in err && err.code === 'ER_BAD_DB_ERROR') {
            return res.status(500).json({ mensagem: "ERRO: Confira o nome do banco de dados ou crie um banco com o nome que você passou na conexão" })
        } else if (err instanceof Error && 'code' in err && err.code === 'ER_ACCESS_DENIED_ERROR') {
            return res.status(500).json({ mensagem: "ERRO: Confira usuario e senha na conexão" })
        } else if (err instanceof Error && 'code' in err && err.code === 'ER_PARSE_ERROR') {
            return res.status(500).json({ mensagem: "ERRO: Você tem um erro na sua SQL, confira o Execute" })
        } else if (err instanceof Error && 'code' in err && err.code === 'ER_NO_SUCH_TABLE') {
            return res.status(500).json({ mensagem: "ERRO: Você digitou o nome da tabela errado, confira o Execute!" })
        } else {
            return res.status(500).json({ mensagem: "ERRO: Desconhecido!" })
        }
    }
})

app.post("/cadastro_produto", async (req, res) => {
    const { id, nome, categoria, preco, data_criacao, data_modificacao } = req.body

    if(id==''||id==null||nome==''||categoria==''||preco==''||data_criacao==''||data_modificacao==''){
        return res.status(500).json({mensagem:"Dados enviados no formato errado, confira o JSON"})
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
        console.log(err)
        if (err instanceof Error && 'code' in err && err.code === 'ECONNREFUSED') {
            return res.status(500).json({ mensagem: "ERRO: LIGUE O LARAGON e confira o usuário e senha da conexão" })
        } else if (err instanceof Error && 'code' in err && err.code === 'ENOTFOUND') {
            return res.status(500).json({ mensagem: "ERRO: Você digitou algo errado no host da conexão" })
        } else if (err instanceof Error && 'code' in err && err.code === 'ER_BAD_DB_ERROR') {
            return res.status(500).json({ mensagem: "ERRO: Confira o nome do banco de dados ou crie um banco com o nome que você passou na conexão" })
        } else if (err instanceof Error && 'code' in err && err.code === 'ER_ACCESS_DENIED_ERROR') {
            return res.status(500).json({ mensagem: "ERRO: Confira usuario e senha na conexão" })
        } else if (err instanceof Error && 'code' in err && err.code === 'ER_PARSE_ERROR') {
            return res.status(500).json({ mensagem: "ERRO: Você tem um erro na sua SQL, confira o Execute" })
        } else if (err instanceof Error && 'code' in err && err.code === 'ER_NO_SUCH_TABLE') {
            return res.status(500).json({ mensagem: "ERRO: Você digitou o nome da tabela errado, confira o Execute!" })
        } else {
            return res.status(500).json({ mensagem: "ERRO: Desconhecido!" })
        }
    }
})

app.get("/listar_produtos", async (req, res) => {
    try {
        const [dados, campos] =
            await connection.execute<IProduto[]>('SELECT * FROM produto')
        res.status(200).json(dados)
    } catch (err) {
        console.log(err)
        if (err instanceof Error && 'code' in err && err.code === 'ECONNREFUSED') {
            return res.status(500).json({ mensagem: "ERRO: LIGUE O LARAGON e confira o usuário e senha da conexão" })
        } else if (err instanceof Error && 'code' in err && err.code === 'ENOTFOUND') {
            return res.status(500).json({ mensagem: "ERRO: Você digitou algo errado no host da conexão" })
        } else if (err instanceof Error && 'code' in err && err.code === 'ER_BAD_DB_ERROR') {
            return res.status(500).json({ mensagem: "ERRO: Confira o nome do banco de dados ou crie um banco com o nome que você passou na conexão" })
        } else if (err instanceof Error && 'code' in err && err.code === 'ER_ACCESS_DENIED_ERROR') {
            return res.status(500).json({ mensagem: "ERRO: Confira usuario e senha na conexão" })
        } else if (err instanceof Error && 'code' in err && err.code === 'ER_PARSE_ERROR') {
            return res.status(500).json({ mensagem: "ERRO: Você tem um erro na sua SQL, confira o Execute" })
        } else if (err instanceof Error && 'code' in err && err.code === 'ER_NO_SUCH_TABLE') {
            return res.status(500).json({ mensagem: "ERRO: Você digitou o nome da tabela errado, confira o Execute!" })
        } else {
            return res.status(500).json({ mensagem: "ERRO: Desconhecido!" })
        }
    }
})



/**
 * No banco de dados 'luademel' crie uma nova tabela chamada produto
 * Na tabela produto, crie os seguintes atributos 
 * 
 *  id, nome, categoria, preco, data_criacao, data_modificacao
 * 
 * 
 * Crie uma rota chamada `listar_produtos` que retorne todos
 * os produtos cadastrados no banco de dados
 * 
 * Crie uma rota chamada `listar_produtos_informatica` que retorne
 * todos os produtos da categoria informatica
 * 
 * Crie uma rota chamada `listar_produtos_caros` que retorne os produtos
 * que custem mais de R$: 100,00
 * 
 */





app.listen(8000, () => {
    console.log("Iniciando o servidor na porta 8000")
})
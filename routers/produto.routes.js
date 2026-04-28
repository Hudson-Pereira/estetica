const express = require('express');
const router = express.Router();
const prisma = require('../utils/prismaClient');
const { validations, handleValidationErrors } = require('../utils/validators');

router.get("/", async (req, res) => {
    try {
        const produtos = await prisma.produtos.findMany({})
        res.status(200).render('produto', { 
            produtos: produtos, 
            message: ``,
            csrfToken: req.csrfToken()
        })
    } catch (err) {
        console.error(`Rota /produto: ${err.message}`)
        res.status(500).render('error', { message: 'Erro ao carregar produtos' })
    }
})

router.get("/add", async (req, res) => {
    try {
        res.status(200).render('addProduto', { 
            message: ``,
            csrfToken: req.csrfToken()
        })
    } catch (err) {
        console.error(`Rota /produto/add: ${err.message}`)
        res.status(500).render('error', { message: 'Erro ao abrir formulário' })
    }
})

router.post("/add", validations.produto.create, handleValidationErrors, async (req, res) => {
    try {
        let { nome, descricao, valor, vendedor, data, estoque } = req.body
        valor = parseFloat(valor)
        estoque = parseFloat(estoque)

        await prisma.produtos.create({
            data: {
                nome, descricao, valor, vendedor, data, estoque
            },
        })
        res.status(302).redirect('/produto')
    } catch(err) {
        console.error(`Rota post /produto/add: ${err.message}`)
        res.status(400).render('addProduto', { 
            message: 'Erro ao adicionar produto',
            csrfToken: req.csrfToken()
        })
    }
})

router.get("/alterar/:id", async (req, res) => {
    try {
        const { id } = req.params
        const produto = await prisma.produtos.findUnique({ where: { id } })
        if (!produto) {
            return res.status(404).render('error', { message: 'Produto não encontrado' })
        }
        res.status(200).render('alterarProduto', { 
            produto: produto, 
            message: ``,
            csrfToken: req.csrfToken()
        })
    } catch (err) {
        console.error(`Rota /produto/alterar: ${err.message}`)
        res.status(500).render('error', { message: 'Erro ao carregar produto' })
    }
})

router.post("/alterar/:id", validations.produto.update, handleValidationErrors, async (req, res) => {
    try {
        const { id } = req.params
        
        const dadosAtualizar = {};
        if (req.body.nome) dadosAtualizar.nome = req.body.nome;
        if (req.body.descricao) dadosAtualizar.descricao = req.body.descricao;
        if (req.body.valor) dadosAtualizar.valor = parseFloat(req.body.valor);
        if (req.body.data) dadosAtualizar.data = req.body.data;
        if (req.body.vendedor) dadosAtualizar.vendedor = req.body.vendedor;
        if (req.body.estoque) dadosAtualizar.estoque = parseFloat(req.body.estoque);

        await prisma.produtos.update({
            where: { id },
            data: dadosAtualizar
        })

        res.status(302).redirect('/produto')
    } catch(err) {
        console.error(`Rota post /produto/alterar: ${err.message}`)
        const produto = await prisma.produtos.findUnique({ where: { id: req.params.id } })
        res.status(400).render('alterarProduto', { 
            produto: produto,
            message: 'Erro ao atualizar produto',
            csrfToken: req.csrfToken()
        })
    }
})

router.post("/deletar/:id", async (req, res) => {
    try {
        const { id } = req.params
        await prisma.produtos.delete({
            where: {
                id
            }
        })

        res.status(302).redirect('/produto')
    } catch (err) {
        console.error(`Rota post /produto/deletar: ${err.message}`)
        res.status(500).render('error', { message: 'Erro ao deletar produto' })
    }
})

module.exports = router
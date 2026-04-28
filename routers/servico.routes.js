const express = require('express');
const router = express.Router();
const prisma = require('../utils/prismaClient');
const { validations, handleValidationErrors } = require('../utils/validators');

router.get("/", async (req, res) => {
    try {
        const servicos = await prisma.servicos.findMany({})
        res.status(200).render('servico', { 
            servicos: servicos, 
            message: ``,
            csrfToken: req.csrfToken()
        })
    } catch (err) {
        console.error(`Rota /servico: ${err.message}`)
        res.status(500).render('error', { message: 'Erro ao carregar serviços' })
    }
})

router.get("/add", async (req, res) => {
    try {
        res.status(200).render('addServico', { 
            message: ``,
            csrfToken: req.csrfToken()
        })
    } catch (err) {
        console.error(`Rota /servico/add: ${err.message}`)
        res.status(500).render('error', { message: 'Erro ao abrir formulário' })
    }
})

router.post("/add", validations.servico.create, handleValidationErrors, async (req, res) => {
    try {
        let { nome, valor, produto, descricao, imagem } = req.body
        valor = parseFloat(valor)
        if(!valor) valor = 0
        await prisma.servicos.create({
            data: {
                nome, valor, produto, descricao, imagem
            },
        })
        res.status(302).redirect('/servicos')
    } catch(err) {
        console.error(`Rota post /servico/add: ${err.message}`)
        res.status(400).render('addServico', { 
            message: 'Erro ao adicionar serviço',
            csrfToken: req.csrfToken()
        })
    }
})

router.get("/alterar/:id", async (req, res) => {
    try {
        const { id } = req.params
        const servico = await prisma.servicos.findUnique({ where: { id } })
        if (!servico) {
            return res.status(404).render('error', { message: 'Serviço não encontrado' })
        }
        res.status(200).render('alterarServico', { 
            servico: servico, 
            message: ``,
            csrfToken: req.csrfToken()
        })
    } catch (err) {
        console.error(`Rota /servico/alterar: ${err.message}`)
        res.status(500).render('error', { message: 'Erro ao carregar serviço' })
    }
})

router.post("/alterar/:id", validations.servico.create, handleValidationErrors, async (req, res) => {
    try {
        const { id } = req.params
        await prisma.servicos.update({
            where: { id },
            data: {
                nome: req.body.nome,
                descricao: req.body.descricao,
                imagem: req.body.imagem,
                valor: parseFloat(req.body.valor),
                produto: req.body.produto
            }
        })

        res.status(302).redirect('/servicos')
    } catch(err) {
        console.error(`Rota post /servico/alterar: ${err.message}`)
        const servico = await prisma.servicos.findUnique({ where: { id: req.params.id } })
        res.status(400).render('alterarServico', { 
            servico: servico,
            message: 'Erro ao atualizar serviço',
            csrfToken: req.csrfToken()
        })
    }
})

router.post("/deletar/:id", async (req, res) => {
    try {
        const { id } = req.params
        await prisma.servicos.delete({
            where: {
                id
            }
        })

        res.status(302).redirect('/servicos')
    } catch (err) {
        console.error(`Rota post /servico/deletar: ${err.message}`)
        res.status(500).render('error', { message: 'Erro ao deletar serviço' })
    }
})

module.exports = router
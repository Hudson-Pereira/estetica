const express = require('express');
const router = express.Router();
const { toISODateString } = require('../utils/date');

const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient()

router.get("/", async (req, res) => {
    try {
        res.status(200).render('fechamento', {message:``})
     } catch (err) {
        console.error(`Rota caixa: ${err.message}`)
        res.redirect('caixa')
    }
})

router.post("/", async (req, res) => {
    try {
        const dataIString = req.body.dataI;
        const dataFString = req.body.dataF;
        const servicos = await prisma.agenda.findMany({})
        const produtos = await prisma.produtos.findMany({})

        let entrada = 0
        let saida = 0

        const dataI = new Date(`${dataIString}T00:00:00.000Z`)
        const dataF = new Date(`${dataFString}T23:59:59.999Z`)
        
        servicos.filter((servico) => {
            const dataServico = toISODateString(servico.data);

            if (dataServico >= dataIString && dataServico <= dataFString) {
                entrada = entrada + servico.preco
            }
        });

        produtos.filter((produto) => {
            if (produto.createdAt >= dataI && produto.createdAt <= dataF) {
                saida = saida + produto.valor
            }
        })

        res.status(200).render('caixa', {
            dataI: req.body.dataI,
            dataF: req.body.dataF,
            entrada: entrada,
            saida: saida,
            message:``
        })
        
    } catch (err) {
        console.error(`Rota post /caixa ${err.message}`)
    }
})

module.exports = router
// TODO: refatorar??

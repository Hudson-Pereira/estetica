const express = require('express');
const router = express.Router();

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

        let dataI = dataIString.split('-')
        dataI = new Date(dataI[0], dataI[1] -1, dataI[2])
        let dataF = dataFString.split('-')
        dataF = new Date(dataF[0], dataF[1] -1, dataF[2])
        
        servicos.filter((servico) => {
            const [dia, mes, ano] = servico.data.split('/');
            const dataServico = new Date(ano, mes - 1, dia);

            if (dataServico >= dataI && dataServico <= dataF) {
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

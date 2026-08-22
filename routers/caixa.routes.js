const express = require('express');
const router = express.Router();
const { toISODateString } = require('../utils/date');
const prisma = require('../utils/prismaClient');

router.get("/", async (req, res) => {
    try {
        res.status(200).render('fechamento', { message: `` })
     } catch (err) {
        console.error(`Rota caixa: ${err.message}`)
        res.status(500).render('error', { message: 'Erro ao carregar fechamento de caixa' })
    }
})

router.post("/", async (req, res) => {
    try {
        const dataIString = req.body.dataI;
        const dataFString = req.body.dataF;
        if (!dataIString || !dataFString) {
            return res.status(400).render('fechamento', { message: 'Informe data inicial e final.' });
        }

        const dataI = new Date(`${dataIString}T00:00:00.000Z`)
        const dataF = new Date(`${dataFString}T23:59:59.999Z`)
        if (Number.isNaN(dataI.getTime()) || Number.isNaN(dataF.getTime()) || dataI > dataF) {
            return res.status(400).render('fechamento', { message: 'Período inválido para fechamento.' });
        }

        const servicos = await prisma.agenda.findMany({})
        const produtos = await prisma.produtos.findMany({})

        let entrada = 0
        let saida = 0

        servicos.forEach((servico) => {
            const dataServico = toISODateString(servico.data);

            if (dataServico >= dataIString && dataServico <= dataFString) {
                entrada += servico.preco
            }
        });

        produtos.forEach((produto) => {
            if (produto.createdAt >= dataI && produto.createdAt <= dataF) {
                saida += produto.valor
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
        res.status(500).render('error', { message: 'Erro ao calcular fechamento de caixa' })
    }
})

module.exports = router
// TODO: refatorar??

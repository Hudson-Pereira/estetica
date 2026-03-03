const express = require('express');
const router = express.Router();


const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient()
const {
    isValidISODateString,
    isoDateStringToUtcDate,
    formatAgendaForView,
    toISODateString
} = require('../utils/date');

router.get("/", async (req, res) => {
    try { 
        const agenda = await prisma.agenda.findMany({
            orderBy: [{data: 'asc'}, {hora: 'asc'}]
        })
        res.status(200).render('agenda', {
            agenda: formatAgendaForView(agenda),
            message:``
        })
    } catch (err) {
        console.error(`Rota /agenda ${err.message}`)
    }
})

router.get("/add", async (req, res) => {
    try {
        res.status(200).render('addAgenda', {message: ``})
    } catch (err) {
        console.error(`Rota /agenda/add: ${err.message}`)
        throw new Error("Erro!!!!")
    }
})

// router.get("/agenda/add", async (req, res) => {
//     try {
//         res.status(200).render('addAgenda')
//     } catch (err) {
//         console.error(`Rota /agenda/add: ${err.message}`)
//         throw new Error("Erro!!!!")
//     }
// })

router.post("/add", async (req, res) => {
    try {
        let { nome, data, hora, preco, procedimento } = req.body

        if(!nome || !data || !hora)
            return res.status(200).render('agenda', {message: `Campos vazios!!`});

        if (!isValidISODateString(data)) {
            return res.status(200).render('agenda', {message: `Data invalida!!`});
        }

        const dataDate = isoDateStringToUtcDate(data);

        const verifyIfExists = await prisma.agenda.findMany({where: {data: dataDate, hora: hora}})

        if (verifyIfExists.length !== 0){
            return res.status(200).render('addAgenda', {message: `Horario nao disponivel!!`});
        }

        if (!preco) preco = 0;
        preco = parseFloat(preco)
        
        await prisma.agenda.create({
            data: {
                nome, data: dataDate, hora, preco, procedimento
            },
        })
        res.status(200).render('agenda', {message: `Agendamento concluido!!`})
    } catch(err) {
        console.error(`Rota post /agenda/add: ${err.message}`)
        res.status(200).redirect('agenda')
    }
})

router.get('/alterar/:id', async (req, res) => {
    try {
        const { id } = req.params
        const agenda = await prisma.agenda.findUnique({ where: { id } })
        if (!agenda) {
            return res.status(200).redirect('/agenda')
        }

        const agendaFormatada = {
            ...agenda,
            data: toISODateString(agenda.data)
        }
        res.status(200).render('alterarAgenda', { agenda: agendaFormatada, message: `` })
    } catch (err) {
        console.error(`Rota /agenda/alterar: ${err.message}`)
        throw new Error("Erro!!!!")
    }
})

router.post("/alterar/:id", async (req, res) => {
    try {
        const { id } = req.params
        if (!isValidISODateString(req.body.data)) {
            return res.status(200).redirect('/agenda')
        }
        
        await prisma.agenda.update({
            where: { id },
            data: {
                nome: req.body.nome,
                data: isoDateStringToUtcDate(req.body.data),
                hora: req.body.hora,
                preco: parseFloat(req.body.preco)
            }
        })

        res.status(200).render('agenda', {message: `Entrada alterada!!`})
    } catch(err) {
        console.error(`Rota post /agenda/alterar: ${err.message}`)
        res.status(200).redirect('/agenda')
    }
})

router.get("/deletar/:id", async (req, res) => {
    try {
        const { id } = req.params
        const produto = await prisma.agenda.delete({
            where: {
                id
            }
        })

        res.status(200).render('agenda', {message: `Entrada excluida!!`})
    } catch (err) {
        console.error(`Rota /agenda/deletar ${err.message}`)
        throw new Error("Erro!!!!")
    }
})

router.post('/search', async (req, res) => {
    try {
        let {search} = req.body

        if(!search){
            const agenda = await prisma.agenda.findMany({
                orderBy: [{data: 'asc'}, {hora: 'asc'}]
            })

            return res.status(200).render('agenda', {agenda: formatAgendaForView(agenda), message:``})
        }

        if (!isValidISODateString(search)) {
            return res.status(200).render('agenda', {agenda: [], message:`Data invalida!!`})
        }

        let date = isoDateStringToUtcDate(search);

        const agenda = await prisma.agenda.findMany({where:{data: date}, orderBy:[{data: 'asc'}, {hora: 'asc'}]})
        
        res.status(200).render('agenda', {agenda: formatAgendaForView(agenda), message: ``})
    } catch (err) {
        console.error(`Rota post /search ${err.message}`)
        res.status(200).render('agenda', {message:``})
    }
})

module.exports = router

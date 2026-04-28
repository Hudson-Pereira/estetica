const express = require('express');
const router = express.Router();
const prisma = require('../utils/prismaClient');
const { validations, handleValidationErrors } = require('../utils/validators');
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
            message:``,
            csrfToken: req.csrfToken()
        })
    } catch (err) {
        console.error(`Rota /agenda: ${err.message}`)
        res.status(500).render('error', { message: 'Erro ao carregar agenda' })
    }
})

router.get("/add", async (req, res) => {
    try {
        res.status(200).render('addAgenda', { 
            message: ``,
            csrfToken: req.csrfToken()
        })
    } catch (err) {
        console.error(`Rota /agenda/add: ${err.message}`)
        res.status(500).render('error', { message: 'Erro ao abrir formulário' })
    }
})

router.post("/add", validations.agenda.create, handleValidationErrors, async (req, res) => {
    try {
        let { nome, data, hora, preco, procedimento } = req.body

        if (!isValidISODateString(data)) {
            return res.status(400).render('addAgenda', { 
                message: `Data inválida!`,
                csrfToken: req.csrfToken()
            });
        }

        const dataDate = isoDateStringToUtcDate(data);

        const verifyIfExists = await prisma.agenda.findMany({where: {data: dataDate, hora: hora}})

        if (verifyIfExists.length !== 0){
            return res.status(400).render('addAgenda', { 
                message: `Horário não disponível!`,
                csrfToken: req.csrfToken()
            });
        }

        if (!preco) preco = 0;
        preco = parseFloat(preco)
        
        await prisma.agenda.create({
            data: {
                nome, data: dataDate, hora, preco, procedimento
            },
        })
        res.status(302).redirect('/agenda')
    } catch(err) {
        console.error(`Rota post /agenda/add: ${err.message}`)
        res.status(400).render('addAgenda', { 
            message: 'Erro ao agendar',
            csrfToken: req.csrfToken()
        })
    }
})

router.get('/alterar/:id', async (req, res) => {
    try {
        const { id } = req.params
        const agenda = await prisma.agenda.findUnique({ where: { id } })
        if (!agenda) {
            return res.status(404).render('error', { message: 'Agendamento não encontrado' })
        }

        const agendaFormatada = {
            ...agenda,
            data: toISODateString(agenda.data)
        }
        res.status(200).render('alterarAgenda', { 
            agenda: agendaFormatada, 
            message: ``,
            csrfToken: req.csrfToken()
        })
    } catch (err) {
        console.error(`Rota /agenda/alterar: ${err.message}`)
        res.status(500).render('error', { message: 'Erro ao carregar agendamento' })
    }
})

router.post("/alterar/:id", validations.agenda.create, handleValidationErrors, async (req, res) => {
    try {
        const { id } = req.params
        if (!isValidISODateString(req.body.data)) {
            return res.status(400).render('alterarAgenda', { 
                message: 'Data inválida!',
                csrfToken: req.csrfToken()
            })
        }
        
        await prisma.agenda.update({
            where: { id },
            data: {
                nome: req.body.nome,
                data: isoDateStringToUtcDate(req.body.data),
                hora: req.body.hora,
                preco: parseFloat(req.body.preco),
                procedimento: req.body.procedimento
            }
        })

        res.status(302).redirect('/agenda')
    } catch(err) {
        console.error(`Rota post /agenda/alterar: ${err.message}`)
        res.status(400).render('alterarAgenda', { 
            message: 'Erro ao atualizar agendamento',
            csrfToken: req.csrfToken()
        })
    }
})

router.post("/deletar/:id", async (req, res) => {
    try {
        const { id } = req.params
        await prisma.agenda.delete({
            where: {
                id
            }
        })

        res.status(302).redirect('/agenda')
    } catch (err) {
        console.error(`Rota post /agenda/deletar: ${err.message}`)
        res.status(500).render('error', { message: 'Erro ao deletar agendamento' })
    }
})

router.post('/search', async (req, res) => {
    try {
        let {search} = req.body

        if(!search){
            const agenda = await prisma.agenda.findMany({
                orderBy: [{data: 'asc'}, {hora: 'asc'}]
            })

            return res.status(200).render('agenda', {
                agenda: formatAgendaForView(agenda), 
                message:``,
                csrfToken: req.csrfToken()
            })
        }

        if (!isValidISODateString(search)) {
            return res.status(400).render('agenda', {
                agenda: [], 
                message:`Data inválida!`,
                csrfToken: req.csrfToken()
            })
        }

        let date = isoDateStringToUtcDate(search);

        const agenda = await prisma.agenda.findMany({
            where:{data: date}, 
            orderBy:[{data: 'asc'}, {hora: 'asc'}]
        })
        
        res.status(200).render('agenda', {
            agenda: formatAgendaForView(agenda), 
            message: ``,
            csrfToken: req.csrfToken()
        })
    } catch (err) {
        console.error(`Rota post /agenda/search: ${err.message}`)
        res.status(500).render('error', { message: 'Erro ao buscar agendamentos' })
    }
})

module.exports = router

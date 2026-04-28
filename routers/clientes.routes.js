const express = require('express');
const router = express.Router();
const moment = require('moment');
const prisma = require('../utils/prismaClient');
const {
    isValidISODateString,
    isoDateStringToUtcDate,
    formatAgendaForView,
    getTomorrowISODateString
} = require('../utils/date');

function filtrarAgendaProximaSemana(agenda) {
    const inicioHoje = moment.utc().startOf('day');
    const fimSemana = moment.utc().add(7, 'days').endOf('day');

    return agenda.filter((item) => {
        const dataItem = moment.utc(item.data);
        return dataItem.isValid() && dataItem.isBetween(inicioHoje, fimSemana, 'day', '[]');
    });
}

router.get('/', async (req, res) => {
    try { 
        res.status(200).render('clientes/sobre', {message:``})
        // res.status(200).render(`clientes/home`, {message:``})
    } catch (err) {
        console.error(`Rota /sobre: ${err.message}`);
      throw new Error("Erro!!!!");
    }
})

router.get('/agenda', async (req, res) => {
    try { 
        let agenda = await prisma.agenda.findMany({
            orderBy:[
                {data: 'asc'}, 
                {hora: 'asc'}
                ]
            }) 

            const agendaFiltrada = filtrarAgendaProximaSemana(agenda);

        
        res.status(200).render('clientes/agenda', {
            agenda: formatAgendaForView(agendaFiltrada),
            message:``
        })
    } catch (err) {
        console.error(`Rota /cliente/agenda: ${err.message}`);
      throw new Error("Erro!!!!");
    }
})

router.get('/agenda/add', async (req, res) => {
    try {
        res.status(200).render('clientes/addAgenda', {message:``, minDate: getTomorrowISODateString()})
    } catch (err) {
        console.error(`Rota /cliente/agenda/add: ${err.message}`);
      throw new Error("Erro!!!!");
    }
})

router.post('/agenda/add', async (req, res) => {
    try {
        
        let { nome, data, hora, preco, procedimento } = req.body
        const minDate = getTomorrowISODateString();

        if(!nome || !data || !hora)
            return res.status(200).render('clientes/addAgenda', {message: `Campos vazios!!`, minDate});
        
        if (!isValidISODateString(data)) {
            return res.status(200).render('clientes/addAgenda', {message: `Data invalida!!`, minDate});
        }

        if (data < minDate) {
            return res.status(200).render('clientes/addAgenda', {
                message: `Agendamento disponivel somente a partir de amanha.`,
                minDate
            });
        }

        const dataDate = isoDateStringToUtcDate(data);

        const verifyIfExists = await prisma.agenda.findMany({where: {data: dataDate, hora: hora}})

        if (verifyIfExists.length !== 0){
            return res.status(200).render('clientes/addAgenda', {message: `Horario nao disponivel!!`, minDate});
        }

        if (!preco) preco = 0;
        preco = parseFloat(preco)
        
        await prisma.agenda.create({
            data: {
                nome, data: dataDate, hora, preco, procedimento
            },
        })

        let agenda = await prisma.agenda.findMany({
            orderBy:[
                {data: 'asc'}, 
                {hora: 'asc'}
                ]
            }) 

            const agendaFiltrada = filtrarAgendaProximaSemana(agenda);

        res.status(200).render('clientes/agenda', {agenda: formatAgendaForView(agendaFiltrada), message: `Agendamento concluido!!`})
    } catch (err) {
        console.error(`Rota /cliente/add: ${err.message}`);
      throw new Error("Erro!!!!");
    }
})

router.get('/infos', async (req, res) => {
    try { 
        const servicos = await prisma.servicos.findMany({})

        res.status(200).render('clientes/infos', {
            servicos: servicos,
            message: ``
        })
    } catch (err) {
        console.error(`Rota /infos: ${err.message}`);
      throw new Error("Erro!!!!");
    }
})
//TODO: criar funcao externa/exportada para formatar data e filtrar agenda
router.post('/search', async (req, res) => {
    try {
        let {search} = req.body

        if(!search){
        
        let agenda = await prisma.agenda.findMany({
            orderBy:[
                {data: 'asc'}, 
                {hora: 'asc'}
                ]
            }) 

            const agendaFiltrada = filtrarAgendaProximaSemana(agenda);

            return res.status(200).render('clientes/agenda', {agenda: formatAgendaForView(agendaFiltrada), message:``})
        }

        if (!isValidISODateString(search)) {
            return res.status(200).render('clientes/agenda', {agenda: [], message:`Data invalida!!`});
        }

        const searchDate = isoDateStringToUtcDate(search);

        const agenda = await prisma.agenda.findMany({where:{data: searchDate}, orderBy:[{data: 'asc'}, {hora: 'asc'}]})
        
        res.status(200).render('clientes/agenda', {agenda: formatAgendaForView(agenda), message: ``})
    } catch (err) {
        console.error(`Rota post /search ${err.message}`)
        res.status(200).render('clientes/agenda', {message:``})
    }
})
module.exports = router

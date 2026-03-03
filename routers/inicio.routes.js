const express = require('express');
const router = express.Router();
const passport = require('passport')

const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient()
const { isoDateStringToUtcDate, formatAgendaForView } = require('../utils/date');

router.get("/", async (req, res) => {
    try {
      let hoje = new Date();
      const dia = hoje.getDate().toString().padStart(2,"0");
      const mes = (hoje.getMonth() + 1).toString().padStart(2, "0");
      const ano = hoje.getFullYear();
  
      hoje = `${ano}-${mes}-${dia}`;
      const hojeS = hoje.toString();
      const hojeDate = isoDateStringToUtcDate(hojeS);
  
      let produtos = await prisma.produtos.findMany({});
      let agendas = await prisma.agenda.findMany({ where: { data: hojeDate }, orderBy: [{hora: 'asc'}] });
      agendas = formatAgendaForView(agendas);
  
      produtos = produtos.filter((produto) => {
        if (produto.data > hoje) {
          
          const mesP = parseInt(produto.data.slice(5, 7).toString());
          const mesA = parseInt(hojeS.slice(5, 7));
          const anoP = parseInt(produto.data.slice(0, 4).toString())
          const anoA = parseInt(hojeS.slice(0, 4));
          if (anoP >= anoA) {
            if (mesP <= mesA + 2) {
              return produto
            }
          }
        }
      });
  
      res.status(200).render("inicio", { agendas: agendas, produtos: produtos, message: `` });
    } catch (err) {
      console.error(`Rota /: ${err.message}`);
      throw new Error("Erro!!!!");
    }
  });

module.exports = router

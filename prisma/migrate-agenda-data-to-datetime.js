const { MongoClient } = require("mongodb");
require("dotenv").config();

function parseToDate(value) {
  if (value instanceof Date) return value;
  if (typeof value !== "string") return null;

  const isoMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    const [, ano, mes, dia] = isoMatch;
    return new Date(`${ano}-${mes}-${dia}T00:00:00.000Z`);
  }

  const brMatch = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (brMatch) {
    const [, dia, mes, ano] = brMatch;
    return new Date(`${ano}-${mes}-${dia}T00:00:00.000Z`);
  }

  return null;
}

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL não definido.");

  const client = new MongoClient(url);
  await client.connect();
  const db = client.db();
  const collection = db.collection("Agenda");

  const docs = await collection.find({}, { projection: { _id: 1, data: 1 } }).toArray();
  const ops = [];
  let ignorados = 0;

  for (const doc of docs) {
    const parsed = parseToDate(doc.data);
    if (!parsed) {
      ignorados += 1;
      continue;
    }

    if (doc.data instanceof Date && doc.data.getTime() === parsed.getTime()) continue;

    ops.push({
      updateOne: {
        filter: { _id: doc._id },
        update: { $set: { data: parsed } },
      },
    });
  }

  if (ops.length > 0) {
    await collection.bulkWrite(ops, { ordered: false });
  }

  console.log(`Migração Agenda.data concluída. Atualizados: ${ops.length}. Ignorados: ${ignorados}.`);
  await client.close();
}

main().catch((err) => {
  console.error("Erro na migração Agenda.data:", err);
  process.exit(1);
});

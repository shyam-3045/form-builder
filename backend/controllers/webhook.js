const Response = require("../models/FormResponse");

exports.airtableWebhook = async (req, res) => {
  try {
    const payloads = req.body?.payloads || [];

    for (const payload of payloads) {
      const tables = payload.changedTablesById;
      if (!tables) {
        continue
      }

      for (const tableId in tables) {
        const table = tables[tableId];

        if (table.changedRecordsById) {
          for (const recordId in table.changedRecordsById) {
            const recordChange = table.changedRecordsById[recordId];

            await Response.findOneAndUpdate(
              { airtableRecordId: recordId },
              {
                deletedInAirTable: false, 
                answers: recordChange.current?.cellValuesByFieldId || {},
                updatedAt: new Date(), 
              }
            );
          }
        }

        if (Array.isArray(table.destroyedRecordIds)) {
          for (const recordId of table.destroyedRecordIds) {
            await Response.findOneAndUpdate(
              { airtableRecordId: recordId },
              {
                deletedInAirTable: true, 
                updatedAt: new Date(),
              }
            );
          }
        }
      }
    }
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Error occurs in webhook:", error);
    return res.status(500).json({
      ok: false,
      msg: "Internal Server Error",
    });
  }
};

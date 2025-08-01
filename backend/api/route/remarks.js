const db = require("../../database/db");
const express = require('express');
const router = express.Router();

router.get("", async (req,res)=>{
    const [rowws] = await db.execute(`
        SELECT * From remarks
        inner join users on  remarks.user_id = users.user_id`)
})

module.exports = router;
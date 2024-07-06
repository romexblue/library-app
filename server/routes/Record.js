const express = require("express");
const router = express.Router();
const moment = require("moment");
const { Op, Sequelize } = require("sequelize");
const { Records, Students, Floor } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

router.get("/stats/:startDate/:endDate/:college?", async (req, res) => {
    try {
        const startDate = moment(req.params.startDate).format("YYYY-MM-DD");
        const endDate = moment(req.params.endDate).format("YYYY-MM-DD");
        const college = req.params.college;

        const whereCondition = {
            date: {
                [Op.between]: [startDate, endDate],
            },
        };

        if (college) {
            whereCondition["$Student.college$"] = college;
        }

        const records = await Records.findAll({
            attributes: [
                [Sequelize.col("Floor.name"), "floor_name"],
                [
                    Sequelize.fn("COUNT", Sequelize.col("Records.id")),
                    "record_count",
                ],
            ],
            include: [
                {
                    model: Students,
                    attributes: [],
                },
                {
                    model: Floor,
                    attributes: [],
                },
            ],
            where: whereCondition,
            group: ["Floor.name", "Student.college"],
            order: [
                [Sequelize.fn("COUNT", Sequelize.col("Records.id")), "DESC"],
            ],
        });

        res.json({
            records,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "An error occurred while processing your request",
        });
    }
});

//for time in
router.post("/", validateToken, async (req, res) => {
    try {
        const rec = req.body;

        // const floor = await Floor.findByPk(req.body.FloorId);
        // if (floor.current_count === floor.max_capacity - 1) {
        //     await floor.update({ status: "Full" }) //set to full if it is full capacity
        // }

        // const stud = await Students.findOne({
        //     where: {
        //         school_id: rec.StudentSchoolId
        //     },
        // include: {
        //     model: Records,
        //     where: { time_out: null }
        // }
        // })

        // if (stud) {
        //     res.json({ error: "You are currently Timed In. Please Time Out" })
        // } else {
        await Records.create(rec);
        await Floor.increment("current_count", {
            where: { id: req.body.FloorId },
        });
        res.json(rec);
        // }
    } catch (err) {
        res.status(400).json({ err: "Internal Server Error" });
    }
});

//for timeout
router.patch("/find/:school_id", validateToken, async (req, res) => {
    const rec = req.body;
    let rfid = req.params.school_id;
    if (rfid.startsWith("00")) {
        rfid = rfid.slice(2);
    }
    const user = await Students.findOne({
        where: {
            [Op.or]: [{ school_id: rfid }, { rfid: rfid }],
        },
    }); //to get userId
    if (user) {
        try {
            const findRecord = await Records.findOne({
                //find record to get floor id
                where: {
                    StudentSchoolId: user.school_id,
                    time_out: null,
                },
                limit: 1,
            });
            if (findRecord) {
                await Records.update(
                    {
                        //update record for timeout
                        time_out: rec.time_out,
                    },
                    {
                        where: {
                            StudentSchoolId: user.school_id,
                            time_out: null,
                        },
                        limit: 1,
                    }
                );

                await Floor.decrement("current_count", {
                    where: { id: findRecord.FloorId },
                }); //decrement current count

                const floor = await Floor.findByPk(findRecord.FloorId); //check the capacity
                if (floor.current_count < floor.max_capacity) {
                    await floor.update({ status: "Open" }); //open if not at capacity
                }

                res.json({ success: "Time Out Successful" });
            } else {
                res.json({ error: "Not Timed In" });
            }
        } catch (err) {
            res.json({ error: err });
        }
    } else {
        res.json({ error: "No existing record" });
    }
});

module.exports = router;

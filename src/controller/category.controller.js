const db = require("../../models");


exports.addNewCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const newCategory = await db.Category.create({ name });
        if (newCategory) {
            return res.status(200).json({ success:"true" ,message: "Category added successfully" });
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Internal server error" });
    }
}

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await db.Category.findAll({attributes: ["id", "name"]});
        return res.status(200).json({ categories });
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Internal server error" });
    }
}
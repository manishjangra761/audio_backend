const { User } = require("../../models");
const { Op } = require("sequelize");

// exports.getAllUsers = async (req, res) => {
//     try {
//         const users = await User.findAll({
//             where: {
//                 type: "user",
//                 status: {
//                     [Op.ne]: "unapproved"
//                 }
//             },
//             attributes: ["id", "name", "email", "phone", "type", "status"]
//         });
//         return res.status(200).json({ users });
//     } catch (err) {
//         console.log(err)
//         return res.status(500).json({ message: "Internal server error" });
//     }
// }


exports.getAllUsers = async (req, res) => {
    try {

        const { status, search } = req.query;

        let whereCondition = {
            type: "user"
        };

        // STATUS FILTER
        if (status === "unapproved") {
            whereCondition.status = "unapproved";
        }
        else if (status === "active" || status === "inactive") {
            whereCondition.status = status;
        }
        else {
            whereCondition.status = {
                [Op.ne]: "unapproved"
            };
        }

        // SEARCH FILTER
        if (search && search.length >= 3) {
            whereCondition[Op.or] = [
                {
                    name: {
                        [Op.like]: `%${search}%`
                    }
                },
                {
                    email: {
                        [Op.like]: `%${search}%`
                    }
                }
            ];
        }

        const users = await User.findAll({
            where: whereCondition,
            attributes: ["id", "name", "email", "phone", "type", "status"]
        });

        return res.status(200).json({ users });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};




exports.getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.user_id, {
            attributes: ["id", "name", "email", "phone", "type", "status"]
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ user });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.user_id;

        if (req.body.email || req.body.phone) {
            const orConditions = [];

            if (req.body.email) orConditions.push({ email: req.body.email });
            if (req.body.phone) orConditions.push({ phone: req.body.phone });

            const duplicate = await User.findOne({
                where: {
                    id: { [Op.ne]: userId },
                    [Op.or]: orConditions
                }
            });

            if (duplicate) {
                return res.status(400).json({ message: "Email or phone already exists" });
            }
        }

        const updated = await User.update(req.body, { where: { id: userId } });
        if (updated[0] > 0) {
            return res.status(200).json({ message: "Profile updated successfully" });
        } else {
            return res.status(400).json({ message: "No changes made" });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.destroy({
            where: { id }
        });
        if (deletedUser) {
            return res.status(200).json({ message: "User deleted successfully" });
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Internal server error" });
    }
}

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;

        const whereClause = {
            id
        }

        if (req.body.email || req.body.phone) {
            const orConditions = [];

            if (req.body.email) {
                orConditions.push({ email: req.body.email });
            }

            if (req.body.phone) {
                orConditions.push({ phone: req.body.phone });
            }

            const duplicate = await User.findOne({
                where: {
                    id: { [Op.ne]: id },
                    [Op.or]: orConditions
                }
            });

            if (duplicate) {
                return res.status(400).json({
                    message: "Email or Mobile already exists"
                });
            }
        }

        const updatedUser = await User.update(req.body, { where: whereClause });
        if (updatedUser) {
            return res.status(200).json({ message: "User updated successfully" });
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Internal server error" });
    }
}
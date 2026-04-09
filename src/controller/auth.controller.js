const { User } = require("../../models");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const jwt_config = require('../../config/jwt.config')
const refreshTokenSecret = jwt_config.refreshTokenSecret
const accessTokenSecret = jwt_config.accessTokenSecret
const saltRounds = jwt_config.saltRounds
const jwt_timeout = jwt_config.jwt_timeout;
const { Op } = require("sequelize");


exports.login = async (req, res) => {

    try {
        const { email, pass } = req.body;

        let accessToken;
        let refreshToken;

        if (!email || !pass) {
            return res.status(400).json({ message: "Missing email or password", accessToken: null, refreshToken: null });
        }

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        if (user) {
            let match;
            let password = pass

            // if (person.isTempPassExists == true) {
            //     match = password == user.password
            //     // if (match) {
            //     //     const { userId } = EncryptedIDForOneTimeUser(person.id)
            //     //     return res.json({ redirectTo: `/forget-password?id=${userId.encryptedId}&iv=${userId.iv}&reset_password=${true}&email=${email}` });
            //     // }
            // } else {
            match = await bcrypt.compare(password, user.password);

            // }

            if (match) {
                if (user.status !== "active") {
                    return res.status(403).json({ message: "Account inactive" });
                }
                const payload = {
                    user_id: user.id,
                    role: user.type,
                    name: user.name
                }
                accessToken = jwt.sign(payload, accessTokenSecret, { expiresIn: jwt_timeout })
                refreshToken = jwt.sign(payload, refreshTokenSecret, { expiresIn: '7d' });
                const cookieSameSite =
                    process.env.COOKIE_SAMESITE ||
                    (process.env.NODE_ENV === "production" ? "none" : "lax");
                const cookieSecure =
                    process.env.COOKIE_SECURE
                        ? process.env.COOKIE_SECURE === "true"
                        : process.env.NODE_ENV === "production";
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: cookieSecure,
                    sameSite: cookieSameSite,
                    maxAge: 7 * 24 * 60 * 60 * 1000
                })
                    .set("Authorization", `Bearer ${accessToken}`)
                    .status(200)
                    .json({ message: "Login successful", accessToken: accessToken, refreshToken: refreshToken , user: payload });
            } else {
                return res.status(401).json({ message: "Invalid email or password" });
            }
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Internal server error" });

    }
}

exports.logout = (req, res) => {

    const cookieSameSite =
        process.env.COOKIE_SAMESITE ||
        (process.env.NODE_ENV === "production" ? "none" : "lax");
    const cookieSecure =
        process.env.COOKIE_SECURE
            ? process.env.COOKIE_SECURE === "true"
            : process.env.NODE_ENV === "production";

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: cookieSecure,
        sameSite: cookieSameSite,
    });

    return res.status(200).json({ message: "Logged out successfully" });
};


exports.register = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        if (!name || !email || !phone || !password) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const whereClause = {
            [Op.or]: [
                { email },
                { phone }
            ]
        }

        const existingUser = await User.findOne({
            where: whereClause
        });
        if (existingUser) {
            return res.status(400).json({ message: "Email or Mobile already exists" });
        }

        let newHashedPassword = await bcrypt.hash(password, saltRounds);

        const newAdmin = await User.create({
            name,
            email,
            phone,
            password: newHashedPassword,
            type: "user",
            status: "unapproved",
        });

        if (newAdmin) {
            return res.status(200).json({ message: `User added successfully but waiting for admin approval` });
        }
    } catch (err) {
        console.log(" 🔥🔥🔥 Error Adding New Admin", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
}




exports.addSuperAdmin = async (req, res) => {
    try {
        const { name, email, phone, password, type, status } = req.body;

        let newHashedPassword = await bcrypt.hash(password, saltRounds);

        const newSuperAdmin = await User.create({
            name,
            email,
            phone,
            password: newHashedPassword,
            type,
            status,
        });

        if (newSuperAdmin) {
            return res.status(200).json({ message: "Super admin added successfully" });
        }
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Internal server error" });
    }
}


exports.addNewUser = async (req, res) => {
    try {
        const { name, email, phone, password, type, status } = req.body;

        if (!name || !email || !phone || !password || !type || !status) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const whereClause = {
            [Op.or]: [
                { email },
                { phone }
            ]
        }

        const existingUser = await User.findOne({
            where: whereClause
        });
        if (existingUser) {
            return res.status(400).json({ message: "Email or Mobile already exists" });
        }

        let newHashedPassword = await bcrypt.hash(password, saltRounds);

        const newAdmin = await User.create({
            name,
            email,
            phone,
            password: newHashedPassword,
            type: type || "user",
            status,
        });

        if (newAdmin) {
            return res.status(200).json({ message: `${type} added successfully` });
        }
    } catch (err) {
        console.log(" 🔥🔥🔥 Error Adding New Admin", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
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


        const updatedData = { ...req.body };

        const [updatedUser] = await User.update(updatedData, {
            where: whereClause
        });

        if (!updatedUser) {
            return res.status(400).json({ message: "No User Update" });
        }
        return res.status(200).json({ message: "User updated successfully" });

    } catch (err) {
        console.log("🔥🔥🔥Error in Update Admin", err)
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

exports.getAllAdmin = async (req, res) => {
    try {
        const admins = await User.findAll({
            where: {
                type: "admin"
            },
            attributes: ["id", "name", "email", "phone", "type", "status"]
        });
        return res.status(200).json({ admins });
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Internal server error" });
    }
}

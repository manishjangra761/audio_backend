const { User } = require("../../models");
const bcrypt = require('bcrypt')
const crypto = require('crypto');
const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex'); // Ensure this is 32 bytes
const iv = Buffer.from(process.env.ENCRYPTION_IV, 'hex');   // Ensure this is 16 bytes

const generateResetToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

// Encrypt the ID
const encryptId = (id) => {
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encryptedId = cipher.update(String(id), 'utf8', 'hex');
    encryptedId += cipher.final('hex');
    return { encryptedId, iv: iv.toString('hex') };
};

// Decrypt the ID
const decryptId = (encryptedId, iv) => {
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, Buffer.from(iv, 'hex'));
    let decryptedId = decipher.update(encryptedId, 'hex', 'utf8');
    decryptedId += decipher.final('utf8');
    return decryptedId;
};

const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Missing email" });
        }

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const reset_token = generateResetToken();
        const reset_token_expiry = Date.now() + 2 * 60 * 60 * 1000;

        const updatedUser = await User.update({ reset_token, reset_token_expiry }, { where: { email } });

        const UserId = encryptId(user.id);

        const reset_password_url = `${process.env.forget_Password}/#/forget-password?id=${UserId.encryptedId}&iv=${UserId.iv}&token=${reset_token}&expiry=${reset_token_expiry}&email=${email}`;

        console.log(reset_password_url ,"Password reset link")
        res.status(201).json({ message: `Reset link has been sent on ${user.email}`, success: true, error: false })


    } catch (err) {
        console.log("error in forget password", err)
    }
}

const resetandUpdatePassword = async (req, res) => {
    try {
        const newpassword = req.body.password
        const { id, iv, token, expiry, reset_password, email } = req.query
        const decodeId = decryptId(id, iv)
        const saltRounds = 10;

        if ((Date.now() > parseInt(expiry)) && !reset_password) {
            return res.json({ message: 'The reset link has expired. Please request a new link.' });
        }

        const hashedPassword = await bcrypt.hash(newpassword, saltRounds);
        let user = await User.findOne({ where: { id: decodeId, email } }) //customer and teacher both

        if (!user) {
            return res.status(200).json({ message: 'user not found' })
        }

        if ((!user || Date.now() > user.reset_token_expiry) && !reset_password) {
            return res.json({ message: 'Invalid or expired token. Please request a new password reset.' });
        }

        let updatedData = {
            reset_token: null,
            reset_token_expiry: null,
        };

        if (reset_password) {
            updatedData.isTempPassExists = 0;
        }


        if (user.pass) {
            console.log('---0>', updatedData)
            await user.update({ ...updatedData, pass: hashedPassword });
        } else {
            console.log('---1>', updatedData)
            await user.update({ ...updatedData, password: hashedPassword });
        }

        res.status(201).json({ message: 'Password has been reset successfully!', success: true, error: false })
    } catch (error) {
        console.log("error in reset password" , error)
        res.status(200).json({ message: error.message, success: false, error: true })
    }
}

function EncryptedIDForOneTimeUser(id, iv) {
    let userId = encryptId(id)
    return { userId, iv }
}

module.exports = {
    forgetPassword,
    resetandUpdatePassword,
    EncryptedIDForOneTimeUser
};

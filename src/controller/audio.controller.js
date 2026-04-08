const path = require('path');
const db = require('../../models');
const { or } = require('sequelize');
const { Op } = require("sequelize");

exports.addNewAudio = async (req, res) => {
  try {
    const { category_id, language, correct_text, title, duration } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Audio file is required' });
    }

    // Save in DB
    const audio = await db.Audio.create({
      category_id,
      language,
      audio_file: req.file.filename, // saved filename
      audio_path: `audios/${req.file.filename}`, // relative path
      correct_text,
      title,
      duration,
    });

    return res.status(200).json({ message: 'Audio uploaded successfully', audio });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};




exports.getAllAudios = async (req, res) => {
  try {
    const { category, language, search } = req.query;

    const whereClause = {};

    if (category) whereClause.category_id = category;
    if (language) whereClause.language = language;

    if (search && search.trim() !== "") {
      whereClause.title = {
        [Op.like]: `%${search.trim()}%`
      };
    }

    const audios = await db.Audio.findAll({
      where: whereClause,
      attributes: ["id", "title", "duration", "language", "audio_path"],
      include: [
        {
          model: db.Category,
          attributes: ["name"],   // 👈 Banking
        },
      ],
      order: [["title", "ASC"]],
    });

    return res.status(200).json({ audios });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};



exports.getAdminAllAudios = async (req, res) => {
  try {

    const audios = await db.Audio.findAll({
      attributes: ["id", "title", "duration", "language", "audio_path" , "correct_text"],
      include: [
        {
          model: db.Category,
          attributes: ["id" ,"name"],   
        },
      ],
      order: [["title", "ASC"]],
    });

    return res.status(200).json({ audios });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

exports.getAudio = async (req, res) => {
  try {
    const id = req.params.id;

    const audio = await db.Audio.findOne({
      where: { id },
      attributes: {
        exclude: ["correct_text", "audio_file", "createdAt", "updatedAt"],
      },
      include: [
        {
          model: db.Category,
          attributes: ["name"],   // 👈 Banking
        },
      ],
    });

    return res.status(200).json({ audio });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

exports.deleteAudio = async(req, res) =>{
  try {
    const { id } = req.params;
    const audio = await db.Audio.destroy({
      where: { id }
    });
    if (audio) {
      return res.status(200).json({ message: "Audio deleted successfully" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}

exports.updateAudio = async(req, res) =>{
  try {
    const { id } = req.params;
    const updateData = {};

    if (req.body.category_id) updateData.category_id = req.body.category_id;
    if (req.body.language) updateData.language = req.body.language;
    if (req.body.correct_text) updateData.correct_text = req.body.correct_text;
    if (req.body.title) updateData.title = req.body.title;
    if (req.body.duration) updateData.duration = req.body.duration;

    const audio = await db.Audio.update(updateData, {
      where: { id }
    });
    if (audio) {
      return res.status(200).json({ message: "Audio updated successfully" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}

import express from 'express';
import axios from 'axios';

const router = express.Router();

// Route pour obtenir les infos système d'Orthanc
router.get('/system', async (req, res) => {
  try {
    const response = await axios.get(`${process.env.ORTHANC_URL}/system`, {
      auth: {
        username: process.env.ORTHANC_USER || 'orthanc',
        password: process.env.ORTHANC_PASS || 'orthanc',
      },
    });
    res.json(response.data);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: "Erreur Orthanc", details: err.message });
  }
});

// Route pour lister toutes les études DICOM
router.get('/studies', async (req, res) => {
  try {
    const response = await axios.get(`${process.env.ORTHANC_URL}/studies`, {
      auth: {
        username: process.env.ORTHANC_USER || 'orthanc',
        password: process.env.ORTHANC_PASS || 'orthanc',
      },
    });
    res.json(response.data);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: "Erreur Orthanc", details: err.message });
  }
});

// Route pour obtenir les détails d'une étude DICOM
router.get('/studies/:id', async (req, res) => {
  try {
    const response = await axios.get(`${process.env.ORTHANC_URL}/studies/${req.params.id}`, {
      auth: {
        username: process.env.ORTHANC_USER || 'orthanc',
        password: process.env.ORTHANC_PASS || 'orthanc',
      },
    });
    res.json(response.data);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: "Erreur Orthanc", details: err.message });
  }
});

router.get('/instances/:id/preview', async (req, res) => {
  try {
    const response = await axios.get(`${process.env.ORTHANC_URL}/instances/${req.params.id}/preview`, {
      auth: {
        username: process.env.ORTHANC_USER || 'orthanc',
        password: process.env.ORTHANC_PASS || 'orthanc',
      },
      responseType: 'arraybuffer'
    });
    res.set('Content-Type', 'image/png');
    res.send(response.data);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: "Erreur Orthanc", details: err.message });
  }
});

router.get('/studies/:id/series', async (req, res) => {
  try {
    const response = await axios.get(`${process.env.ORTHANC_URL}/studies/${req.params.id}/series`, {
      auth: {
        username: process.env.ORTHANC_USER || 'orthanc',
        password: process.env.ORTHANC_PASS || 'orthanc',
      },
    });
    res.json(response.data);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: "Erreur Orthanc", details: err.message });
  }
});

// Route pour lister toutes les séries DICOM
router.get('/series', async (req, res) => {
  try {
    const response = await axios.get(`${process.env.ORTHANC_URL}/series`, {
      auth: {
        username: process.env.ORTHANC_USER || 'orthanc',
        password: process.env.ORTHANC_PASS || 'orthanc',
      },
    });
    res.json(response.data);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: "Erreur Orthanc", details: err.message });
  }
});

// Route pour obtenir les détails d'une série DICOM
router.get('/series/:id', async (req, res) => {
  try {
    const response = await axios.get(`${process.env.ORTHANC_URL}/series/${req.params.id}`, {
      auth: {
        username: process.env.ORTHANC_USER || 'orthanc',
        password: process.env.ORTHANC_PASS || 'orthanc',
      },
    });
    res.json(response.data);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: "Erreur Orthanc", details: err.message });
  }
});

// Route pour récupérer les instances d'une série
router.get('/series/:id/instances', async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(`${process.env.ORTHANC_URL}/series/${id}/instances`, {
      auth: {
        username: process.env.ORTHANC_USER || 'orthanc',
        password: process.env.ORTHANC_PASS || 'orthanc',
      },
    });
    res.json(response.data);
  } catch (error) {
    const err = error as Error;
    res.status(404).json({ success: false, error: "Instances non trouvées", details: err.message });
  }
});

export default router; 
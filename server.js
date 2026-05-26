const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname)); // Pou l ka louvri paj HTML yo

// Konfigirasyon Imèl la (Sèvi ak sèvis SMTP ou oswa Gmail)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'blondinealexis90@gmail.com', // Imèl ou
        pass: 'VOTRE_MOT_DE_PASSE_D_APPLICATION' // Modpas aplikasyon Gmail ou
    }
});

// ROUTE POU RESEVWA DEPO A NAN IMÈL
app.post('/api/deposit', upload.single('screenshot'), (req, res) => {
    const { amount, network } = req.body;
    
    const mailOptions = {
        from: 'Nexora Invest <blondinealexis90@gmail.com>',
        to: 'blondinealexis90@gmail.com',
        subject: `⚠️ NOUVEAU DÉPÔT SOUMIS - ${amount} USDT`,
        text: `Un utilisateur vient de soumettre un dépôt.\n\nMontant : ${amount} USDT\nRéseau : ${network}\n\nLe reçu est en pièce jointe. Le solde de l'utilisateur augmentera automatiquement dans 3 minutes.`,
        attachments: req.file ? [{ filename: req.file.originalname, path: req.file.path }] : []
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) return res.status(500).json({ success: false });
        res.json({ success: true });
    });
});

// ROUTE POU RESEVWA RETRÈ A NAN IMÈL
app.post('/api/withdraw', (req, res) => {
    const { amount, address } = req.body;

    const mailOptions = {
        from: 'Nexora Invest <blondinealexis90@gmail.com>',
        to: 'blondinealexis90@gmail.com',
        subject: `🚨 DEMANDE DE RETRAIT MANUEL`,
        text: `Un utilisateur demande un retrait.\n\nMontant à envoyer : ${amount} USDT\nAdresse Crypto de l'utilisateur : ${address}\n\nVeuillez effectuer le transfert manuellement depuis votre wallet personnel.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) return res.status(500).json({ success: false });
        res.json({ success: true });
    });
});

app.listen(3000, () => console.log('Serveur Nexora en cours d\'exécution sur le port 3000'));
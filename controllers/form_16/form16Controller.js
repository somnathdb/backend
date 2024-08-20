const form16Model = require('../../models/form_16/form16Model')
const axios = require('axios'); 

exports.UserLogin = (req, res, next) => {
    const { VendorNo, pan,financialYear,quarter } = req.body;
    console.log("55555",req.body)
    form16Model.findOne({ VendorNo, pan ,financialYear,quarter})
        .then(user => {
            if (user) {
                res.status(200).json({
                    title: "success",
                    message: 'Login successfully',
                    status: true,
                    data: user
                });
            } else {
                res.status(400).json({
                    title: "error",
                    message: 'Wrong Credentials',
                    status: false
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                title: "error",
                message: 'Internal Server Error',
                status: false,
                err: err
            });
        });
};


exports.convData= (req, res, next) => {
    const { url } = req.body;

    axios.head(url)
        .then(() => {
            res.json({ exists: true });
        })
        .catch(error => {
            if (error.response && error.response.status === 404) {
                res.json({ exists: false });
            } else {
                console.error('Error:', error);
                res.status(500).send('Server error');
            }
        });
};
module.exports = (err, res, status, msg) => {
    console.error(err);
    if (err.response.body) {
        return res.status(status).json({
            success: false,
            errors: { msg: err.response.body.detail }
        });
    }

    return res.status(status).json({
        success: false,
        errors: { msg }
    });
};
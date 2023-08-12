
module.exports.home_get = function(req, res){
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.render('home', {page: 'UI', userDetails: req.userDetails});
}
module.exports = {
    getValidation(req, res, next) {
        if (!req) {
         return next()
        } else {
         console.log('1.- It is a '+ `${req.url}`);
        }
        next()
     },
    verifyAddress(req, res, next) {
        if (!req) {
            return next()
           } else {
            console.log('2.- It is a '+ `${req.url}`);
           }
           next()
    },
    verifyName(req, res, next) {
        if (!req) {
            return next()
           } else {
            console.log('3.- It is a '+ `${req.url}`);
           }
           next()
    },
    verbGetnews(req, res, next) {
        if (req.url === '/a') {
            // Realiza acciones específicas para esta ruta
            console.log(':D Entre a ruta' + `${req.url}`);
          }
          next();
    }
     
}
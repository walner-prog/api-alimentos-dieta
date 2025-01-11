// Este archivo es un middleware que valida la API Key enviada en los encabezados de la solicitud.
// Comprueba si se ha proporcionado una clave válida en el encabezado `x-api-key`. Si no se proporciona 
// o si es inválida, responde con un error. Si la API Key es válida, permite que la solicitud continúe.

export default (req, res, next) => {
    const apiKey = req.headers['x-api-key']; // Leer el encabezado `x-api-key`

    if (!apiKey) {
        return res.status(401).json({ message: 'No se proporcionó una API Key' });
    }

    if (apiKey !== process.env.API_KEY) {
        return res.status(403).json({ message: 'API Key inválida' });
    }

    next(); // Continuar si la API Key es válida
};

const users = [
    { email: "sophie.bluel@test.tld", password: "SOphie" }, // Exemple d'utilisateur stocké en mémoire
];

const 

login = (req, res) => {
    const { email, password } = req.body;

    // Recherche de l'utilisateur
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        res.status(200).send("Connexion réussie !");
    } else {
        res.status(401).send("Nom d'utilisateur ou mot de passe incorrect.");
    }
};

const express = require("express");
const app = express();
app.use(express.json());

const PORT = 3000;
app.listen(PORT);

const pizze = [
    {id: 1, naziv: "Margherita", cijena: 6.5},
    {id: 2, naziv: "Capricciosa", cijena: 8.5},
    {id: 3, naziv: "Quattro formaggi", cijena: 10.0},
    {id: 4, naziv: "Sunka sir", cijena: 7.0},
    {id: 5, naziv: "Vegetariana", cijena: 9.0}
];



app.get("/", (req,res) => {
    res.send("Hello, world!");
});



app.get("/pizze", (req,res) => {
    res.json(pizze);
});



app.get("/pizze/:id", (req,res) => {
    const id_pizza = req.params.id;
    const pizza = pizze.find(pizza => pizza.id == id_pizza)
    if (isNaN(id_pizza)) {
        res.json({ message: "prosljedili ste parametar id koji nije broj!" });
        return;
    }
    if (pizza) {
        res.json(pizza);
    } else {
        res.json({message: "Pizza s trazenim IDem ne postoji." });
    }
});



let listanarudzbe = []; 
app.post("/naruci", (req,res) => {
    let { narudzba, klijent } = req.body;
    let ukupna_cijena = 0;
    let message = "Vasa narudzba za ";

    if (!Array.isArray(narudzba)) {
        return res.send("Narudzba mora sadrzavati listu pizza");
    }
    

    for (let i = 0; i < narudzba.length; i++) {
        const kljucevi = Object.keys(narudzba[i]);

        if (!(kljucevi.includes("pizza") && kljucevi.includes("velicina") && kljucevi.includes("kolicina"))) {
            return res.send("Niste poslali sve potrebne podatke za narudzbu!");
        }
        if (!pizze.find(pizza => pizza.naziv == narudzba[i].pizza)) {
            return res.send(`Jedna ili vise pizza koju ste narucili ne postoji`);
        }
        listanarudzbe.push(narudzba[i]);
        
        const pizza = pizze.find(pizza => pizza.naziv == narudzba[i].pizza) 
        
        ukupna_cijena= ukupna_cijena + pizza.cijena * narudzba[i].kolicina;
        
        message += `${narudzba[i].kolicina} ${narudzba[i].pizza} (${narudzba[i].velicina})`;
        
        if (i < narudzba.length - 1) {
            message += " i ";
        } else {
            message += " je uspješno zaprimljena!";
        }    
    }
    const kljucevia = Object.keys(klijent || {});
        if (!(kljucevia.includes("prezime") && kljucevia.includes("adresa") && kljucevia.includes("broj_telefona"))) {
         return res.send("Niste poslali sve potrebne podatke za narudzbu!");
        }

    console.log(`Primljeni podaci: `, narudzba );
    
    

    res.json({
        message,
        prezime: klijent.prezime,
        adresa: klijent.adresa,
        ukupna_cijena: ukupna_cijena
    });
});

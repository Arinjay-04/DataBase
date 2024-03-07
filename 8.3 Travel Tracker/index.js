import express from "express";
import bodyParser from "body-parser";
import pg from "pg"


const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "Arinjay@04",
  port: 5432
})

db.connect();


const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


async function code (){
  const result = await db.query("SELECT country_code FROM visited_country")

  let countries = [];

  result.rows.forEach((country) => {
    countries.push(country.country_code);
  }) 
     return countries;
}


app.get("/", async (req, res) => {
  //Write your code here.
  const countries = await code();
  res.render("index.ejs", {countries : countries , total: countries.length  })
});


app.post('/add' , async (req , res) => {
  const ans = req.body["country"]
  const result = await db.query("SELECT country_code FROM world_countries WHERE country_name = $1", [ans]);

  // const data = result.rows[0];
  // const countrycode = data.country_code;

  await db.query("INSERT INTO visited_country (country_code) VALUES ($1)", [
   result.rows[0].country_code ]
  );

  // res.render("index.ejs", {countries : countries , total: countries.length  });
  res.redirect('/');
  

})



app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

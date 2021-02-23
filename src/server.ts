import express, { response } from 'express';

const app = express();
app.use(express.json());

app.get('/', (request, response) => {
    return response.json({message: "Hello world - NLW04"})
})

app.post("/", (request, response) => {
    return response.json({message: "Os dados foram salvos com sucesso!"})
})

app.listen(3333, () => console.log("Server is running on port 3333!"))
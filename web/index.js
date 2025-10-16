const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// In-memory store: { phone: { readings: [...] , meta: {...} } }
const store = {};

app.post('/patients/:phone/readings', (req,res)=>{
  const phone = req.params.phone;
  const payload = req.body;
  if(!store[phone]) store[phone] = {readings:[], meta:{}};
  store[phone].readings.push({ts:Date.now(), ...payload});
  res.status(201).json({ok:true});
});

app.get('/patients/:phone/readings', (req,res)=>{
  const phone = req.params.phone;
  const data = store[phone] || {readings:[]};
  res.json(data);
});

app.get('/health', (req,res)=> res.json({ok:true, uptime: process.uptime()}));

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=> console.log('Server running on',PORT));

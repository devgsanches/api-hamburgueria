const express = require('express')
const cors = require('cors')
const app = express() // created server
const port = 3001

app.use(express.json())
app.use(cors())

const { v4: uuidv4 } = require('uuid'); // lib uuid
const orders = [];

const checkOrderId = (req, res, next) => {
    const { id } = req.params
    const index = orders.findIndex(order => order.id === id)
    if (id < 0) {
        return res.status(404).json({ message: "Order Not Found." })
    }

    req.id = id
    req.index = index

    next()
}

app.get('/order', (req, res) => {
    return res.status(200).json(orders)
})

app.post('/order', (req, res) => {
    const { order, clientName } = req.body
    const clientOrder = { id: uuidv4(), order, clientName }

    orders.push(clientOrder)
    return res.status(200).json(clientOrder)
})

app.put('/order/:id', checkOrderId, (req, res) => {
    const { id, index } = req

    const { order, clientName } = req.body
    const updateOrder = { id, order, clientName }

    orders[index] = updateOrder

    return res.status(200).json(updateOrder)
})

app.delete('/order/:id', checkOrderId, (req, res) => {
    const { index } = req

    orders.splice(index, 1)
    return res.status(204).json()
})

app.listen(port, () => {
    console.log(`🚀 Server started in port ${port}`)
})
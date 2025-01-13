const express = require('express')
const app = express() // created server
const port = 3000

app.use(express.json())

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

const checkMethodAndUrl = (req, res, next) => {
    const { method, url } = req

    console.log(`A Rota é do tipo ${method}, e o PATH é ${url}.`)

    next()
}

app.use(checkMethodAndUrl)

app.post('/order', (req, res) => {
    const { order, clientName, price } = req.body
    const clientOrder = { id: uuidv4(), order, clientName, price, status: "Em preparação" }

    orders.push(clientOrder)
    return res.status(200).json(clientOrder)
})

app.get('/order', (req, res) => {
    return res.status(200).json(orders)
})

app.put('/order/:id', checkOrderId, (req, res) => {
    const { id, index } = req

    const { order, clientName, price, status } = req.body
    const updateOrder = { id, order, clientName, price, status }

    orders[index] = updateOrder

    return res.status(200).json(updateOrder)
})

app.delete('/order/:id', checkOrderId, (req, res) => {
    const { index } = req

    orders.splice(index, 1)
    return res.status(204).json()
})

app.get('/order/:id', checkOrderId, (req, res) => {
    const { index } = req
    const order = orders[index]

    return res.status(200).json(order)
})

app.patch('/order/:id', checkOrderId, (req, res) => {
    const { index } = req

    const order = orders[index]
    order.status = "Pronto"

    return res.status(200).json(order)
})

app.listen(port, () => {
    console.log('🚀 Server started')
})
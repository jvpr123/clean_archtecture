import request from 'supertest'
import app from '../config/app'

describe('Body-parser middleware', () => {
    test('Should parse body as JSON', async () => {
        app.post('/test-body-parser', (req, res) => res.send(req.body))

        await request(app).post('/test-body-parser').send({ name: 'João' }).expect({ name: 'João' })
    })
})

import { encryptBody, init } from "../index"

describe('encrypt-body', ()=> {

    interface Child {
        name: string
        age: number
    }

    interface Body {
        id: number
        name: string
        age: number
        favoriteMovies: string[]
        child: Child
    }

    let body: Body;

    beforeAll(()=>{
        body = {
            id: 1,
            name: 'john stuart',
            age: 20,
            favoriteMovies: ['start wars'],
            child: {
                age: 12,
                name: 'nancy'
            }
        }
    })

    it('should be defined', async ()=>{

        const secret = init();
        console.log(secret)

        const encrypt = async () => await encryptBody<Body>(body, secret);
        const encrypted = await encrypt();
        expect(encrypted).toBeDefined();
        expect(encrypted).toHaveProperty(['id', 'name', 'age', 'favoriteMovies', 'child']);
        console.log(encrypted);
    })
})
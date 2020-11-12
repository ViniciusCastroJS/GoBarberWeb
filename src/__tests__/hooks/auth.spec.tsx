import { act, renderHook } from "@testing-library/react-hooks"
import { AuthProvider, useAuth } from "../../hooks/auth"
import MockAdapter from 'axios-mock-adapter'
import api from "../../services/api";


const apiMock = new MockAdapter(api);

const APIdata = {
    User: {
        id: '1',
        name: 'John',
        email: 'teste@gmail.com'
    },
    token: 'token-123'
}


describe('Auth Hook', () =>{
    // Teste para ver se é possível logar.
    it(' Should Sign In', async() =>{

        const setItemSpy = jest.spyOn( Storage.prototype, 'setItem');
        const { result, waitForNextUpdate } = renderHook( useAuth, {
            wrapper: AuthProvider
        })

        apiMock.onPost('sessions').reply(200, APIdata)

        result.current.signIn({
            email: 'teste@gmail.com',
            password: '123456'
        })

        await waitForNextUpdate();

        expect(setItemSpy).toHaveBeenCalledWith('@GoBarber:user', JSON.stringify(APIdata.User));
        expect(setItemSpy).toHaveBeenCalledWith('@GoBarber:token', APIdata.token );
        expect(result.current.user.email).toEqual('teste@gmail.com')
    })

    it('Should restore saved data from local storage when auth init', () =>{
        const getItemSpy = jest.spyOn( Storage.prototype, 'getItem').mockImplementation(
            key => {
                switch (key) {
                    case '@GoBarber:user': 
                        return JSON.stringify(APIdata.User)
                    case '@GoBarber:token': 
                        return APIdata.token
                    default:
                        return null;
                }
            }
        )
        const { result } = renderHook( useAuth, {
            wrapper: AuthProvider
        })

        expect(result.current.user.email).toEqual('teste@gmail.com');

    })


    it('Should able to Sign Out', async() => {
        jest.spyOn( Storage.prototype, 'getItem').mockImplementation(
            key => {
                switch (key) {
                    case '@GoBarber:user': 
                        return JSON.stringify(APIdata.User)
                    case '@GoBarber:token': 
                        return APIdata.token
                    default:
                        return null;
                }
            }
        )
        
        const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem')

        const { result } = renderHook( useAuth, {
            wrapper: AuthProvider
        })

        act(()=>{
            result.current.signOut();
        })

        expect(result.current.user).toBeUndefined();
        expect(removeItemSpy).toHaveBeenCalledTimes(2);

    })


    it('Should Update the user', async() =>{
        
        const setItemSpy = jest.spyOn(Storage.prototype, 'setItem')

        const { result } = renderHook( useAuth, {
            wrapper: AuthProvider
        })

        const user =  {
            id: '2',
            name: 'John Teste',
            email: 'teste2@gmail.com',
            avatar_url: 'teste.jpg'
        }


        act(() => {
            result.current.updateUser(user)
        })

        expect(setItemSpy).toHaveBeenCalledWith('@GoBarber:user', JSON.stringify(user))
        expect(result.current.user).toEqual(user);

    })
})

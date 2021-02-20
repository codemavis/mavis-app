export const APIs = {
    user: {
        get: 'http://localhost:5000/user',
        getCurrent: 'http://localhost:5000/user/curruser',
        edit: 'http://localhost:5000/user',
        create: 'http://localhost:5000/user',
        delete: 'http://localhost:5000/user',
        prev: 'http://localhost:5000/user/prev',
        next: 'http://localhost:5000/user/next',
        supervisor: 'http://localhost:5000/user/supervisor',
        supervisors: 'http://localhost:5000/user/supervisors',
        role: 'http://localhost:5000/user/role'
    },
    location: {
        get: 'http://localhost:5000/location'
    },
    list: {
        state: 'http://localhost:5000/list/state'
    },
    po: {
        getInitial: 'http://localhost:5000/po/empty',
        create: 'http://localhost:5000/po',
        edit: 'http://localhost:5000/po',
        get: 'http://localhost:5000/po',
        prev: 'http://localhost:5000/po/prev',
        next: 'http://localhost:5000/po/next',
        delete: 'http://localhost:5000/po',
    }
}
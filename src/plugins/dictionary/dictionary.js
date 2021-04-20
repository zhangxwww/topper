// import axios from 'axios'

export default {
    match (q) {
        console.log(q)
        return true
    },
    query (q, callback) {
        console.log(q)
        callback(['Nothing Found'])
    }
}

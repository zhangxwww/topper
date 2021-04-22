let storage = []
const maxHistory = 1000

let curPos = 0
let showHistory = false

function historyUp () {
    if (!showHistory) {
        showHistory = true
        curPos = storage.length
    }
    curPos = Math.max(curPos - 1, 0)
    return storage[curPos]
}

function historyDown () {
    console.log(curPos)
    curPos += 1
    if (curPos >= storage.length) {
        curPos = storage.length
        showHistory = false
        return {query: '', result: []}
    }
    return storage[curPos]
}

function historyAdd (query, result) {
    storage.push({query: query, result: result})
    if (storage.length > maxHistory) {
        storage = storage.slice(1)
    }
    console.log(storage)
}

function historyReset () {
    showHistory = false
}

export {
    historyUp,
    historyDown,
    historyAdd,
    historyReset
}
